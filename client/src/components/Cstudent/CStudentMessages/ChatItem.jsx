import React from "react";
import { formatDisplayName } from "../../../utils/nameUtils";

const ChatItem = ({
  student,
  lastMessage,
  unread,
  onClick,
  active,
  onlineUsers = [],
  currentUserId // ✅ ADD THIS
}) => {

  const studentId = String(student?._id || student?.id);
  const displayName = formatDisplayName(student?.name || "");

  const isOnline = onlineUsers.map(String).includes(studentId);

  // ✅ FIXED
  const isLastFromMe =
    String(lastMessage?.fromId) === String(currentUserId);

  return (
    <div
      onClick={onClick}
      className={`cursor-pointer rounded-xl p-4 flex items-center gap-4 transition mb-[0.2cm] last:mb-0 ${
        active
          ? "bg-blue-50 text-slate-900 border border-blue-200 ring-2 ring-blue-300 shadow-sm"
          : "bg-white text-slate-900 border border-slate-200 hover:bg-slate-50"
      }`}
    >
      {/* Avatar */}
      <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center font-bold text-lg text-white">
        {displayName?.[0] || "?"}

        {/* 🟢 Online */}
        <span
          className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#1e293b] ${
            isOnline ? "bg-green-500" : "bg-gray-500"
          }`}
        />

        {/* 🔴 Unread */}
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold">
            {unread}
          </span>
        )}
      </div>

      {/* Text */}
      <div className="flex-1 overflow-hidden">
        <div className="flex justify-between items-center">

          {/* Name */}
          <span className="text-sm font-semibold truncate">
            {displayName}
          </span>

          {/* Time */}
          <span className="text-gray-300 text-[11px] whitespace-nowrap ml-2">
            {lastMessage?.date
              ? new Date(lastMessage.date).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : ""}
          </span>

        </div>

        {/* Last Message */}
        <div
          className={`text-xs truncate mt-1 flex items-center gap-1 ${
            unread > 0 ? "font-semibold" : "text-gray-300"
          }`}
        >
          {/* ✅ Tick */}
          {isLastFromMe && (
            <span className="text-blue-400 text-[10px]">✓✓</span>
          )}

          {lastMessage?.file
            ? "📎 File"
            : lastMessage?.content || "Start conversation..."}
        </div>
      </div>
    </div>
  );
};

export default ChatItem;