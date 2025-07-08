const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = 5051;
let verificationCodes = {}; // For demo only — use a database or Redis in production

// Email config (using Gmail as example)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'dbprojectdudin@gmail.com',
    pass: 'dgfjmrwpymscqwdo' // Use app-specific password
  }
});

// Route to request 2FA code
app.post('/send-2fa', async (req, res) => {
  const { email } = req.body;
  const code = Math.floor(100000 + Math.random() * 900000).toString();

  // Save code temporarily
  verificationCodes[email] = {
    code,
    expires: Date.now() + 5 * 60 * 1000 // 5 minutes
  };

  try {
    await transporter.sendMail({
      to: email,
      subject: 'Your 2FA Verification Code',
      text: `Your 2FA code is ${code}`
    });
    res.json({ message: 'Verification code sent' });
  } catch (err) {
    console.error('Email send error:', err);
    res.status(500).json({ message: 'Email failed to send' });
  }
});

// Route to verify 2FA code
app.post('/verify-2fa', (req, res) => {
  const { email, code } = req.body;
  const record = verificationCodes[email];

  if (
    record &&
    record.code === code &&
    Date.now() < record.expires
  ) {
    delete verificationCodes[email]; // One-time use
    res.json({ success: true });
  } else {
    res.status(400).json({ success: false, message: 'Invalid or expired code' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});