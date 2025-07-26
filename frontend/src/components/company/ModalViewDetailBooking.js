import _ from "lodash";
import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";

// ✅ Apply theme
import { useTheme } from "@mui/material/styles";

const ModalViewDetailBooking = (props) => {
  const theme = useTheme(); // dùng theme
  const { show, setIsShowModalViewBooking, bookingDetail } = props;
  const [booking, setBooking] = useState({});

  const handleClose = () => {
    setIsShowModalViewBooking(false);
  };

  useEffect(() => {
    if (!_.isEmpty(bookingDetail) && show) {
      setBooking(bookingDetail);
    }
  }, [bookingDetail, show]);

  return (
    <div>
      <Modal
        size="xl"
        show={show}
        onHide={handleClose}
        backdrop="static"
        className="modal-add-new-yacht"
        autoFocus
        contentClassName="custom-modal-content"
        style={{
          backgroundColor: theme.palette.background.default,
          color: theme.palette.text.primary,
        }}
      >
        <Modal.Header closeButton style={{ borderBottom: `1px solid ${theme.palette.divider}` }}>
          <Modal.Title style={{ color: theme.palette.text.primary }}>Booking Detail</Modal.Title>
        </Modal.Header>

        <Modal.Body style={{ backgroundColor: theme.palette.background.paper, color: theme.palette.text.primary }}>
          <h5 style={{ color: theme.palette.text.primary }}>Rooms</h5>
          <ul>
            {bookingDetail.consultationData?.requestedRooms &&
            bookingDetail.consultationData.requestedRooms.length > 0 ? (
              bookingDetail.consultationData.requestedRooms.map((room, index) => (
                <li key={index} style={{ marginBottom: "1rem" }}>
                  <b>{room.roomId?.name}</b> - {room.roomId?.description} (x{room.quantity})
                  <br />
                  <b>Loại phòng:</b> {room.roomId?.roomTypeId?.type} | <b>Tiện ích:</b>{" "}
                  {room.roomId?.roomTypeId?.utility}
                  <br />
                  <img
                    src={room.roomId?.avatar}
                    alt=""
                    width={100}
                    style={{
                      borderRadius: "8px",
                      border: `1px solid ${theme.palette.divider}`,
                      marginTop: "6px",
                    }}
                  />
                </li>
              ))
            ) : (
              <p style={{ color: theme.palette.text.secondary }}>No rooms booked.</p>
            )}
          </ul>

          <h5 style={{ color: theme.palette.text.primary }}>Services</h5>
          <ul>
            {bookingDetail.consultationData?.requestServices &&
            bookingDetail.consultationData.requestServices.length > 0 ? (
              bookingDetail.consultationData.requestServices.map((service, index) => (
                <li key={index}>
                  {service.serviceId?.serviceName} - Price:{" "}
                  {service.serviceId?.price?.toLocaleString()} (x{service.quantity})
                </li>
              ))
            ) : (
              <p style={{ color: theme.palette.text.secondary }}>No services added.</p>
            )}
          </ul>

          <h5 style={{ color: theme.palette.text.primary }}>Reason</h5>
          <ul>
            <li style={{ color: theme.palette.text.secondary }}>
              Reason: {bookingDetail.reason || "Không có lý do"}
            </li>
          </ul>
        </Modal.Body>

        <Modal.Footer style={{ borderTop: `1px solid ${theme.palette.divider}` }}>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ModalViewDetailBooking;
