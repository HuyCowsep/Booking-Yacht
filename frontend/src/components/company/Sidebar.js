import { AiOutlineMoon, AiOutlineSun } from "react-icons/ai";
import { FaShip } from "react-icons/fa6";
import { ImProfile } from "react-icons/im";
import { MdDashboard } from "react-icons/md";
import { SlCalender } from "react-icons/sl";
import { TbBrandBooking, TbLogout2 } from "react-icons/tb";
import { Menu, MenuItem, ProSidebar, SidebarContent, SidebarFooter, SidebarHeader } from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";
import { useDispatch } from "react-redux";
import { Link, NavLink } from "react-router-dom";
import sidebarBg from "../../assets/sidebar.jpg";
import { doLogout } from "../../redux/actions/userAction";

const Sidebar = (props) => {
  const { collapsed, toggled, handleToggleSidebar, toggleTheme, mode } = props;

  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(doLogout());
    localStorage.removeItem("token");
    localStorage.removeItem("customer");
  };
  return (
    <div>
      <ProSidebar
        image={sidebarBg}
        collapsed={collapsed}
        toggled={toggled}
        breakPoint="md"
        onToggle={handleToggleSidebar}
      >
        <SidebarHeader>
          <div
            style={{
              padding: "24px",
              textTransform: "uppercase",
              fontWeight: "bold",
              fontSize: 14,
              letterSpacing: "1px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            <span>Company Yacht Cruise</span>
          </div>
        </SidebarHeader>

        <SidebarContent>
          <Menu iconShape="circle">
            <MenuItem icon={<MdDashboard />}>
              Dashboard
              <Link to="/manage-company" />
            </MenuItem>
          </Menu>
          <Menu iconShape="circle">
            <MenuItem icon={<TbBrandBooking />}>
              Customer Booking
              <Link to="/manage-company/booking" />
            </MenuItem>
          </Menu>
          <Menu iconShape="circle">
            <MenuItem icon={<FaShip />}>
              {" "}
              View Yacht
              <Link to="/manage-company/view-yacht" />
            </MenuItem>
          </Menu>

          <Menu iconShape="circle">
            <MenuItem icon={<SlCalender />}>
              {" "}
              Schedule Yacht
              <Link to="/manage-company/schedule" />
            </MenuItem>
          </Menu>

          <Menu iconShape="circle">
            <MenuItem icon={<ImProfile />}>
              Profile
              <Link to="/manage-company/profile" />
            </MenuItem>
          </Menu>
        </SidebarContent>

        <SidebarFooter style={{ textAlign: "center" }}>
          <div className="sidebar-btn-wrapper d-flex flex-column align-items-center" style={{ padding: "20px 24px" }}>
            {/* Nút đổi theme */}
            <button
              onClick={toggleTheme}
              className="btn btn-outline-light mb-2 d-flex align-items-center"
              style={{ fontSize: "14px" }}
            >
              {mode === "light" ? (
                <>
                  <AiOutlineMoon style={{ marginRight: 8 }} /> Chế độ tối
                </>
              ) : (
                <>
                  <AiOutlineSun style={{ marginRight: 8 }} /> Chế độ sáng
                </>
              )}
            </button>

            {/* Nút logout */}
            <NavLink
              onClick={handleLogout}
              className="nav-link mt-2"
              to="/login"
              style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
            >
              <TbLogout2 size={25} />
              <span
                style={{
                  fontSize: "16px",
                  fontWeight: "600",
                  color: "white",
                  letterSpacing: "0.5px",
                  textTransform: "uppercase",
                }}
              >
                Logout
              </span>
            </NavLink>
          </div>
        </SidebarFooter>
      </ProSidebar>
    </div>
  );
};

export default Sidebar;
