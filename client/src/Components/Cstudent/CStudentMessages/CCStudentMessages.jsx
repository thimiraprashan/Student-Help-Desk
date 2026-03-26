import React, { useState, useEffect, useRef } from "react";
import ChatItem from "./ChatItem";
import Sidebar from "../../Common/Sidebar";
import EmojiPicker from "emoji-picker-react";

const CCStudentMessages = ({ db, setDb, userId }) => {

  const [activeThread, setActiveThread] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [companies, setCompanies] = useState([]);
  const chatEndRef = useRef(null);

  const messages = db.messages || [];

  // ✅ THREAD ID (SAFE 🔥)
  const makeThreadId = (id1, id2) => {
    return [String(id1), String(id2)].sort().join("_");
  };

  // 🔥 LOAD COMPANIES
  useEffect(() => {
    fetch("http://localhost:5000/company-profile")
      .then(res => res.json())
      .then(data => {
        const list = Array.isArray(data) ? data : [data];
        setCompanies(list);
      })
      .catch(err => console.log(err));
  }, []);

  // 🔥 FIXED ACTIVE THREAD (IMPORTANT)
  useEffect(() => {
    if (companies.length && !activeThread) {
      const firstId = String(companies[0]._id); // ✅ FIXED
      setActiveThread({ companyId: firstId });
    }
  }, [companies]);

  // 🔥 FETCH MESSAGES
  useEffect(() => {
if (!activeThread || !userId) return;

    fetch(`http://localhost:5000/messages/${userId}/${activeThread.companyId}`)
      .then(res => res.json())
      .then(data => {
        setDb(prev => ({
  ...prev,
  messages: data || []
}));
      })
      .catch(err => console.log(err));

  }, [activeThread]);

  // 🔥 FIXED THREAD FILTER
  const getThread = (companyId, studentId) => {
    const tid = makeThreadId(String(companyId), String(studentId)); // ✅ FIXED
    return messages.filter((m) => m.threadId === tid);
  };

  // 🔥 SEND TEXT (FIXED)
  const sendMessage = async () => {
    if (!newMessage.trim() || !activeThread) return;

    const msg = {
      threadId: makeThreadId(String(activeThread.companyId), String(userId)), // ✅ FIXED
      fromId: String(userId),
      toId: String(activeThread.companyId),
      content: newMessage,
      date: new Date().toISOString(),
      read: false,
    };

    const res = await fetch("http://localhost:5000/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(msg),
    });

    const savedMsg = await res.json();

    setDb(prev => ({
      ...prev,
      messages: [...prev.messages, savedMsg],
    }));

    setNewMessage("");
  };

  // 🔥 FILE SEND (FIXED)
  const sendFile = async (file) => {
    if (!file || !activeThread) return;

    const msg = {
      threadId: makeThreadId(String(activeThread.companyId), String(userId)), // ✅ FIXED
      fromId: String(userId),
      toId: String(activeThread.companyId),
      content: "📎 " + file.name,
      file: file.name,
      date: new Date().toISOString(),
      read: false,
    };

    const res = await fetch("http://localhost:5000/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(msg),
    });

    const savedMsg = await res.json();

    setDb(prev => ({
      ...prev,
      messages: [...prev.messages, savedMsg],
    }));
  };

  // 🔽 AUTO SCROLL
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, activeThread]);

  return (
    <div className="flex min-h-screen bg-white text-gray-800">

      <Sidebar session={{ name: "Student" }} role="student" />

      <div className="flex flex-1">

        {/* LEFT */}
        <div className="w-full max-w-sm border-r bg-white p-4 overflow-y-auto">

          <h2 className="text-lg font-semibold mb-4 text-gray-700">
            💬 Messages
          </h2>

          {companies.map((company) => {

            const companyId = String(company._id); // ✅ FIXED
            const companyName = company.name || company.companyName;
const thread = getThread(String(companyId), String(userId));
            const last = thread[thread.length - 1] || {};

            const unread = messages.filter(
              (m) =>
                m.threadId === makeThreadId(String(companyId), String(userId)) &&
                String(m.toId) === String(userId) &&
                !m.read
            ).length;

            return (
              <ChatItem
                key={companyId}
               student={{
  _id: companyId,
  name: companyName
}}
                lastMessage={last}
                unread={unread}
                active={activeThread?.companyId === companyId}
                onClick={() =>
                  setActiveThread({ companyId })
                }
              />
            );
          })}

        </div>

        {/* RIGHT */}
        <div className="flex-1 flex flex-col p-4 bg-[#f8fafc]">

          {!activeThread ? (
            <div className="text-gray-400 flex items-center justify-center h-full">
              Select a conversation
            </div>
          ) : (
            <>
              {/* CHAT */}
              <div className="flex-1 overflow-y-auto space-y-2 mb-4">

                {getThread(activeThread.companyId, userId).map((msg) => {

                  const isMe = String(msg.fromId) === String(userId);

                  return (
                    <div
                      key={msg._id || msg.id}
                      className={`flex w-full ${
                        isMe ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`px-4 py-2 rounded-2xl text-sm shadow max-w-[70%] ${
                          isMe
                            ? "bg-green-500 text-white rounded-br-none"
                            : "bg-white text-gray-800 rounded-bl-none border"
                        }`}
                      >
                        {msg.file ? msg.file : msg.content}
                      </div>
                    </div>
                  );
                })}

                <div ref={chatEndRef} />
              </div>

              {/* INPUT */}
              <div className="flex items-center gap-2 bg-white p-2 border rounded-xl relative">

                <button onClick={() => setShowEmoji(!showEmoji)}>
                  😊
                </button>

                {showEmoji && (
                  <div className="absolute bottom-14 z-50">
                    <EmojiPicker
                      onEmojiClick={(e) =>
                        setNewMessage((prev) => prev + e.emoji)
                      }
                    />
                  </div>
                )}

                <input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && sendMessage()
                  }
                  placeholder="Type message..."
                  className="flex-1 px-3 py-2 outline-none"
                />

                <input
                  type="file"
                  onChange={(e) => sendFile(e.target.files[0])}
                />

                <button
                  onClick={sendMessage}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
                >
                  Send
                </button>

              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CCStudentMessages;