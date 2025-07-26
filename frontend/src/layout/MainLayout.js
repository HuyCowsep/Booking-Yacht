import React from "react";
import Header from "../layout/Header";
import Footer from "../layout/Footer";
import { Outlet } from "react-router-dom";

const MainLayout = ({ toggleTheme, mode }) => (
  <>
    <Header toggleTheme={toggleTheme} mode={mode} />
    <Outlet />
    <Footer />
  </>
);

export default MainLayout;
