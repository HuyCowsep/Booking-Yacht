import { useEffect, useState } from "react";
import { Button, Form, FormControl, FormGroup } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  companyCancelBooking,
  companyCompleteBooking,
  confirmBooking,
  confirmFullPaymentBooking,
  getBookingByAmount,
  getBookingOrder,
} from "../../services/ApiServices";
import "./Company.scss";
import { useTheme } from "@mui/material/styles";
import { Link } from "react-router-dom";
import ModalReasonCompany from "./Modal/ModalReasonCompany";
import ModalViewDetailBooking from "./ModalViewDetailBooking";

const ViewBooking = () => {
  const idCompany = useSelector((state) => state.account.account.idCompany);
  const [listBooking, setListBooking] = useState([]);
  const [isShowModalViewBooking, setIsShowModalViewBooking] = useState(false);
  const [filterSearch, setFilterSearch] = useState("");
  const [filterBooking, setFilterBooking] = useState([]);
  const [filterStatus, setFilterStatus] = useState([]);
  const theme = useTheme();
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");

  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 3;

  const [bookingDetail, setBookingDetail] = useState({});

  const [showModalReason, setShowModalReason] = useState(false);
  const [idCancel, setIdCancel] = useState("");
  useEffect(() => {
    getBooking();
  }, []);

  useEffect(() => {
    filterAndPaginateBooking();
  }, [listBooking, filterSearch, currentPage, filterStatus]);

  const formatDate = (dateTimeString) => {
    const dateTime = new Date(dateTimeString);
    const hours = dateTime.getHours();
    const minutes = dateTime.getMinutes();
    const day = dateTime.getDate();
    const month = dateTime.getMonth() + 1; // Months are 0-indexed
    const year = dateTime.getFullYear();

    // Pad single digit minutes with leading zero
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

    return `${hours}:${formattedMinutes} ${day}/${month}/${year}`;
  };

  // Helper: kiểm tra quá 1 ngày chưa
  const isOverOneDay = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diff = now - date;
    return diff > 24 * 60 * 60 * 1000;
  };

  const getBooking = async () => {
    let res = await getBookingOrder(idCompany);
    if (res && res.data) {
      const sortedBookings = res.data.sort((a, b) => new Date(b.bookingTime) - new Date(a.bookingTime));
      setListBooking(sortedBookings);
    } else toast.error("Not Found Booking");
  };

  const handleViewDetailBooking = (booking) => {
    setIsShowModalViewBooking(true);
    setBookingDetail(booking);
  };

  const handleConfrimBooking = async (idBooking) => {
    let res = await confirmBooking(idCompany, idBooking);
    if (res && res.data) {
      toast.success("Confimed Booking Successfully");
      getBooking();
    } else {
      toast.error("Confirm Fail");
    }
  };

  const handleCancelBooking = async (idBooking) => {
    try {
      const res = await companyCancelBooking(idBooking);
      if (res && res.data) {
        toast.success("Đã huỷ booking!");
        getBooking();
      } else {
        toast.error("Huỷ booking thất bại!");
      }
    } catch (err) {
      toast.error("Lỗi khi huỷ booking!");
    }
  };

  const handlePageChange = (selectedItem) => {
    setCurrentPage(selectedItem.selected);
  };

  const filterAndPaginateBooking = () => {
    const filtered = listBooking
      .filter((b) =>
        (b.customerInfo?.fullName || b.customer?.fullName || "")
          .toLowerCase()
          .includes(filterSearch.toLowerCase().trim())
      )
      .filter((b) => (filterStatus === "0" ? b : b.status.includes(filterStatus)))
      .filter((b) => b.status !== "pending_payment"); // Không hiển thị booking có status pending_payment

    setFilterBooking(filtered);
  };

  const displayedBooking = filterBooking.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

  // Helper: render trạng thái đẹp
  const renderStatus = (booking) => {
    if (booking.status === "completed") return <span style={{ color: "green", fontWeight: 600 }}>Completed</span>;
    if (booking.status === "confirmed" && booking.paymentStatus === "fully_paid")
      return <span style={{ color: "blue" }}>Đã thanh toán đủ</span>;
    if (booking.status === "confirmed_deposit" && booking.paymentStatus === "deposit_paid")
      return <span style={{ color: "orange" }}>Đặt cọc</span>;
    if (booking.status === "canceled") return <span style={{ color: "red" }}>Khách tự huỷ</span>;
    if (booking.status === "rejected") return <span style={{ color: "red" }}>Company huỷ</span>;
    if (booking.status === "pending") return <span style={{ color: "gray" }}>Chờ xác nhận</span>;
    return <span>{booking.status}</span>;
  };

  // Helper: render nút thao tác
  const renderActions = (booking) => {
    // Nếu đã completed thì chỉ hiển thị View Detail
    if (booking.status === "completed") {
      return (
        <Link onClick={() => handleViewDetailBooking(booking)} className="btn btn-sm btn-warning">
          View Detail
        </Link>
      );
    }
    // Nếu rejected thì chỉ hiển thị View Detail
    if (booking.status === "rejected") {
      return (
        <Link onClick={() => handleViewDetailBooking(booking)} className="btn btn-sm btn-warning">
          View Detail
        </Link>
      );
    }
    // Các thao tác khác vẫn giữ nguyên, nhưng luôn có Cancel
    return (
      <>
        <Link onClick={() => handleViewDetailBooking(booking)} className="btn btn-sm btn-warning">
          View Detail
        </Link>
        {booking.status === "confirmed_deposit" && booking.paymentStatus === "deposit_paid" && (
          <Link onClick={() => handleConfirmFullPayment(booking._id)} className="btn btn-sm btn-success ms-2">
            Xác nhận thanh toán đủ
          </Link>
        )}
        {booking.status === "confirmed" && booking.paymentStatus === "fully_paid" && (
          <Link onClick={() => handleConfirmCompleted(booking._id)} className="btn btn-sm btn-primary ms-2">
            Xác nhận hoàn thành
          </Link>
        )}
        <Button className="btn btn-sm btn-danger ms-2" onClick={() => handleCancelBooking(booking._id)}>
          Cancel
        </Button>
      </>
    );
  };

  const handleFilterByAmount = async () => {
    let res = await getBookingByAmount(idCompany, min, max);
    if (res && res.data) {
      setListBooking(res.data);
    }
  };

  // Xác nhận thanh toán đủ
  const handleConfirmFullPayment = async (bookingId) => {
    try {
      const res = await confirmFullPaymentBooking(bookingId);
      if (res && res.data) {
        toast.success("Đã xác nhận thanh toán đủ!");
        getBooking();
      } else {
        toast.error("Xác nhận thanh toán đủ thất bại!");
      }
    } catch (err) {
      console.error("Error confirming full payment:", err);
      toast.error("Lỗi khi xác nhận thanh toán đủ!");
    }
  };
  // Xác nhận hoàn thành
  const handleConfirmCompleted = async (bookingId) => {
    try {
      const res = await companyCompleteBooking(bookingId);
      if (res && res.data) {
        toast.success("Đã xác nhận hoàn thành booking!");
        getBooking();
      } else {
        toast.error("Xác nhận hoàn thành thất bại!");
      }
    } catch (err) {
      toast.error("Lỗi khi xác nhận hoàn thành!");
    }
  };

  return (
    <div
      className="container"
      style={{
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
        padding: "1rem",
        borderRadius: "10px",
      }}
    >
      <div className="row my-4 align-items-end">
        <h2
          className="col-2"
          style={{
            color: theme.palette.text.primary,
            fontWeight: 700,
            fontSize: "24px",
            textShadow: `0 1px 1px ${theme.palette.background.paper}`,
          }}
        >
          Booking
        </h2>
        <FormGroup className="col-2">
          <FormControl placeholder="Tên khách hàng" onChange={(e) => setFilterSearch(e.target.value)} type="text" />
        </FormGroup>

        <FormGroup className="col-2">
          <Form.Select onChange={(event) => setFilterStatus(event.target.value)}>
            <option value="0">Tất cả trạng thái</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="rejected">Rejected</option>
            <option value="completed">Completed</option>
          </Form.Select>
        </FormGroup>

        <FormGroup className="col-2">
          <FormControl placeholder="Min Amount" onChange={(e) => setMin(e.target.value)} type="number" />
        </FormGroup>

        <FormGroup className="col-2">
          <FormControl placeholder="Max Amount" onChange={(e) => setMax(e.target.value)} type="number" />
        </FormGroup>

        <Button onClick={handleFilterByAmount} className="col btn btn-warning">
          Lọc theo tiền
        </Button>
      </div>

      <div className="row container">
        <div className="col-xl-12">
          {displayedBooking &&
            displayedBooking.map((booking) => (
              <div
                style={{
                  backgroundColor: theme.palette.background.paper,
                  color: theme.palette.text.primary,
                  boxShadow: theme.shadows[1],
                  borderRadius: 10,
                }}
                key={booking._id}
                className="card mb-4 order-list"
              >
                <div className="gold-members p-4">
                  <div className="media">
                    <div className="media-body">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <b>Khách hàng:</b> {booking.customerInfo?.fullName || booking.customer?.fullName} |{" "}
                          {booking.customerInfo?.email || booking.customer?.email} |{" "}
                          {booking.customerInfo?.phoneNumber || booking.customer?.phoneNumber}
                        </div>
                        <div>
                          <b>Ngày tạo:</b> {formatDate(booking.createdAt)}
                        </div>
                      </div>

                      <div className="d-flex justify-content-between align-items-center mt-2">
                        <div>
                          <b>Du thuyền:</b> {booking.yacht?.name || booking.yachtName}
                        </div>
                        <div>
                          <b>Mã booking:</b> {booking.bookingCode} | <b>Xác nhận:</b> {booking.confirmationCode}
                        </div>
                      </div>

                      <div className="mt-2">
                        <b>Phòng:</b>{" "}
                        {booking.consultationData?.requestedRooms?.length > 0
                          ? booking.consultationData.requestedRooms.map((room, idx) => (
                              <span key={room.roomId._id}>
                                {room.roomId.name} (x{room.quantity})
                                {idx < booking.consultationData.requestedRooms.length - 1 ? ", " : ""}
                              </span>
                            ))
                          : "Không có"}
                      </div>

                      <div className="mt-1">
                        <b>Dịch vụ:</b>{" "}
                        {booking.consultationData?.requestServices?.length > 0
                          ? booking.consultationData.requestServices.map((service, idx) => (
                              <span key={service.serviceId._id}>
                                {service.serviceId.serviceName} (x{service.quantity})
                                {idx < booking.consultationData.requestServices.length - 1 ? ", " : ""}
                              </span>
                            ))
                          : "Không có"}
                      </div>

                      <div className="mt-1">
                        <b>Yêu cầu đặc biệt:</b>{" "}
                        {booking.consultationData?.requirements || booking.requirement || "Không có"}
                      </div>

                      <div className="mt-2">
                        <b>Thanh toán:</b> Tổng tiền:{" "}
                        <span style={{ fontWeight: "bold" }}>
                          {booking.paymentBreakdown?.totalAmount?.toLocaleString() || booking.amount?.toLocaleString()}
                        </span>{" "}
                        VNĐ | Đã thanh toán:{" "}
                        <span style={{ fontWeight: "bold" }}>
                          {booking.paymentBreakdown?.totalPaid?.toLocaleString() || 0}
                        </span>{" "}
                        VNĐ | Còn lại:{" "}
                        <span style={{ fontWeight: "bold" }}>
                          {booking.paymentBreakdown?.remainingAmount?.toLocaleString() || 0}
                        </span>{" "}
                        VNĐ
                      </div>

                      <hr style={{ borderColor: theme.palette.divider }} />

                      <div className="action d-flex justify-content-between align-items-center">
                        <p className="mb-0 pt-2">
                          Trạng thái:{" "}
                          <span
                            style={{
                              backgroundColor:
                                booking.status === "completed"
                                  ? "#d4edda"
                                  : booking.status === "rejected" || booking.status === "canceled"
                                  ? "#f8d7da"
                                  : "#e2e3e5",
                              color:
                                booking.status === "completed"
                                  ? "#155724"
                                  : booking.status === "rejected" || booking.status === "canceled"
                                  ? "#721c24"
                                  : "#383d41",
                              padding: "4px 10px",
                              borderRadius: "8px",
                              fontWeight: 600,
                              fontSize: "0.9rem",
                              display: "inline-block",
                            }}
                          >
                            {renderStatus(booking)}
                          </span>
                        </p>
                        <div>{renderActions(booking)}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

          <div className="page mt-4">
            <ReactPaginate
              nextLabel="Next >"
              onPageChange={handlePageChange}
              pageRangeDisplayed={3}
              marginPagesDisplayed={2}
              pageCount={Math.ceil(filterBooking.length / itemsPerPage)}
              previousLabel="< Prev"
              pageClassName="page-item"
              pageLinkClassName="page-link"
              previousClassName="page-item"
              previousLinkClassName="page-link"
              nextClassName="page-item"
              nextLinkClassName="page-link"
              breakLabel="..."
              breakClassName="page-item"
              breakLinkClassName="page-link"
              containerClassName="pagination"
              activeClassName="active"
              renderOnZeroPageCount={null}
            />
          </div>
        </div>
      </div>

      <ModalViewDetailBooking
        show={isShowModalViewBooking}
        setIsShowModalViewBooking={setIsShowModalViewBooking}
        bookingDetail={bookingDetail}
      />
      <ModalReasonCompany
        showModalReason={showModalReason}
        setShowModalReason={setShowModalReason}
        idCancel={idCancel}
        getBooking={getBooking}
      />
    </div>
  );
};

export default ViewBooking;
