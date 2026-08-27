export const ROOMS = Array.from({ length: 9 }, (_, i) => `회의실 ${i + 1}`);
export const START_HOUR = 0;
export const END_HOUR = 24;
export const HOURS = Array.from(
  { length: END_HOUR - START_HOUR },
  (_, i) => START_HOUR + i,
);

export const SLOT_WIDTH = 120; // 1시간 = 120px
export const MINUTE_WIDTH = SLOT_WIDTH / 60; // 1분 = 2px

export const timeToMins = (timeStr) => {
  const [h, m] = timeStr.split(":").map(Number);
  return h * 60 + m;
};

export const minsToTime = (mins) => {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
};
