import { Navigate } from "react-router-dom";
const { useSelector } = require("react-redux");
const ProtectedRoute = (props) => {
  const isAuthenticated = useSelector((state) => state.account.isAuthenticated);
  const role = useSelector((state) => state.account.account.role);

  if (!isAuthenticated || role !== "COMPANY") {
    return <Navigate to="/login"></Navigate>;
  }

  return <>{props.children}</>;
};

export default ProtectedRoute;