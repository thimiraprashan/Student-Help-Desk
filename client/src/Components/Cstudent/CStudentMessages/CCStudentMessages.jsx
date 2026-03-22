import React, { useState } from "react";
import ChatItem from "./ChatItem";
import Sidebar from "../../Common/Sidebar";

const CCStudentMessages = ({ db, setDb, userId, getThread, threadId }) => {

  const [activeThread, setActiveThread] = useState(null);
  const [newMessage, setNewMessage] = useState("");

  const myThreadIds = [
    ...new Set(
      db.messages
        .filter((m) => m.toId === userId || m.fromId === userId)
        .map((m) => m.threadId)
    ),
  ];

  // ✅ SEND MESSAGE
  const sendMessage = () => {
    if (!newMessage.trim() || !activeThread) return;

    const newMsg = {
      id: Date.now(),
      threadId: threadId(
        activeThread.companyId,
        activeThread.studentId
      ),
      fromId: userId,
      toId: activeThread.studentId,
      fromRole: "company",
      content: newMessage,
      date: new Date().toLocaleTimeString(),
      read: false,
    };

    setDb({
      ...db,
      messages: [...db.messages, newMsg],
    });

    setNewMessage("");
  };

  const currentThread = activeThread
    ? getThread(activeThread.companyId, activeThread.studentId)
    : [];

  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* Sidebar */}
      <Sidebar session={{ name: "Company" }} unreadCount={0} />

      <div className="flex flex-1">

        {/* ================= LEFT CHAT LIST ================= */}
        <div className="w-full max-w-sm border-r bg-white p-4 overflow-y-auto">

          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            💬 Messages
          </h2>

          {myThreadIds.map((tid) => {
            const parts = tid.split("_");
            const companyId = parseInt(parts[0].replace("c", ""));
            const studentId = parseInt(parts[1].replace("s", ""));

            const student = db.students.find(
              (s) => s.id === studentId
            );

            const thread = getThread(companyId, studentId);
            const last = thread[thread.length - 1] || {};

            const unread = db.messages.filter(
              (m) =>
                m.threadId === tid &&
                m.toId === userId &&
                !m.read
            ).length;

            return (
              <ChatItem
                key={tid}
                student={student}
                lastMessage={last}
                unread={unread}
                onClick={() =>
                  setActiveThread({ companyId, studentId })
                }
              />
            );
          })}
        </div>

        {/* ================= RIGHT CHAT ================= */}
        <div className="flex-1 flex flex-col p-4">

          {!activeThread ? (
            <div className="text-gray-400 flex items-center justify-center h-full">
              Select a conversation
            </div>
          ) : (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto space-y-2 mb-4">

                {currentThread.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.fromId === userId
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`px-3 py-2 rounded-lg text-sm max-w-xs ${
                        msg.fromId === userId
                          ? "bg-indigo-500 text-white"
                          : "bg-blue-100 text-gray-700"
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}

              </div>

              {/* Input */}
              <div className="flex gap-2">

                <input
                  value={newMessage}
                  onChange={(e) =>
                    setNewMessage(e.target.value)
                  }
                  placeholder="Type message..."
                  className="flex-1 px-3 py-2 border border-blue-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                />

                <button
                  onClick={sendMessage}
                  className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg"
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