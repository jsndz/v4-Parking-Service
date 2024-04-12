const express = require("express");
const { SerialPort } = require("serialport");
const { ReadlineParser } = require("@serialport/parser-readline");
const path = require("path");
const nodemailer = require("nodemailer");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
const port = new SerialPort({ path: "/dev/ttyACM1", baudRate: 115200 });
const parser = port.pipe(new ReadlineParser({ delimiter: "\r\n" }));

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "jaisondz9741@gmail.com",
    pass: "oqordwcgzktourkd",
  },
});

port.on("open", () => {
  console.log("Serial port is open");
});

parser.on("data", (data) => {
  duration = parseInt(data);

  if (!isNaN(duration)) {
    console.log("Received duration:", duration, "seconds");
  } else {
    console.log("Received data is not a valid duration:", data);
  }
});
function getDuration(duration) {
  return duration;
}
port.on("error", (err) => {
  console.error("Error:", err.message);
});
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});
app.post("/sendEmail", (req, res) => {
  const toMail = req.body.toMail;
  if (duration !== undefined && !isNaN(duration)) {
    sendEmail(duration, toMail);
    res.send(`Email will be sent to ${toMail}`);
  } else {
    res.status(500).send("Error: No valid duration received.");
  }
});

function sendEmail(duration, toMail) {
  var time = duration / 60;
  var cost = time * 2;
  const mailOptions = {
    from: {
      name: "v4 Parking Service",
      address: "jaisondz9741@gmail.com",
    },
    to: toMail,
    subject: "Parking Duration",
    html: `
      <p>Dear Customer,</p>
      <p>Your parking duration is ${time} minutes.</p>
      <p>The total cost for your parking is ${cost} Rs.</p>
      <p>Please find the QR code for payment attached below:</p>
      <img src="cid:qrCode">
    `,
    attachments: [
      {
        filename: "hsi.jpg",
        path: path.join(__dirname, "hsi.jpg"),
        cid: "qrCode",
      },
    ],
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
}

app.listen(3000, () => {
  console.log(`Server is running on http://localhost:3000`);
});
