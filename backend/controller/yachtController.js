const { YachtSchema, YachtService, YachtSchedule, RoomType, Feedback, Schedule } = require("../model");
const cloudinary = require("../utils/configClound");

// Hàm lấy tất cả du thuyền
const getAllYacht = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 0;

    const yachtsQuery = YachtSchema.find()
      .populate("locationId", "-_id name")
      .populate("yachtTypeId", "-_id name ranking")
      .populate("IdCompanys", "-_id name address logo");

    if (limit > 0) {
      yachtsQuery.limit(limit); // Áp dụng giới hạn nếu có
    }

    const yachts = await yachtsQuery;

    res.status(200).json({
      success: true,
      message: "Lấy danh sách du thuyền thành công",
      data: yachts,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy du thuyền",
      error: err.message,
    });
  }
};

// Hàm lấy tất cả dịch vụ của du thuyền
const getAllServices = async (req, res) => {
  try {
    const data = await YachtService.find()
      .populate({
        path: "yachtId",
        select: "-_id name",
      })
      .populate({
        path: "serviceId",
        select: "-_id serviceName price",
      });

    res.status(200).json({
      message: "Lấy danh sách dịch vụ thành công",
      data,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi lấy danh sách dịch vụ",
      error: error.message,
    });
  }
};

// Hàm tìm kiếm du thuyền
const searchYachts = async (req, res) => {
  try {
    const { name, location, greater_defaultPrice, lower_defaultPrice, stars, durations, features } = req.query;
    let query = {};

    if (name) query.name = { $regex: name, $options: "i" };
    if (location) query.locationId = location;

    let yachts = await YachtSchema.find(query)
      .populate("locationId", "-_id name")
      .populate("yachtTypeId", "-_id name ranking")
      .populate("IdCompanys", "-_id name address logo");

    // Lọc theo số sao
    if (stars) {
      const starArray = stars.split(',').map(Number);
      yachts = await Promise.all(
        yachts.map(async (yacht) => {
          const feedbacks = await Feedback.find({ yachtId: yacht._id });
          const avgRating = feedbacks.length > 0
            ? Math.round(feedbacks.reduce((sum, fb) => sum + fb.starRating, 0) / feedbacks.length)
            : 0;
          return starArray.includes(avgRating) ? yacht : null;
        })
      );
      yachts = yachts.filter(Boolean);
    }

    // Lọc theo thời gian
    if (durations) {
      const durationArray = durations.split(',');
      yachts = await Promise.all(
        yachts.map(async (yacht) => {
          const schedules = await YachtSchedule.find({ yachtId: yacht._id }).populate('scheduleId');
          const yachtDurations = schedules.map((schedule) => {
            const startDate = new Date(schedule.scheduleId.startDate);
            const endDate = new Date(schedule.scheduleId.endDate);
            const durationDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
            return `${durationDays} ngày ${durationDays - 1} đêm`;
          });
          return durationArray.some((d) => yachtDurations.includes(d)) ? yacht : null;
        })
      );
      yachts = yachts.filter(Boolean);
    }

    // Lọc theo tiện ích
    if (features) {
      const featureArray = features.split(',');
      yachts = await Promise.all(
        yachts.map(async (yacht) => {
          const services = await YachtService.find({ yachtId: yacht._id }).populate('serviceId');
          const yachtFeatures = services.map((service) => service.serviceId?.serviceName).filter(Boolean);
          return featureArray.every((f) => yachtFeatures.includes(f)) ? yacht : null;
        })
      );
      yachts = yachts.filter(Boolean);
    }

    // Tính cheapestPrice
    yachts = await Promise.all(
      yachts.map(async (yacht) => {
        const roomTypes = await RoomType.find({ yachtId: yacht._id }).select("price");
        const cheapestPrice = roomTypes.length > 0 ? Math.min(...roomTypes.map((rt) => rt.price)) : null;
        return { ...yacht.toObject(), cheapestPrice };
      })
    );

    // Lọc theo giá
    if (greater_defaultPrice || lower_defaultPrice) {
      yachts = yachts.filter((yacht) => {
        const price = yacht.cheapestPrice;
        if (greater_defaultPrice && price < Number(greater_defaultPrice)) return false;
        if (lower_defaultPrice && price > Number(lower_defaultPrice)) return false;
        return true;
      });
    }

    res.status(200).json({
      success: true,
      message: "Tìm kiếm du thuyền thành công",
      data: yachts,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Lỗi server khi tìm kiếm du thuyền",
      error: err.message,
    });
  }
};

// Hàm lấy tất cả feedback của du thuyền
const getFeedbacksByYacht = async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ yachtId: req.params.id })
      .populate("customerId", "-_id fullName")
      .populate("yachtId", "-_id name");
    res.status(200).json({ success: true, data: feedbacks });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Hàm lấy tất cả lịch trình của du thuyền
const getSchedulesByYacht = async (req, res) => {
  try {
    const yachtSchedules = await YachtSchedule.find({ yachtId: req.params.id })
      .populate("scheduleId")
      .populate("yachtId", "name");
    res.status(200).json({ success: true, data: yachtSchedules });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = { getAllYacht, getAllServices, searchYachts, getFeedbacksByYacht, getSchedulesByYacht };
