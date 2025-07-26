import { Link } from "react-router-dom";
import "./AccessDeniedStyle.css";

export default function AccessDenied() {
  return (
    <div className="access-denied-body">
      <div className="access-denied-container w3-display-middle">
        <h1 className="access-denied-title w3-jumbo w3-animate-top w3-center">
          <code>TRUY CẬP BỊ TỪ CHỐI</code>
        </h1>
        <hr className="access-denied-hr w3-border-white w3-animate-left" />
        <h3 className="access-denied-text w3-center w3-animate-right">
          Bạn không có quyền truy cập trang WEB này.
        </h3>
        <h3 className="access-denied-text w3-center w3-animate-right">
          (Hoặc có thể tài khoản của bạn bị CẤM)
        </h3>
        <h3 className="access-denied-icon w3-center w3-animate-zoom">🚫🚫🚫🚫</h3>
        <h6 className="access-denied-error w3-center w3-animate-zoom">
          Error Code: 403 forbidden
        </h6>
        <Link to="/" className="access-denied-link nav-item nav-link active">
          &larr; Trở về trang chủ
        </Link>
      </div>
    </div>
  );
}
