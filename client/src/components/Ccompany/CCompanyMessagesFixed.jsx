
import React, { useEffect, useMemo, useRef, useState } from "react";
import EmojiPicker from "emoji-picker-react";
import ChatItem from "../Cstudent/CStudentMessages/ChatItem";
import Sidebar from "../Common/SSidebar";
import { getCompanySession } from "../../utils/sessionStore";
import { formatDisplayName } from "../../utils/nameUtils";

const makeThreadId = (id1, id2) =>
  [String(id1).trim(), String(id2).trim()].sort().join("_");

const CCompanyMessagesFixed = ({ db, setDb, userId }) => {
  const [activeThread, setActiveThread] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [availableStudents, setAvailableStudents] = useState([]);
  const [studentProfiles, setStudentProfiles] = useState({});
  const [isLoadingStudents, setIsLoadingStudents] = useState(true);
  const [sendError, setSendError] = useState("");
  const chatEndRef = useRef(null);

  const messages = db.messages || [];
  const companyName = getCompanySession()?.name || "Company";

  useEffect(() => {
    let isActive = true;

    const loadStudents = async () => {
      setIsLoadingStudents(true);

      try {
        const [authResult, applicationsResult] = await Promise.allSettled([
          fetch("http://localhost:5000/students/auth/accounts"),
          fetch("http://localhost:5000/applications"),
        ]);

        const nextStudents = new Map();

        if (authResult.status === "fulfilled" && authResult.value.ok) {
          const authData = await authResult.value.json();

          (Array.isArray(authData) ? authData : []).forEach((student) => {
            const studentId = String(
              student.studentId || student.userId || student.id || ""
            );

            if (!studentId) return;

            nextStudents.set(studentId, {
              studentId,
              userId: studentId,
              name: student.name || "Student",
              email: student.email || "",
            });
          });
        }

        if (applicationsResult.status === "fulfilled" && applicationsResult.value.ok) {
          const applicationsData = await applicationsResult.value.json();

          (Array.isArray(applicationsData) ? applicationsData : [])
            .filter((application) => String(application.companyId) === String(userId))
            .forEach((application) => {
              const studentId = String(application.studentId || "");

              if (!studentId) return;

              const existingStudent = nextStudents.get(studentId) || {};

              nextStudents.set(studentId, {
                studentId,
                userId: studentId,
                name:
                  existingStudent.name ||
                  application.studentName ||
                  "Student",
                email:
                  existingStudent.email ||
                  application.studentEmail ||
                  "",
                field: existingStudent.field || application.field || "",
                year: existingStudent.year || application.year || "",
                gpa: existingStudent.gpa || application.gpa || "",
              });
            });
        }

        if (!isActive) return;

        const students = Array.from(nextStudents.values());
        setAvailableStudents(students);

        setStudentProfiles((prev) => {
          const next = { ...prev };

          students.forEach((student) => {
            const studentId = String(student.studentId || student.userId || student.id || "");
            if (!studentId) return;

            next[studentId] = {
              ...next[studentId],
              name: next[studentId]?.name || student.name || "Student",
              email: next[studentId]?.email || student.email || "",
              field: next[studentId]?.field || student.field || "",
              year: next[studentId]?.year || student.year || "",
              gpa: next[studentId]?.gpa || student.gpa || "",
            };
          });

          return next;
        });
      } catch (err) {
        if (isActive) {
          setAvailableStudents([]);
        }
        console.log(err);
      } finally {
        if (isActive) {
          setIsLoadingStudents(false);
        }
      }
    };

    loadStudents();

    return () => {
      isActive = false;
    };
  }, [userId]);

  useEffect(() => {
    if (!availableStudents.length) return;

    availableStudents.forEach((student) => {
      const studentId = String(student.studentId || student.userId || student.id || "");
      if (!studentId) return;

      fetch(`http://localhost:5000/api/cv/${studentId}`)
        .then((res) => res.json())
        .then((data) => {
          if (!data) return;

          setStudentProfiles((prev) => ({
            ...prev,
            [studentId]: {
              name: data.name || prev[studentId]?.name || student.name || "Student",
              email: data.email || prev[studentId]?.email || student.email || "",
              field: data.field || prev[studentId]?.field || "",
              year: data.year || prev[studentId]?.year || "",
              gpa: data.gpa || prev[studentId]?.gpa || "",
            },
          }));
        })
        .catch(() => {});
    });
  }, [availableStudents]);

  const students = useMemo(() => {
    return Array.from(
      new Map(
        [
          ...availableStudents.map((student) => {
            const studentId = String(student.studentId || student.userId || student.id || "");

            return [
              studentId,
              {
                _id: studentId,
                id: studentId,
                name: studentProfiles[studentId]?.name || student.name || "Student",
                email: studentProfiles[studentId]?.email || student.email || "",
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
              const studentId =
                String(message.fromId) === String(userId)
                  ? String(message.toId)
                  : String(message.fromId);

              return [
                studentId,
                {
                  _id: studentId,
                  id: studentId,
                  name: studentProfiles[studentId]?.name || `Student ${studentId}`,
                  email: studentProfiles[studentId]?.email || "",
                },
              ];
            }),
        ]
      ).values()
    ).filter((student) => student._id);
  }, [availableStudents, messages, studentProfiles, userId]);

  useEffect(() => {
    if (!students.length) {
      setActiveThread(null);
      return;
    }

    const activeExists = students.some(
      (student) => String(student._id) === String(activeThread?.studentId || "")
    );

    if (!activeThread || !activeExists) {
      setActiveThread({ studentId: String(students[0]._id) });
    }
  }, [students, activeThread]);

  useEffect(() => {
    if (!activeThread || !userId) return;

    fetch(`http://localhost:5000/messages/${userId}/${activeThread.studentId}`)
      .then((res) => res.json())
      .then((data) => {
        setDb((prev) => ({
          ...prev,
          messages: [
            ...(prev.messages || []).filter(
              (message) =>
                message.threadId !== makeThreadId(userId, activeThread.studentId)
            ),
            ...(data || []),
          ],
        }));
      })
      .catch((err) => console.log(err));
  }, [activeThread, userId, setDb]);

  const getThread = (studentId) => {
    const threadId = makeThreadId(userId, studentId);
    return messages.filter((message) => message.threadId === threadId);
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !activeThread) return;

    setSendError("");

    const payload = {
      threadId: makeThreadId(String(userId), String(activeThread.studentId)),
      fromId: String(userId),
      toId: String(activeThread.studentId),
      content: newMessage,
      date: new Date().toISOString(),
      read: false,
    };

    try {
      const res = await fetch("http://localhost:5000/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to send message");
      }

      const savedMsg = await res.json();

      setDb((prev) => ({
        ...prev,
        messages: [...(prev.messages || []), savedMsg],
      }));

      setNewMessage("");
    } catch (err) {
      setSendError(err.message || "Failed to send message");
      console.log("Send error:", err);
    }
  };

  const sendFile = async (file) => {
    if (!file || !activeThread) return;

    setSendError("");

    const payload = {
      threadId: makeThreadId(String(userId), String(activeThread.studentId)),
      fromId: String(userId),
      toId: String(activeThread.studentId),
      content: `File: ${file.name}`,
      file: file.name,
      date: new Date().toISOString(),
      read: false,
    };

    try {
      const res = await fetch("http://localhost:5000/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to send file");
      }

      const savedMsg = await res.json();

      setDb((prev) => ({
        ...prev,
        messages: [...(prev.messages || []), savedMsg],
      }));
    } catch (err) {
      setSendError(err.message || "Failed to send file");
      console.log("File send error:", err);
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, activeThread]);

  const activeStudent = students.find(
    (student) => String(student._id) === String(activeThread?.studentId || "")
  );
  const totalUnread = messages.filter(
    (message) => String(message.toId) === String(userId) && !message.read
  ).length;

  return (
    <div className="flex min-h-screen bg-white text-gray-800">
      <Sidebar session={{ name: companyName }} unreadCount={totalUnread} role="company" />

      <div className="flex flex-1">
        <div className="w-full max-w-sm border-r bg-white p-4 overflow-y-auto">
          <h2 className="mb-4 text-lg font-semibold text-gray-700">Messages</h2>

          {students.map((student) => {
            const studentId = String(student._id);
            const thread = getThread(studentId);
            const lastMessage = thread[thread.length - 1] || {};
            const unread = thread.filter(
              (message) =>
                String(message.toId) === String(userId) && !message.read
            ).length;

            return (
              <ChatItem
                key={studentId}
                student={student}
                lastMessage={lastMessage}
                unread={unread}
                active={activeThread?.studentId === studentId}
                onClick={() => setActiveThread({ studentId })}
                currentUserId={userId}
              />
            );
          })}

          {isLoadingStudents && (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-10 text-center text-sm text-slate-500">
              Loading students...
            </div>
          )}

          {!isLoadingStudents && students.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-10 text-center text-sm text-slate-500">
              No applicants or conversations available yet.
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col bg-[#f8fafc] p-4">
          {!activeThread ? (
            <div className="flex h-full items-center justify-center text-gray-400">
              Select a student to start messaging
            </div>
          ) : (
            <>
              <div className="mb-4 rounded-2xl border bg-white px-5 py-4 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900">
                  {formatDisplayName(activeStudent?.name || "Student")}
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  {activeStudent?.email || "No email available"}
                </p>
              </div>

              <div className="mb-4 flex-1 overflow-y-auto space-y-2">
                {getThread(activeThread.studentId).map((message) => {
                  const isMe = String(message.fromId) === String(userId);

                  return (
                    <div
                      key={message._id || message.id}
                      className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-2xl px-4 py-2 text-sm shadow ${
                          isMe
                            ? "rounded-br-none bg-green-500 text-white"
                            : "rounded-bl-none border bg-white text-gray-800"
                        }`}
                      >
                        {!isMe && (
                          <div className="mb-1 text-xs text-gray-500">
                            {formatDisplayName(activeStudent?.name || "Student")}
                          </div>
                        )}

                        {message.file ? message.file : message.content}
                      </div>
                    </div>
                  );
                })}

                <div ref={chatEndRef} />
              </div>

              <div className="relative flex items-center gap-2 rounded-xl border bg-white p-2">
                <button type="button" onClick={() => setShowEmoji((prev) => !prev)}>
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
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="Type message..."
                  className="flex-1 px-3 py-2 outline-none"
                />

                <input type="file" onChange={(e) => sendFile(e.target.files?.[0])} />

                <button
                  type="button"
                  onClick={sendMessage}
                  className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                >
                  Send
                </button>
              </div>

              {sendError && (
                <p className="mt-3 text-sm text-red-600">{sendError}</p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CCompanyMessagesFixed;