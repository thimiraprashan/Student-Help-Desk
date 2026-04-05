export const sendMessage = async (req, res) => {
  try {
    const { threadId, fromId, toId, content, file } = req.body;

    if (!threadId || !fromId || !toId) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const msg = new Message({
      threadId,
      fromId,
      toId,
      content,
      file,
    });

    await msg.save();

    res.status(201).json(msg);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔥 GET MESSAGES (FULL FIXED ✅)
export const getMessages = async (req, res) => {
  try {
    const { id1, id2 } = req.params;

    const threadId = [String(id1), String(id2)].sort().join("_");

    // ✅ mark messages as read
    await Message.updateMany(
      { threadId, toId: id1, read: false },
      { $set: { read: true } }
    );

    const messages = await Message.find({ threadId }).sort({ date: 1 });

    res.json(messages);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};