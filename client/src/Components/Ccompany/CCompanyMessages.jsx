import React, { useState, useEffect, useRef } from "react";
import ChatItem from "../Cstudent/CStudentMessages/ChatItem";
import Sidebar from "../Common/SSidebar";

const CCompanyMessages = ({ db, setDb, userId }) => {

  const [activeThread, setActiveThread] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const chatEndRef = useRef(null);

  // 🔥 NEW (student real names)
  const [studentProfiles, setStudentProfiles] = useState({});

  const messages = db.messages || [];

  // ✅ THREAD ID (FIXED 🔥)
const makeThreadId = (id1, id2) => {
  return [String(id1).trim(), String(id2).trim()]
    .sort()
    .join("_");
};

  const getThread = (allMessages, companyId, studentId) => {
    const threadId = makeThreadId(companyId, studentId);
    return allMessages.filter((message) => message.threadId === threadId);
  };

  // 🔥 LOAD STUDENT PROFILE NAMES
  useEffect(() => {
    if (!db.students?.length) return;

    db.students.forEach((s) => {
      fetch(`http://localhost:5000/api/cv/${s.id}`)
        .then(res => res.json())
        .then(data => {
          if (data?.name) {
            setStudentProfiles(prev => ({
              ...prev,
              [s.id]: data.name
            }));
          }
        })
        .catch(() => {});
    });
  }, [db.students]);

  // ✅ AUTO SEED
  useEffect(() => {
    if (!messages.length) {
      setDb({
        ...db,
        messages: [
          {
            id: 1,
            threadId: makeThreadId(String(userId), "1"), // ✅ FIX
            fromId: "1",
            toId: String(userId),
            content: "Hi company!",
            date: new Date().toISOString(),
            read: false,
          },
        ],
        onlineUsers: ["1", String(userId)],
      });
    }
  }, []);

  // ✅ AUTO OPEN (FIXED 🔥)
  useEffect(() => {
    if (db.students?.length && !activeThread) {
      const firstStudentId = String(db.students[0]._id || db.students[0].id); // ✅ FIX
      setActiveThread({ studentId: firstStudentId });
    }
  }, [db.students]);

  // 🔥 LOAD MESSAGES
  useEffect(() => {
    if (!activeThread) return;

    fetch(`http://localhost:5000/messages/${userId}/${activeThread.studentId}`)
      .then(res => res.json())
      .then(data => {
setDb(prev => ({
  ...prev,
  messages: [
    ...prev.messages.filter(
      m => m.threadId !== makeThreadId(userId, activeThread.studentId)
    ),
    ...(data || [])
  ]
}));
      })
      .catch(err => console.log(err));
  }, [activeThread]);

  // ✅ SEND MESSAGE (FIXED 🔥)
  const sendMessage = async () => {
    if (!newMessage.trim() || !activeThread) return;

    const msg = {
      threadId: makeThreadId(String(userId), String(activeThread.studentId)), // ✅ FIX
      fromId: String(userId),
      toId: String(activeThread.studentId),
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

    setDb((prev) => ({
      ...prev,
      messages: [...(prev.messages || []), savedMsg],
    }));

    setNewMessage("");
  };

  // 📎 FILE (FIXED 🔥)
  const sendFile = async (file) => {
    if (!file || !activeThread) return;

    const msg = {
      threadId: makeThreadId(String(userId), String(activeThread.studentId)), // ✅ FIX
      fromId: String(userId),
      toId: String(activeThread.studentId),
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

    setDb((prev) => ({
      ...prev,
      messages: [...(prev.messages || []), savedMsg],
    }));
  };

  // ✅ AUTO SCROLL
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex min-h-screen bg-white text-gray-800">

      <Sidebar session={{ name: "Company" }} unreadCount={0} />

      <div className="flex flex-1">

        {/* LEFT */}
        <div className="w-80 border-r bg-white p-4 overflow-y-auto">

          <h2 className="text-lg font-semibold mb-4 text-gray-700">
            💬 Messages
          </h2>

          {db.students?.map((s) => {

            const studentId = String(s._id || s.id); // ✅ FIX

            const thread = getThread(messages, userId, studentId);
            const last = thread[thread.length - 1] || {};

            return (
<ChatItem
  key={studentId}
  student={{
    ...s,
    id: studentId,
    name: studentProfiles[studentId] || s.name
  }}
  lastMessage={last}
  unread={0}
  active={activeThread?.studentId === studentId}
  onlineUsers={db.onlineUsers || []}
  onClick={() => setActiveThread({ studentId })}
  currentUserId={userId}   // ✅ ADD
/>
            );
          })}

        </div>

        {/* RIGHT */}
        <div className="flex-1 flex flex-col p-4 bg-[#f8fafc]">

          {!activeThread ? (
            <div className="flex items-center justify-center h-full text-gray-400">
              Select a conversation
            </div>
          ) : (
            <>
              {/* CHAT */}
              <div className="flex-1 overflow-y-auto space-y-2 mb-4">

                {getThread(messages, userId, activeThread.studentId).map((m) => (
                  <div
                    key={m._id || m.id}
                    className={`flex ${
                      String(m.fromId) === String(userId)
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`px-4 py-2 rounded-2xl text-sm shadow max-w-xs ${
                        String(m.fromId) === String(userId)
                          ? "bg-green-500 text-white rounded-br-none"
                          : "bg-white text-gray-800 rounded-bl-none border"
                      }`}
                    >
                      {String(m.fromId) !== String(userId) && (
                        <div className="text-xs text-gray-500 mb-1">
                          {studentProfiles[activeThread.studentId] || "Student"}
                        </div>
                      )}

                      {m.file ? m.file : m.content}
                    </div>
                  </div>
                ))}

                <div ref={chatEndRef} />
              </div>

              {/* INPUT */}
              <div className="flex items-center gap-2 bg-white p-2 border rounded-xl">

                <button onClick={() => setShowEmoji(!showEmoji)}>
                  😊
                </button>

                {showEmoji && (
                  <div className="absolute bottom-20 z-50 rounded-xl border bg-white p-3 shadow-lg">
                    <button
                      type="button"
                      onClick={() => {
                        setNewMessage((prev) => prev + "😊");
                        setShowEmoji(false);
                      }}
                      className="text-2xl"
                    >
                      😊
                    </button>
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
                  onChange={(e) =>
                    sendFile(e.target.files[0])
                  }
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

export default CCompanyMessages;
