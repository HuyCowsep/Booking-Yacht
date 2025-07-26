import {
  Box,
  Typography,
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
} from "@mui/material";
import { X } from "lucide-react";
import React, { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import { fetchServices } from "../../redux/asyncActions/servicesAsyncActions";

const RoomServicesModal = ({
  show,
  yachtId,
  onClose,
  onSelectServices,
  selectedServices = [],
  guestCount,
}) => {
  const dispatch = useDispatch();
  const services = useSelector((state) => state.services.data) || [];
  const servicesLoading = useSelector((state) => state.services.loading);
  const [selected, setSelected] = useState([]);
  const [quantities, setQuantities] = useState({});

  const getServiceId = (service, idx) =>
    (service._id || service.id || idx) + "";

  useEffect(() => {
    if (show && yachtId && services.length === 0 && !servicesLoading) {
      dispatch(fetchServices(yachtId));
    }
    if (show) {
      if (selectedServices && selectedServices.length > 0) {
        const selectedIds = selectedServices.map(
          (sv) => (sv._id || sv.id) + ""
        );
        setSelected(selectedIds);
        // Set initial quantities from selectedServices, ép về guestCount nếu vượt quá
        const initialQuantities = {};
        selectedServices.forEach((sv) => {
          const id = (sv._id || sv.id) + "";
          let qty = sv.quantity || guestCount || 1;
          if (qty > guestCount) qty = guestCount;
          initialQuantities[id] = qty;
        });
        setQuantities(initialQuantities);
      } else {
        setSelected([]);
        setQuantities({});
      }
    }
  }, [show, selectedServices, yachtId, guestCount]);

  // Khi guestCount thay đổi, cập nhật lại quantity cho các dịch vụ đã chọn nếu cần
  useEffect(() => {
    setQuantities((prev) => {
      const updated = { ...prev };
      let changed = false;
      Object.keys(updated).forEach((id) => {
        if (updated[id] > guestCount) {
          updated[id] = guestCount;
          changed = true;
        }
      });
      // Nếu có thay đổi, trả về object mới để trigger re-render
      return changed ? { ...updated } : updated;
    });
  }, [guestCount]);

  const handleToggleService = (service, idx) => {
    const id = getServiceId(service, idx);
    setSelected((prev) => {
      if (prev.includes(id)) {
        // Bỏ chọn: xóa quantity
        setQuantities((q) => {
          const newQ = { ...q };
          delete newQ[id];
          return newQ;
        });
        return prev.filter((sid) => sid !== id);
      } else {
        // Chọn: set quantity = guestCount nếu chưa có
        setQuantities((q) => ({ ...q, [id]: guestCount || 1 }));
        return [...prev, id];
      }
    });
  };

  const totalServicePrice = services
    .map((serviceObj, idx) => serviceObj.serviceId || serviceObj)
    .filter((service, idx) => selected.includes(getServiceId(service, idx)))
    .reduce((sum, sv) => sum + (sv.price || 0), 0);

  if (!show) return null;

  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        bgcolor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 50,
      }}
    >
      <Box
        sx={{
          bgcolor: "background.paper",
          borderRadius: (theme) => theme.shape.borderRadius / 4,
          maxWidth: "55rem",
          width: "100%",
          mx: 2,
          maxHeight: "70vh",
          p: 3,
          display: "flex",
          flexDirection: "column",
          boxShadow: (theme) => theme.shadows[1],
          border: (theme) => `1px solid ${theme.palette.divider}`,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography
            variant="h2"
            sx={{
              fontSize: "1.5rem",
              fontWeight: "bold",
              color: "text.primary",
              fontFamily: "Archivo, sans-serif",
            }}
          >
            Chọn dịch vụ cho du thuyền
          </Typography>
          <Button
            onClick={onClose}
            sx={{
              color: "text.secondary",
              "&:hover": { color: "text.primary" },
              minWidth: 0,
            }}
          >
            <X size={24} />
          </Button>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography
            fontFamily={"Archivo, sans-serif"}
            sx={{
              fontSize: "1.125rem",
              fontWeight: "bold",
              color: "text.secondary",
              fontFamily: "Archivo, sans-serif",
            }}
          >
            Dịch vụ thêm:
          </Typography>
        </Box>
        <Box sx={{ p: 2, flex: 1, overflowY: "auto" }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 2,
            }}
          >
            {[0, 1].map((colIdx) => (
              <Box
                key={colIdx}
                sx={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                }}
              >
                {services
                  .slice(colIdx * 4, colIdx * 4 + 4)
                  .map((serviceObj, idx) => {
                    const service = serviceObj.serviceId || serviceObj;
                    const id = getServiceId(service, colIdx * 4 + idx);
                    return (
                      <FormControlLabel
                        key={id}
                        control={
                          <Checkbox
                            checked={selected.includes(id)}
                            onChange={() =>
                              handleToggleService(service, colIdx * 4 + idx)
                            }
                          />
                        }
                        label={
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              width: "100%",
                              fontFamily: "Archivo, sans-serif",
                              borderBottom: "1px solid #eee",
                              p: 1,
                              borderRadius: 1,
                              bgcolor: (theme) =>
                                theme.palette.background.paper,
                              minHeight: 64,
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                                minWidth: 0,
                                flex: 1,
                                pr: 2,
                              }}
                            >
                              <span style={{ wordBreak: "break-word" }}>
                                {serviceObj.serviceName ||
                                  serviceObj.name ||
                                  "Dịch vụ"}
                              </span>
                              <span
                                style={{ color: "#14b8a6", fontWeight: 500 }}
                              >
                                {(
                                  (serviceObj.serviceId &&
                                    serviceObj.serviceId.price) ||
                                  serviceObj.price ||
                                  0
                                ).toLocaleString()}{" "}
                                đ/khách
                              </span>
                            </Box>
                            {selected.includes(id) && (
                              <TextField
                                type="number"
                                value={quantities[id] || 1}
                                onChange={(e) =>
                                  setQuantities((q) => ({
                                    ...q,
                                    [id]: Math.max(
                                      1,
                                      Math.min(
                                        Number(e.target.value),
                                        guestCount
                                      )
                                    ),
                                  }))
                                }
                                inputProps={{ min: 1, max: guestCount }}
                                size="small"
                                sx={{
                                  width: 60,
                                  flexShrink: 0,
                                  ml: "auto",
                                  textAlign: "right",
                                }}
                              />
                            )}
                          </Box>
                        }
                      />
                    );
                  })}
              </Box>
            ))}
          </Box>
        </Box>
        <Box
          sx={{
            borderTop: (theme) => `1px solid ${theme.palette.divider}`,
            pt: 2,
            mt: 2,
            position: "sticky",
            bottom: 0,
            bgcolor: "background.paper",
            zIndex: 1,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography
              fontFamily={"Archivo, sans-serif"}
              sx={{ fontWeight: "bold", color: "primary.main", mb: 1 }}
            >
              Tiền dịch vụ: {totalServicePrice.toLocaleString()} đ
            </Typography>
            <Button
              onClick={() => {
                const selectedObjs = services
                  .map((serviceObj, idx) => serviceObj.serviceId || serviceObj)
                  .filter((service, idx) =>
                    selected.includes(getServiceId(service, idx))
                  )
                  .map((service, idx) => {
                    const id = getServiceId(service, idx);
                    let quantity = quantities[id] || 1;
                    if (quantity > guestCount) quantity = guestCount;
                    return {
                      ...service,
                      serviceId:
                        service._id ||
                        service.serviceId ||
                        service.id ||
                        getServiceId(service, idx),
                      _id:
                        service._id ||
                        service.serviceId ||
                        service.id ||
                        getServiceId(service, idx),
                      quantity,
                    };
                  });
                onSelectServices(selectedObjs);
                onClose();
              }}
              variant="contained"
              sx={{
                bgcolor: "primary.main",
                color: "primary.contrastText",
                px: 3,
                py: 1,
                borderRadius: 3,
                fontFamily: "Archivo, sans-serif",
                fontWeight: 500,
                "&:hover": { bgcolor: "primary.dark" },
              }}
            >
              Chọn dịch vụ
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default RoomServicesModal;
