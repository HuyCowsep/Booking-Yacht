import { useSelector } from "react-redux";
import AccessDenied from "./AccessDenied";

const ProtectedAdminRoute = ({ children }) => {
  const isAuthenticated = useSelector((state) => state.admin.isAuthenticated);
  const role = useSelector((state) => state.admin.adminAccount?.role);

  if (!isAuthenticated || role !== "ADMIN") {
    return <AccessDenied />;
  }

  return <>{children}</>;
};

export default ProtectedAdminRoute;
