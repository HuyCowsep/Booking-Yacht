import React, { useState, useEffect } from "react";
import axiosClient from "../../utils/axiosClient"; //đường dẫn đúng rồi
import {
  Box,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  TablePagination, // Thêm dòng này
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import "react-toastify/dist/ReactToastify.css";

export default function CompanyManagement() {
  const [companies, setCompanies] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  // Thêm state cho phân trang
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Lấy danh sách công ty từ BE khi load trang
  useEffect(() => {
    axiosClient
      .get("/api/v1/companies/all")
      .then((res) => setCompanies(Array.isArray(res) ? res : [])) // Chỉ thay đổi ở đây, vì response.data là array trực tiếp
      .catch(() => setCompanies([]));
  }, []);

  const handleOpenDialog = (company = null) => {
    setEditingCompany(company);
    setFormData(
      company
        ? { ...company, username: company.accountId?.username || "", password: "", confirmPassword: "" }
        : { name: "", address: "", email: "", username: "", password: "", confirmPassword: "" }
    );
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setFormData({ name: "", address: "", email: "", username: "", password: "", confirmPassword: "" });
    setEditingCompany(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!editingCompany) {
      // Kiểm tra password và confirmPassword
      if (formData.password !== formData.confirmPassword) {
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: "Mật khẩu và xác nhận mật khẩu không khớp!",
        });
        return;
      }
      try {
        const res = await axiosClient.post("/api/v1/companies", {
          name: formData.name,
          address: formData.address,
          email: formData.email,
          username: formData.username,
          password: formData.password,
        });
        Swal.fire({
          icon: "success",
          title: "Thành công",
          text: res.message || "Thêm mới thành công!",
        });

        const resList = await axiosClient.get("/api/v1/companies/all");
        setCompanies(Array.isArray(resList) ? resList : []); // Chỉ thay đổi ở đây
        handleCloseDialog();
      } catch (err) {
        console.error(err);
        if (err.response?.data?.error?.includes("duplicate")) {
          Swal.fire({
            icon: "error",
            title: "Lỗi",
            text: "Username đã tồn tại!",
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Lỗi",
            text: "Thêm công ty thất bại!",
          });
        }
      }
    } else {
      try {
        const res = await axiosClient.put(`/api/v1/companies/${editingCompany._id}`, {
          name: formData.name,
          address: formData.address,
          email: formData.email,
          username: formData.username,
        });
        Swal.fire({
          icon: "success",
          title: "Thành công",
          text: res.message || "Cập nhật thành công!",
        });

        const resList = await axiosClient.get("/api/v1/companies/all");
        setCompanies(Array.isArray(resList) ? resList : []); // Chỉ thay đổi ở đây
        handleCloseDialog();
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: "Cập nhật công ty thất bại!",
        });
      }
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Bạn có chắc chắn?",
      text: "Hành động này sẽ xoá công ty vĩnh viễn!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Xoá",
      cancelButtonText: "Huỷ",
    });

    if (!result.isConfirmed) return;

    try {
      const res = await axiosClient.delete(`/api/v1/companies/${id}`);
      Swal.fire({
        icon: "success",
        title: "Thành công",
        text: res.message || "Xoá thành công!",
      });

      setCompanies((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Xoá công ty thất bại!",
      });
    }
  };

  // Thêm hàm xử lý phân trang
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box>
      <Typography variant="h5" fontWeight={600} mb={2}>
        Company Management
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Box display="flex" justifyContent="flex-end" mb={2}>
          <Button variant="contained" onClick={() => handleOpenDialog()}>
            Add Company
          </Button>
        </Box>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Username</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {companies.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((company) => (
              <TableRow key={company._id}>
                <TableCell>{company.name}</TableCell>
                <TableCell>{company.address}</TableCell>
                <TableCell>{company.email}</TableCell>
                <TableCell>
                  {company.accountId?.username ? (
                    company.accountId.username
                  ) : (
                    <Box
                      sx={{
                        display: "inline-block",
                        px: 1.5,
                        py: 0.5,
                        border: "1px solid",
                        borderColor: "error.main",
                        borderRadius: 2,
                        bgcolor: (theme) => theme.palette.error.light,
                        color: "white",
                        fontSize: "0.875rem",
                        fontWeight: 500,
                      }}
                    >
                      Tài khoản bị xoá
                    </Box>
                  )}
                </TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleOpenDialog(company)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(company._id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={companies.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      </Paper>

      <Dialog open={dialogOpen} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <DialogTitle>{editingCompany ? "Edit Company" : "Add Company"}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Company Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            margin="dense"
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            margin="dense"
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            margin="dense"
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            fullWidth
            required
          />
          {!editingCompany && (
            <>
              <TextField
                margin="dense"
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                fullWidth
                required
              />
              <TextField
                margin="dense"
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                fullWidth
                required
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
