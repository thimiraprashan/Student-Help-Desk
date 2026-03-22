import React from "react";
import Sidebar from "../../Common/Sidebar";
const ChatItem = ({ student, lastMessage, unread, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer bg-[#1e293b] hover:bg-[#334155] transition rounded-xl p-4 flex items-center gap-4"
    >
      {/* Avatar */}
      <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center font-bold text-lg">
        {student?.name?.[0] || "?"}

        {unread > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
            {unread}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 overflow-hidden">
        <div className="flex justify-between items-center">
          <span className="text-gray-200 font-semibold text-sm">
            {student?.name}
          </span>
          <span className="text-gray-500 text-[11px]">
            {lastMessage?.date}
          </span>
        </div>

        <div className="text-gray-400 text-xs truncate mt-1">
          {lastMessage?.content}
        </div>
      </div>
    </div>
  );
};

export default ChatItem;