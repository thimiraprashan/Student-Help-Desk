// chatUtils.js

export const makeThreadId = (id1, id2) => {
  return [id1, id2].sort().join("_");
};

export const getThread = (messages, id1, id2) => {
  const tid = makeThreadId(id1, id2);
  return messages.filter((m) => m.threadId === tid);
};