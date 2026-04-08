import React, { useState, useEffect, useRef } from "react";
import ChatItem from "./ChatItem";
import Sidebar from "../../Common/Sidebar";
import EmojiPicker from "emoji-picker-react";

const CCStudentMessages = ({ db, setDb, userId, studentSession }) => {

  const [activeThread, setActiveThread] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [companyProfiles, setCompanyProfiles] = useState({});
  const [availableCompanies, setAvailableCompanies] = useState([]);
  const chatEndRef = useRef(null);

  const messages = db.messages || [];

  // ✅ THREAD ID (SAFE 🔥)
  const makeThreadId = (id1, id2) => {
    return [String(id1).trim(), String(id2).trim()]
      .sort()
      .join("_");
  };

  useEffect(() => {
    fetch("http://localhost:5000/company-auth")
      .then((res) => res.json())
      .then((data) => {
        setAvailableCompanies(Array.isArray(data) ? data : []);
      })
      .catch((err) => console.log(err));
  }, []);

  const companies = Array.from(
    new Map(
      [
        ...availableCompanies.map((company) => {
          const resolvedId = String(
            company.companyId || company.id || company._id || ""
          );

          return [
            resolvedId,
            {
              ...company,
              _id: resolvedId,
              id: resolvedId,
              name: company.name || company.companyName || "Company",
            },
          ];
        }),
        ...(db.companies || []).map((company) => {
          const resolvedId = String(
            company.companyId || company.id || company._id || ""
          );
          return [
            resolvedId,
            {
              ...company,
              _id: resolvedId,
              id: resolvedId,
              name: company.name || company.companyName || "Company",
            },
          ];
        }),
        ...messages
          .filter(
            (message) =>
              String(message.fromId) === String(userId) ||
              String(message.toId) === String(userId)
          )
          .map((message) => {
            const otherCompanyId =
              String(message.fromId) === String(userId)
                ? String(message.toId)
                : String(message.fromId);

            return [
              otherCompanyId,
              {
                _id: otherCompanyId,
                id: otherCompanyId,
                name: companyProfiles[otherCompanyId]?.name || `Company ${otherCompanyId}`,
              },
            ];
          }),
      ].filter(([resolvedId]) => resolvedId)
    ).values()
  );

  // 🔥 FIXED ACTIVE THREAD (IMPORTANT)
  useEffect(() => {
    if (!companies.length) {
      setActiveThread(null);
      return;
    }

    const activeExists = companies.some(
      (company) =>
        String(company?._id || company?.id || "") === String(activeThread?.companyId || "")
    );

    if (!activeThread || !activeExists) {
      const firstId = String(companies[0]?._id || companies[0]?.id || "");
      if (!firstId) return;
      setActiveThread({ companyId: firstId });
    }
  }, [companies, activeThread]);

  useEffect(() => {
    if (!companies.length) return;

    companies.forEach((company) => {
      const resolvedId = String(company?._id || company?.id || "");
      if (!resolvedId || companyProfiles[resolvedId]?.name) return;

      fetch(`http://localhost:5000/company-profile?companyId=${resolvedId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data?.name) {
            setCompanyProfiles((prev) => ({
              ...prev,
              [resolvedId]: data,
            }));
          }
        })
        .catch(() => {});
    });
  }, [companies, companyProfiles]);

  // 🔥 FETCH MESSAGES
  useEffect(() => {
    if (!activeThread || !userId) return;

    fetch(`http://localhost:5000/messages/${userId}/${activeThread.companyId}`)
      .then(res => res.json())
      .then(data => {
        setDb(prev => ({
          ...prev,
          messages: [
            ...(prev.messages || []).filter(
              m => m.threadId !== makeThreadId(userId, activeThread.companyId)
            ),
            ...(data || [])
          ]
        }));
      })
      .catch(err => console.log(err));

  }, [activeThread, userId, setDb]);

  // 🔥 FIXED THREAD FILTER
  const getThread = (companyId, studentId) => {
    const tid = makeThreadId(String(companyId), String(studentId));
    return messages.filter((m) => m.threadId === tid);
  };

  // 🔥 SEND TEXT (FIXED)
  const sendMessage = async () => {
    if (!newMessage.trim() || !activeThread) return;

    const msg = {
      threadId: makeThreadId(String(activeThread.companyId), String(userId)),
      fromId: String(userId),
      toId: String(activeThread.companyId),
      content: newMessage,
      date: new Date().toISOString(),
      read: false,
    };

    try {
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
        messages: [...(prev.messages || []), savedMsg],
      }));

      setNewMessage("");
    } catch (err) {
      console.log("Send error:", err);
    }
  };

  // 🔥 FILE SEND (FIXED)
  const sendFile = async (file) => {
    if (!file || !activeThread) return;

    const msg = {
      threadId: makeThreadId(String(activeThread.companyId), String(userId)),
      fromId: String(userId),
      toId: String(activeThread.companyId),
      content: "📎 " + file.name,
      file: file.name,
      date: new Date().toISOString(),
      read: false,
    };

    try {
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
        messages: [...(prev.messages || []), savedMsg],
      }));
    } catch (err) {
      console.log("File send error:", err);
    }
  };

  // 🔽 AUTO SCROLL
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, activeThread]);

  return (
    <div className="flex min-h-screen bg-white text-gray-800">

      <Sidebar session={{ name: studentSession?.name || "Student" }} role="student" />

      <div className="flex flex-1">

        {/* LEFT */}
        <div className="w-full max-w-sm border-r bg-white p-4 overflow-y-auto">

          <h2 className="text-lg font-semibold mb-4 text-gray-700">
            💬 Messages
          </h2>

          {companies.map((company) => {
            if (!company) return null;

            const companyId = String(company._id || company.id || "");
            if (!companyId) return null;

            const companyName =
              companyProfiles[companyId]?.name ||
              company.name ||
              company.companyName ||
              `Company ${companyId}`;
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
                onClick={() => setActiveThread({ companyId })}
                currentUserId={userId}
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
                  <div className="absolute bottom-14 left-0 z-50 rounded-xl border bg-white shadow-lg">
                    <EmojiPicker
                      onEmojiClick={(emojiData) => {
                        setNewMessage((prev) => prev + emojiData.emoji);
                        setShowEmoji(false);
                      }}
                      width={320}
                      height={360}
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
