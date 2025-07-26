import React from "react";
import {
  Modal,
  Backdrop,
  Box,
  Typography,
  IconButton,
  Divider,
  Stack,
  Chip,
  Card,
  Button,
  useTheme,
} from "@mui/material";
import { motion } from "framer-motion";
import {
  XCircle,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Users,
  FileText,
  Building,
  Edit,
} from "lucide-react";
import { formatPrice } from "../../../redux/validation";

// Framer-Motion wrappers
const MotionBox = motion(Box);
const MotionCard = motion(Card);
const MotionButton = motion(Button);

const modalVariants = {
  hidden: { opacity: 0, scale: 0.8, y: -20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 25 },
  },
  exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } },
};

const itemVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.1, type: "spring", stiffness: 120 },
  }),
};

// Thêm props rooms, services
const ConsultationDetailsModal = ({
  open,
  onClose,
  consultation,
  onEdit,
  onCancel,
  rooms = [],
  services = [],
}) => {
  const theme = useTheme();
  if (!consultation) return null;

  // Helper lấy chi tiết phòng/dịch vụ
  const getRoomDetail = (roomId) => {
    if (!roomId) return null;
    const idStr = roomId?.toString?.() || `${roomId}`;
    return rooms.find((r) => {
      const rid =
        r._id?.toString?.() || r.id?.toString?.() || `${r._id || r.id}`;
      return rid === idStr;
    });
  };
  console.log(consultation);

  const getServiceDetail = (serviceId) =>
    services.find((s) => s._id === (serviceId?.toString?.() || serviceId));

  // Map phòng đã chọn với thông tin chi tiết
  const selectedRooms = (
    consultation.selectedRooms ||
    consultation.consultationData?.requestedRooms ||
    []
  ).map((room) => {
    // Nếu roomId là object (đã chứa đủ thông tin phòng)
    const detail =
      typeof room.roomId === "object" && room.roomId !== null
        ? room.roomId
        : getRoomDetail(room.roomId || room.id);

    if (!detail) {
      console.warn(
        "Không tìm thấy room detail cho",
        room.roomId || room.id,
        rooms
      );
    }
    return {
      ...room,
      roomName: detail?.name || room.roomName || room.name,
      roomPrice:
        detail?.price ??
        detail?.roomTypeId?.price ??
        room.roomPrice ??
        room.price,
      roomArea: detail?.area || room.roomArea,
      roomDescription: detail?.description || room.roomDescription,
      roomAvatar: detail?.avatar || room.roomAvatar,
      roomMaxPeople: detail?.max_people || room.roomMaxPeople,
    };
  });
  // Map dịch vụ đã chọn với thông tin chi tiết
  const selectedServices = (
    consultation.selectedServices ||
    consultation.services ||
    consultation.consultationData?.requestServices ||
    []
  ).map((sv) => {
    const detail = getServiceDetail(sv.serviceId || sv._id || sv.id);
    return {
      ...sv,
      serviceName: detail?.serviceName || sv.serviceName || sv.serviceName,
      servicePrice: detail?.price ?? sv.servicePrice ?? sv.price,
    };
  });

  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          sx: {
            backgroundColor: "rgba(0,0,0,0.4)",
            backdropFilter: "blur(4px)",
          },
        },
      }}
    >
      <MotionBox
        component="div"
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        sx={{
          position: "absolute",
          top: "3%",
          left: "33%",
          transform: "translate(-50%,-50%)",
          width: { xs: "90%", sm: 550 },
          maxHeight: "95vh",
          overflowY: "auto",
          bgcolor: "rgba(255,255,255,0.85)",
          backdropFilter: "blur(8px)",
          borderRadius: 2,
          boxShadow: theme.shadows[24],
          p: 3,
        }}
      >
        {/* Header */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <Typography
            fontFamily="Archivo, sans-serif"
            variant="h5"
            sx={{ flexGrow: 1, textAlign: "center" }}
            fontWeight={700}
            color="primary"
          >
            Chi tiết yêu cầu tư vấn
          </Typography>
          <IconButton onClick={onClose} size="small">
            <XCircle size={20} />
          </IconButton>
        </Box>
        <Divider />

        {/* Thông tin user */}
        <Stack spacing={1.5} mt={2}>
          {[
            {
              icon: <User size={18} />,
              label: "Họ và tên",
              value: consultation.fullName,
            },
            {
              icon: <Mail size={18} />,
              label: "Email",
              value: consultation.email,
            },
            {
              icon: <Phone size={18} />,
              label: "Điện thoại",
              value: consultation.phoneNumber,
            },
            {
              icon: <MapPin size={18} />,
              label: "Địa chỉ",
              value: consultation.address || "N/A",
            },
            {
              icon: <Calendar size={18} />,
              label: "Ngày nhận phòng",
              value: consultation.scheduleId?.scheduleId?.startDate
                ? new Date(
                    consultation.scheduleId.scheduleId.startDate
                  ).toLocaleDateString("vi-VN")
                : "-",
            },
            {
              icon: <Users size={18} />,
              label: "Số khách",
              value: consultation.guestCount,
            },
            {
              icon: <FileText size={18} />,
              label: "Yêu cầu",
              value:
                consultation.consultationData?.requirements ||
                consultation.requirements ||
                "N/A",
            },
          ].map((row, i) => (
            <Stack
              key={i}
              component={motion.div}
              custom={i}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              direction="row"
              spacing={1}
              alignItems="center"
            >
              {row.icon}
              <Typography
                fontFamily="Archivo, sans-serif"
                color="#0e4f4f"
                fontWeight={600}
                flex={1}
              >
                {row.label}:
              </Typography>
              <Typography
                fontFamily="Archivo, sans-serif"
                flex={2}
                bgcolor={"white"}
                borderRadius={1}
                p={0.5}
              >
                {row.value}
              </Typography>
            </Stack>
          ))}
        </Stack>

        {/* Selected rooms */}
        <Typography
          fontFamily="Archivo, sans-serif"
          variant="subtitle1"
          color="#0e4f4f"
          fontWeight={600}
          mt={3}
          mb={1}
        >
          Phòng đã chọn
        </Typography>
        <Stack spacing={1}>
          {selectedRooms.length > 0 ? (
            selectedRooms.map((room, i) => (
              <MotionCard
                key={i}
                component="div"
                variants={itemVariants}
                custom={i + 7}
                initial="hidden"
                animate="visible"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  p: 2,
                  boxShadow: theme.shadows[4],
                }}
              >
                <Stack direction="row" spacing={1} alignItems="center">
                  <Building size={18} />
                  <Typography fontFamily="Archivo, sans-serif">
                    {room.roomName || (
                      <span style={{ color: "red" }}>
                        Không tìm thấy thông tin phòng
                      </span>
                    )}
                  </Typography>
                  <Chip
                    label={`x${room.roomQuantity || room.quantity}`}
                    size="small"
                    color="info"
                  />
                </Stack>
                <Typography fontFamily="Archivo, sans-serif" fontWeight={500}>
                  {room.roomPrice !== undefined ? (
                    formatPrice(room.roomPrice)
                  ) : (
                    <span style={{ color: "red" }}>N/A</span>
                  )}
                </Typography>
              </MotionCard>
            ))
          ) : (
            <Typography fontFamily="Archivo, sans-serif" color="text.secondary">
              Không có phòng nào được chọn
            </Typography>
          )}
        </Stack>

        {/* Selected services */}
        <Typography
          fontFamily="Archivo, sans-serif"
          variant="subtitle1"
          color="#0e4f4f"
          fontWeight={600}
          mt={3}
          mb={1}
        >
          Dịch vụ đã chọn
        </Typography>
        <Stack spacing={1}>
          {selectedServices.length > 0 ? (
            selectedServices.map((sv, i) => (
              <MotionCard
                key={sv.serviceId || sv._id || sv.id || i}
                component="div"
                variants={itemVariants}
                custom={i + 20}
                initial="hidden"
                animate="visible"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  p: 2,
                  boxShadow: theme.shadows[4],
                }}
              >
                <Stack direction="row" spacing={1} alignItems="center">
                  <FileText size={18} />
                  <Typography fontFamily="Archivo, sans-serif">
                    {sv.serviceName}
                  </Typography>
                  <Chip
                    label={`x${sv.serviceQuantity || sv.quantity}`}
                    size="small"
                    color="info"
                  />
                </Stack>
                <Typography fontFamily="Archivo, sans-serif" fontWeight={500}>
                  {formatPrice(sv.servicePrice || sv.price)}
                </Typography>
              </MotionCard>
            ))
          ) : (
            <Typography fontFamily="Archivo, sans-serif" color="text.secondary">
              Không có dịch vụ nào được chọn
            </Typography>
          )}
        </Stack>

        {/* Tổng tiền */}
        <Stack direction="row" justifyContent="space-between" mt={2} mb={3}>
          <Typography
            fontFamily="Archivo, sans-serif"
            color="#0e4f4f"
            fontWeight={700}
            variant="subtitle1"
          >
            Tổng tiền:
          </Typography>
          <Typography
            fontFamily="Archivo, sans-serif"
            variant="h6"
            color="primary"
            fontWeight={700}
          >
            {formatPrice(
              consultation.totalPrice ||
                consultation.consultationData?.estimatedPrice
            )}
          </Typography>
        </Stack>

        <Divider />

        {/* Actions */}
        <Stack direction="row" justifyContent="flex-end" spacing={1} mt={2}>
          <MotionButton
            variant="contained"
            color="primary"
            startIcon={<Edit size={16} />}
            onClick={onEdit}
            whileHover={{ scale: 1.05 }}
            sx={{ textTransform: "none", fontFamily: "Archivo, sans-serif" }}
          >
            Chỉnh sửa
          </MotionButton>
          <MotionButton
            variant="outlined"
            color="error"
            onClick={onCancel}
            whileHover={{ scale: 1.05 }}
            sx={{ textTransform: "none", fontFamily: "Archivo, sans-serif" }}
          >
            Hủy yêu cầu
          </MotionButton>
          <MotionButton
            variant="text"
            onClick={onClose}
            whileHover={{ scale: 1.05 }}
            sx={{ textTransform: "none", fontFamily: "Archivo, sans-serif" }}
          >
            Đóng
          </MotionButton>
        </Stack>
      </MotionBox>
    </Modal>
  );
};

export default ConsultationDetailsModal;
