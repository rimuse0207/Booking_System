import moment from "moment";

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

// 💡 조회 중인 날짜(currentDate)를 기준으로 시작 시간(분) 계산
export const timeToMinsStartData = (startTimeStr, currentDate) => {
  const viewStartOfDay = moment(currentDate).startOf("day");
  const resStart = moment(startTimeStr);

  // 예약 시작이 화면(00:00)보다 과거면 무조건 0으로 깎아냄
  if (resStart.isBefore(viewStartOfDay)) {
    return 0;
  }

  // 당일 일정이면 정상적으로 시/분 계산
  return resStart.hours() * 60 + resStart.minutes();
};

// 💡 조회 중인 날짜(currentDate)를 기준으로 종료 시간(분) 계산
export const timeToMinsEndData = (endTimeStr, currentDate) => {
  const viewStartOfDay = moment(currentDate).startOf("day");
  const viewEndOfDay = moment(currentDate).endOf("day");
  const resEnd = moment(endTimeStr);

  // 1. "24:00" 예외 문자열 처리
  if (typeof endTimeStr === "string" && endTimeStr.includes("24:00")) {
    return 24 * 60;
  }

  // 2. 예약 종료가 화면(23:59:59)을 넘어가는 미래면 24:00(1440분)으로 깎아냄
  if (resEnd.isAfter(viewEndOfDay)) {
    return 24 * 60;
  }

  // 3. 자정(다음날 00:00)에 딱 끝나는 경우의 예외 처리
  if (
    resEnd.hours() === 0 &&
    resEnd.minutes() === 0 &&
    resEnd.isAfter(viewStartOfDay)
  ) {
    return 24 * 60;
  }

  // 당일 내에 끝나면 정상적으로 시/분 계산
  return resEnd.hours() * 60 + resEnd.minutes();
};

export const minsToTime = (mins) => {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
};
