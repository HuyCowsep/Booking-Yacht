// RevenueSummary.js
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";

// Hàm chuyển đổi viết tắt sang tên tháng tiếng Anh đầy đủ
const monthFullName = {
  Jan: "January",
  Feb: "February",
  Mar: "March",
  Apr: "April",
  May: "May",
  Jun: "June",
  Jul: "July",
  Aug: "August",
  Sep: "September",
  Oct: "October",
  Nov: "November",
  Dec: "December",
};

export default function RevenueSummary() {
  const [data, setData] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [yearOptions, setYearOptions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:9999/api/v1/account-companies/revenue/monthly"
        );
        setData(response.data);

        // Lấy danh sách năm có trong dữ liệu
        const years = Array.from(
          new Set(
            response.data.map((row) => row.year || new Date().getFullYear())
          )
        ).sort((a, b) => b - a);
        setYearOptions(years);
        if (years.length > 0) setYear(years[0]);
      } catch (error) {
        console.error("Error fetching revenue data:", error);
      }
    };

    fetchData();
  }, []);

  // Lọc dữ liệu theo năm được chọn
  const filteredData = data.filter(
    (row) => (row.year || new Date().getFullYear()) === year
  );

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} mb={3}>
        Tổng hợp doanh thu các tháng
      </Typography>
      <Box mb={2} display="flex" alignItems="center" gap={2}>
        <FormControl size="small">
          <InputLabel>Năm</InputLabel>
          <Select
            value={year}
            label="Năm"
            onChange={(e) => setYear(Number(e.target.value))}
            sx={{ minWidth: 100 }}
          >
            {yearOptions.map((y) => (
              <MenuItem key={y} value={y}>
                {y}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <Paper sx={{ p: 4, mb: 4 }}>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={filteredData.map((row) => ({
              ...row,
              commission: row.earnings * 0.05,
            }))}
            margin={{ left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="commission" fill="#1976d2" name="Commission (5%)" />
          </BarChart>
        </ResponsiveContainer>
      </Paper>
      <Box display="flex" justifyContent="center">
        <Paper sx={{ p: 3, minWidth: 700, width: "80%" }}>
          <Typography variant="h6" mb={2} align="center">
            Bảng doanh thu
          </Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center">Month</TableCell>
                <TableCell align="center">Earnings</TableCell>
                <TableCell align="center">Commission (5%)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.map((row) => (
                <TableRow key={row.month}>
                  <TableCell align="center">
                    {monthFullName[row.month] || row.month}
                  </TableCell>
                  <TableCell align="center">
                    {row.earnings.toLocaleString()} đ
                  </TableCell>
                  <TableCell align="center">
                    {(row.earnings * 0.05).toLocaleString()} đ
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Box>
    </Box>
  );
}
