const ContactMessage = require('../models/ContactMessage');

exports.createMessage = async (req, res) => {
  try {
    const { firstName, lastName, email, message } = req.body;
    const msg = new ContactMessage({ firstName, lastName, email, message });
    await msg.save();
    // if form submission from browser, redirect back
    if (req.headers.accept && req.headers.accept.includes('text/html')) {
      return res.redirect('/contact.html');
    }
    res.status(201).json({ message: 'Message received' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const list = await ContactMessage.find().sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
