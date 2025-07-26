const CompanyYachtSchedule = require('../model/companyYachtSchedule');
const mongoose = require('mongoose');
const Schedule = require('../model/schedule');
const YachtSchedule = require('../model/yachtSchedule');
const Yacht = require('../model/yachtSchema');

// Lấy tất cả lịch của company, có thể filter theo yachtId
exports.getAll = async (req, res) => {
  try {
    const { yachtId } = req.query;
    const filter = { companyId: req.companyId };
    if (yachtId) filter.yachtId = yachtId;
    const schedules = await CompanyYachtSchedule.find(filter).lean();
    // Lấy tất cả legacyScheduleId
    const legacyIds = schedules.map(sch => sch.legacyScheduleId).filter(Boolean);
    const legacySchedules = await Schedule.find({ _id: { $in: legacyIds } }).lean();
    const legacyMap = {};
    for (const legacy of legacySchedules) {
      legacyMap[legacy._id.toString()] = legacy;
    }
    // Lấy tất cả yachtId
    const yachtIds = schedules.map(sch => sch.yachtId).filter(Boolean);
    const yachts = await Yacht.find({ _id: { $in: yachtIds } }).lean();
    const yachtMap = {};
    for (const yacht of yachts) {
      yachtMap[yacht._id.toString()] = yacht.name;
    }
    // Gán startDate, endDate từ schedule cũ và tên thuyền
    for (const sch of schedules) {
      if (sch.legacyScheduleId && legacyMap[sch.legacyScheduleId.toString()]) {
        sch.startDate = legacyMap[sch.legacyScheduleId.toString()].startDate;
        sch.endDate = legacyMap[sch.legacyScheduleId.toString()].endDate;
      }
      if (sch.yachtId && yachtMap[sch.yachtId.toString()]) {
        sch.yachtName = yachtMap[sch.yachtId.toString()];
      }
    }
    res.json({ data: schedules });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi lấy lịch', error: err.message });
  }
};

// Tạo lịch mới (đồng bộ schedule & yachtSchedule)
exports.create = async (req, res) => {
  try {
    const data = req.body;
    data.companyId = req.companyId;
    data.createdBy = req.accountId;
    // Tạo schedule cũ
    const legacySchedule = await Schedule.create({
      startDate: data.startDate,
      endDate: data.endDate
    });
    // Tạo yachtSchedule cũ
    await YachtSchedule.create({
      yachtId: data.yachtId,
      scheduleId: legacySchedule._id
    });
    // Lưu legacyScheduleId vào bảng mới
    data.legacyScheduleId = legacySchedule._id;
    const schedule = await CompanyYachtSchedule.create(data);
    // Trả về startDate, endDate từ schedule cũ
    const result = schedule.toObject();
    result.startDate = legacySchedule.startDate;
    result.endDate = legacySchedule.endDate;
    res.status(201).json({ data: result });
  } catch (err) {
    res.status(400).json({ message: 'Lỗi tạo lịch', error: err.message });
  }
};

// Sửa lịch (đồng bộ schedule & yachtSchedule)
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const schedule = await CompanyYachtSchedule.findOneAndUpdate(
      { _id: id, companyId: req.companyId },
      updateData,
      { new: true }
    ).lean();
    if (!schedule) return res.status(404).json({ message: 'Không tìm thấy lịch' });
    // Đồng bộ schedule cũ nếu có legacyScheduleId
    let legacySchedule = null;
    if (schedule.legacyScheduleId) {
      legacySchedule = await Schedule.findByIdAndUpdate(schedule.legacyScheduleId, {
        startDate: updateData.startDate,
        endDate: updateData.endDate
      }, { new: true }).lean();
      // Nếu đổi thuyền, update yachtSchedule
      if (updateData.yachtId) {
        await YachtSchedule.findOneAndUpdate(
          { scheduleId: schedule.legacyScheduleId },
          { yachtId: updateData.yachtId }
        );
      }
    }
    // Trả về startDate, endDate từ schedule cũ
    schedule.startDate = legacySchedule ? legacySchedule.startDate : undefined;
    schedule.endDate = legacySchedule ? legacySchedule.endDate : undefined;
    res.json({ data: schedule });
  } catch (err) {
    res.status(400).json({ message: 'Lỗi cập nhật lịch', error: err.message });
  }
};

// Xóa lịch (đồng bộ schedule & yachtSchedule)
exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    const schedule = await CompanyYachtSchedule.findOneAndDelete({ _id: id, companyId: req.companyId });
    if (!schedule) return res.status(404).json({ message: 'Không tìm thấy lịch' });
    // Xóa schedule cũ nếu có legacyScheduleId
    if (schedule.legacyScheduleId) {
      await Schedule.findByIdAndDelete(schedule.legacyScheduleId);
      await YachtSchedule.deleteMany({ scheduleId: schedule.legacyScheduleId });
    }
    res.json({ data: { message: 'Đã xóa lịch' } });
  } catch (err) {
    res.status(400).json({ message: 'Lỗi xóa lịch', error: err.message });
  }
}; 