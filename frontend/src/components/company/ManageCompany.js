import Sidebar from "./Sidebar";
import { FaBars } from "react-icons/fa";
import "./Company.scss";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import React from "react";

const ManageCompany = ({ props, toggleTheme, mode }) => {
  const [collapsed, setcollapsed] = useState(false);

  return (
    <div className="company-container">
      <div className="company-sidebar">
        <Sidebar collapsed={collapsed} toggleTheme={toggleTheme} mode={mode} />
      </div>
      <div className="company-content">
        <div className="company-header">
          <FaBars onClick={() => setcollapsed(!collapsed)} />
        </div>
        <div className="company-main">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default ManageCompany;
