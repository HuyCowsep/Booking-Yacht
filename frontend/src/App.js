import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { getTheme } from "./theme/theme";
import Header from "./layout/Header";
import Footer from "./layout/Footer";
import HomePage from "./pages/HomePage";
import FindBoat from "./pages/FindBoat";
import Login from "./auth/Login";
import Register from "./auth/Register";
import AboutUs from "./layout/componentsFooter/AboutUs";
import TermsAndConditions from "./layout/componentsFooter/TermsAndConditions";
import PrivacyPolicy from "./layout/componentsFooter/PrivacyPolicy";
import UserGuide from "./layout/componentsFooter/UserGuide";
import PaymentMethods from "./layout/componentsFooter/PaymentMethods";
import ContactSection from "./layout/componentsFooter/ContactSection";
import Enterprise from "./components/Enterprise/Enterprise";
import BlogDetail from "./components/Blog/BlogDetail";
import BlogList from "./components/Blog/BlogList";
import DetailBoat from "./pages/DetailBoat";
import ChangePassword from "./layout/componentsHeader/ChangePassword";
import CustomerProfile from "./layout/componentsHeader/CustomerProfile";
import FAQ from "./layout/componentsFooter/FAQ";
import RulesAndNotes from "./layout/componentsFooter/RulesAndNotes";

function App() {
  const [mode, setMode] = useState(localStorage.getItem("themeMode") || "light");

  const toggleTheme = () => {
    setMode((prevMode) => {
      const newMode = prevMode === "light" ? "dark" : "light";
      localStorage.setItem("themeMode", newMode);
      return newMode;
    });
  };

  const theme = getTheme(mode);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Header toggleTheme={toggleTheme} mode={mode} />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/find-boat" element={<FindBoat />} />
          <Route path="/boat-detail/:id" element={<DetailBoat />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/ve-chung-toi" element={<AboutUs />} />
          <Route path="/dieu-khoan-va-dieu-kien" element={<TermsAndConditions />} />
          <Route path="/chinh-sach-rieng-tu" element={<PrivacyPolicy />} />
          <Route path="/huong-dan-su-dung" element={<UserGuide />} />
          <Route path="/hinh-thuc-thanh-toan" element={<PaymentMethods />} />
          <Route path="/lien-he-tu-van" element={<ContactSection />} />
          <Route path="/cau-hoi-thuong-gap" element={<FAQ />} />
          <Route path="/quy-dinh-chung-va-luu-y" element={<RulesAndNotes />} />
          <Route path="/doanh-nghiep" element={<Enterprise />} />
          <Route path="/blog" element={<BlogList />} />
          <Route path="/blog/:id" element={<BlogDetail />} />
          <Route path="/view-profile" element={<CustomerProfile />} />
          <Route path="/change-password" element={<ChangePassword />} />
        </Routes>
        <Footer />
      </Router>
    </ThemeProvider>
  );
}

export default App;
