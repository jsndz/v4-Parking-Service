const { SerialPort } = require("serialport");
const { ReadlineParser } = require("@serialport/parser-readline");
const path = require("path");
const nodemailer = require("nodemailer");
var port = new SerialPort({ path: "/dev/ttyACM1", baudRate: 115200 });
const { pw } = require("./config");
const parser = port.pipe(new ReadlineParser({ delimiter: "\r\n" }));
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "jaisondz9741@gmail.com",
    pass: pw,
  },
});
port.on("open", () => {
  console.log("Serial port is open");
});

parser.on("data", (data) => {
  const duration = parseInt(data);

  if (!isNaN(duration)) {
    console.log("Received duration:", duration, "seconds");
    sendEmail(duration, "jaisondz9360@gmail.com");
  } else {
    console.log("Received data is not a valid duration:", data);
  }
});

port.on("error", (err) => {
  console.error("Error:", err.message);
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
