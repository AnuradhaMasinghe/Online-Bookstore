// server.js or routes/messages.js
const express = require("express");
const router = express.Router();
const Message = require("../models/message"); // Mongoose model

router.post("/messages", async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const newMessage = new Message({ name, email, message });
    await newMessage.save();
    res.status(201).json({ msg: "Message saved" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
