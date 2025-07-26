import { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import { FaCalendar, FaCalendarCheck, FaCalendarDay, FaCalendarTimes, FaMoneyCheckAlt } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Bar, BarChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis } from "recharts";
import {
  exportBookingOrder,
  getAllBooking,
  getBookingByYear,
  getStatisticBooking,
  getStatisticService,
} from "../../services/ApiServices";
import "./Dashboard.scss";
import { useTheme } from "@mui/material/styles";

const Dashboard = () => {
  // const idCompany = useSelector(state => state.account.account.idCompany)
  const idCompany = useSelector((state) => state.account.account.idCompany);
  const [totalBooking, setTotalBooking] = useState("");
  const [totalService, setTotalService] = useState("");
  const [allBooking, setAllBooking] = useState({});
  const [allBookingByYear, setAllBookingByYear] = useState([]);
  const theme = useTheme();
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");

  useEffect(() => {
    getTotalBooking();
    getTotalService();
    getAllBookingStatus();
    getAllBookingByYear();
  }, [month, year]);

  const getTotalBooking = async () => {
    try {
      let res = await getStatisticBooking(idCompany, month, year);
      // console.log('Get Total Booking', res.data)
      if (res && res.data) {
        setTotalBooking(res.data);
      } else if (res.data === 0) {
        setTotalBooking(res.data);
      }
    } catch (error) {
      console.log("Get Total Booking Error");
    }
  };
  const getTotalService = async () => {
    try {
      let res = await getStatisticService(idCompany, month, year);
      if (res && res.data) {
        setTotalService(res.data);
      } else if (res.data === 0) {
        setTotalService(res.data);
      }
    } catch (error) {
      console.log("Get Total Service Error");
    }
  };
  const getAllBookingStatus = async () => {
    try {
      let res = await getAllBooking(idCompany, month, year);
      if (res && res.data) {
        setAllBooking(res.data);
      }
    } catch (error) {
      console.log("Get Booking By Status Error");
    }
  };
  const getAllBookingByYear = async () => {
    try {
      let res = await getBookingByYear(idCompany, year);
      if (res && res.data) {
        setAllBookingByYear(res.data);
      }
    } catch (error) {
      console.log("Get Booking By Year Error");
    }
  };

  const reportBookingOrder = async () => {
    try {
      const res = await exportBookingOrder(idCompany, month, year);
      // Nếu response là Blob và content-type đúng, tải file
      if (
        res.data instanceof Blob &&
        res.headers["content-type"] &&
        res.headers["content-type"].includes("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
      ) {
        const url = window.URL.createObjectURL(res.data);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `YachtBooking_${month || "all"}_${year || "all"}.xlsx`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } else {
        alert("Export lỗi: Dữ liệu trả về không phải file Excel!");
        console.log("Export response:", res.data, typeof res.data, res.data instanceof Blob);
      }
    } catch (error) {
      if (error.response && error.response.data) {
        if (error.response.data instanceof Blob) {
          const reader = new FileReader();
          reader.onload = function () {
            alert("Export lỗi (blob): " + reader.result);
          };
          reader.readAsText(error.response.data);
        } else if (typeof error.response.data === "string") {
          alert("Export lỗi (string): " + error.response.data);
        } else if (typeof error.response.data === "object") {
          alert("Export lỗi (object): " + JSON.stringify(error.response.data));
        } else {
          alert("Export lỗi: Không xác định");
        }
      } else {
        alert("Export lỗi: " + error.message);
      }
      console.log("Export error", error);
    }
  };
  const total = Object.values(allBooking).reduce((sum, count) => sum + count, 0);

  return (
    <div>
      <div className="p-2 container">
        <div className="d-flex justify-content-between">
          <div className="d-flex">
            <Form.Select
              onChange={(event) => setMonth(event.target.value)}
              style={{
                width: "fit-content",
                backgroundColor: theme.palette.background.paper,
                color: theme.palette.text.primary,
                border: `1px solid ${theme.palette.divider}`,
              }}
            >
              <option value="7">July</option>
              <option value="1">January</option>
              <option value="2">February</option>
              <option value="3">March</option>
              <option value="4">April</option>
              <option value="5">May</option>
              <option value="6">June</option>
              <option value="8">August</option>
              <option value="9">September</option>
              <option value="10">October</option>
              <option value="11">November</option>
              <option value="12">December</option>
            </Form.Select>

            <Form.Select
              onChange={(event) => setYear(event.target.value)}
              className="mx-3"
              style={{
                width: "fit-content",
                backgroundColor: theme.palette.background.paper,
                color: theme.palette.text.primary,
                border: `1px solid ${theme.palette.divider}`,
              }}
            >
              <option value="2024">2024</option>
              <option value="2025">2025</option>
              <option value="2026">2026</option>
              <option value="2027">2027</option>
              <option value="2028">2028</option>
            </Form.Select>
          </div>
        </div>

        <div className="d-flex booking mt-3">
          <div
            className="child"
            style={{
              backgroundColor: theme.palette.background.paper,
              color: theme.palette.text.primary,
              border: `1px solid ${theme.palette.divider}`,
              boxShadow: theme.shadows[1],
            }}
          >
            <div className="d-flex justify-content-between">
              <h4 className="fw-bold">{total || 0}</h4>
              <FaCalendar />
            </div>
            <p>Total Booking</p>
          </div>

          <div
            className="child"
            style={{
              backgroundColor: theme.palette.background.paper,
              color: theme.palette.text.primary,
              border: `1px solid ${theme.palette.divider}`,
              boxShadow: theme.shadows[1],
            }}
          >
            <div className="d-flex justify-content-between">
              <h4 className="fw-bold">{allBooking.rejected || 0}</h4>
              <FaCalendarCheck />
            </div>
            <p>Reject Booking</p>
          </div>

          <div
            className="child"
            style={{
              backgroundColor: theme.palette.background.paper,
              color: theme.palette.text.primary,
              border: `1px solid ${theme.palette.divider}`,
              boxShadow: theme.shadows[1],
            }}
          >
            <div className="d-flex justify-content-between">
              <h4 className="fw-bold">{allBooking.cancelled || 0}</h4>
              <FaCalendarTimes />
            </div>
            <p>Cancel Booking</p>
          </div>

          <div
            className="child"
            style={{
              backgroundColor: theme.palette.background.paper,
              color: theme.palette.text.primary,
              border: `1px solid ${theme.palette.divider}`,
              boxShadow: theme.shadows[1],
            }}
          >
            <div className="d-flex justify-content-between">
              <h4 className="fw-bold">{allBooking.completed || 0}</h4>
              <FaCalendarDay />
            </div>
            <p>Completed Booking</p>
          </div>
        </div>

        <div
          className="d-flex revenue my-2 py-2"
          style={{
            backgroundColor: theme.palette.background.default,
            color: theme.palette.text.primary,
            borderRadius: 12,
          }}
        >
          <div
            className="child1 mx-5"
            style={{
              backgroundColor: theme.palette.background.paper,
              color: theme.palette.text.primary,
              border: `1px solid ${theme.palette.divider}`,
              boxShadow: theme.shadows[1],
            }}
          >
            <div className="d-flex justify-content-between">
              <h4 className="fw-bold">
                {totalBooking?.revenue?.toLocaleString() === "0" ? 0 : totalBooking?.revenue?.toLocaleString()} vnd
              </h4>
              <FaMoneyCheckAlt />
            </div>
            <p>Revenue Booking</p>
          </div>

          <div
            className="child1"
            style={{
              backgroundColor: theme.palette.background.paper,
              color: theme.palette.text.primary,
              border: `1px solid ${theme.palette.divider}`,
              boxShadow: theme.shadows[1],
            }}
          >
            <div className="d-flex justify-content-between">
              <h4 className="fw-bold">
                {totalService?.revenueService?.toLocaleString() === "0"
                  ? 0
                  : totalService?.revenueService?.toLocaleString()}{" "}
                vnd
              </h4>
              <FaMoneyCheckAlt />
            </div>
            <p>Revenue Service</p>
          </div>
        </div>
      </div>

      <div className="my-5">
        <div className="mx-5">
          <h4 className="fw-bold">BarChart Status Of Booking In Year {year || "2024"}</h4>
        </div>
        <div className="my-3 graph">
          <BarChart width={1100} height={250} data={allBookingByYear}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="Month" stroke={theme.palette.text.primary} />
            <YAxis stroke={theme.palette.text.primary} />
            <Tooltip
              contentStyle={{
                backgroundColor: theme.palette.background.paper,
                color: theme.palette.text.primary,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 8,
              }}
            />
            <Legend />
            <Bar dataKey="confirm" fill={theme.palette.primary.main} />
            <Bar dataKey="cancel" fill={theme.palette.error?.main || "red"} />
          </BarChart>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
