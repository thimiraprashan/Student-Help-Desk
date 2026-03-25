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

    // ✅ ALWAYS CREATE BOTH POSSIBLE THREAD IDS
    const threadId1 = `c${id2}_s${id1}`;
    const threadId2 = `c${id1}_s${id2}`;

    // ✅ FIND BOTH DIRECTIONS
    const messages = await Message.find({
      $or: [
        { threadId: threadId1 },
        { threadId: threadId2 }
      ]
    }).sort({ date: 1 });

    res.json(messages);

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};