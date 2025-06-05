// emailRoutes.js
const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");

router.post("/", async (req, res) => {
  const { name, email, message } = req.body;

  // Configure Nodemailer for Gmail
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'sadhu.chirag.amrutdas@gmail.com', // Replace with your Gmail address
      pass: 'kvyd zrie iqok vqdt'    // Replace with your Gmail App Password
    }
  });

  const mailOptions = {
    from: 'sadhu.chirag.amrutdas@gmail.com', // Use the email provided in the contact form
    to: 'sadhu.chirag.amrutdas@gmail.com',     // Send to your Gmail for testing
    subject: `New Contact Form Submission from ${name}`,
    html: `
      <h3>New message from the contact form:</h3>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong> ${message}</p>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId);
    res.json({ success: true, message: 'Email sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ success: false, message: 'Failed to send email.' });
  }
});

module.exports = router;