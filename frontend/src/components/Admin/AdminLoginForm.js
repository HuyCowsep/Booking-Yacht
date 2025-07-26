import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import "./AdminStyle.css";
import { useDispatch } from "react-redux";
import { doAdminLogin } from "../../redux/actions/adminActions";

export default function AdminLoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      toast.warning("Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu", {
        position: "top-center",
      });
      return;
    }

    try {
      const res = await axios.post("http://localhost:9999/api/v1/admin/login", {
        username,
        password,
      });

      await Swal.fire({
        icon: "success",
        title: "Đăng nhập thành công!",
        text: res.data.message || "Chào mừng bạn quay trở lại!",
        confirmButtonColor: "#3085d6",
        timer: 1500,
        timerProgressBar: true,
        showConfirmButton: false,
      });
      // dùng redux, thêm mọi thứ vào dispatch
      dispatch(doAdminLogin(res.data.admin, res.data.admin.role, res.data.token));

      navigate("/admin");
    } catch (error) {
      const message = error?.response?.data?.message || "Đăng nhập thất bại";

      await Swal.fire({
        icon: "error",
        title: "Lỗi đăng nhập",
        text: message,
        confirmButtonColor: "#d33",
      });
    }
  };

  return (
    <div
      className="admin-login-background"
      style={{
        background: "linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)",
        backgroundImage: 'url("/images/background-admin-login.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div className="admin-login-wrapper">
        <form onSubmit={handleLogin}>
          <h2>𝓛𝓸𝓷𝓰𝓦𝓪𝓿𝓮 - Admin </h2>

          <div className="admin-login-input-field">
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
            <label>Nhập tên đăng nhập</label>
          </div>

          <div className="admin-login-input-field">
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <label>Nhập mật khẩu</label>
          </div>

          <div className="admin-login-forget">
            <label htmlFor="remember">
              <input type="checkbox" id="remember" />
              <p>Remember me</p>
            </label>
            <a href="#">Quên mật khẩu?</a>
          </div>

          <button type="submit">Đăng nhập</button>
        </form>
      </div>
    </div>
  );
}