export function getScheduleById(schedules, scheduleId) {
  if (!schedules || !scheduleId) return null;

  const id = typeof scheduleId === "object" ? scheduleId._id : scheduleId;

  // Nếu schedules là object (theo yachtId), chuyển thành array
  let schedulesArray = schedules;
  if (typeof schedules === "object" && !Array.isArray(schedules)) {
    // Lấy tất cả schedules từ tất cả yachtIds
    schedulesArray = Object.values(schedules).flat();
  }

  // Đảm bảo schedulesArray là array
  if (!Array.isArray(schedulesArray)) {
    console.warn("getScheduleById: schedules is not an array:", schedules);
    return null;
  }

  return schedulesArray.find(
    (sch) =>
      sch._id === id || // so sánh với _id của YachtSchedule
      sch.scheduleId?._id === id // so sánh với _id của Schedule
  );
}
