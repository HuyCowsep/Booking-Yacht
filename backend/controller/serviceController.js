const YachtService = require("../model/yachtService");
const Service = require("../model/service");

// Lấy danh sách dịch vụ theo yachtId
exports.getServicesByYacht = async (req, res) => {
  try {
    const { yachtId } = req.params;
    // Lấy các dịch vụ của du thuyền này
    const yachtServices = await YachtService.find({ yachtId }).populate(
      "serviceId"
    );
    const services = yachtServices.map((ys) => {
      const service = ys.serviceId;
      return {
        _id: ys._id, // ID của yacht service
        service: service.serviceName, 
        price: service.price,
        idService: ys._id, // ID để xóa service
        yachtId: ys.yachtId,
        // Thêm các trường khác nếu cần
        serviceId: service._id, // ID của service gốc
        serviceName: service.serviceName, // Giữ lại tên gốc nếu cần
      };
    });
    
    res.json({
      success: true,
      data: services
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}; 
