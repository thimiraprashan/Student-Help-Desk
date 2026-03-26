import Message from "../Model/CSMessageModel.js";

// 🔥 SEND MESSAGE (NO CHANGE)
export const sendMessage = async (req, res) => {
  try {
    const msg = new Message(req.body);
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

    const makeThreadId = (id1, id2) => {
      return [String(id1), String(id2)].sort().join("_");
    };

    const threadId = makeThreadId(id1, id2);

    const messages = await Message.find({
      threadId: threadId,
    }).sort({ date: 1 });

    res.json(messages);

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};