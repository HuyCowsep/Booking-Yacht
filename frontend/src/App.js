import { CssBaseline, ThemeProvider } from "@mui/material";
import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useDispatch, useSelector } from "react-redux";
import { openTransactionModal } from "./redux/actions";
import { initializeAuth } from "./redux/asyncActions";
import { getTheme } from "./theme/theme";

// Pages & Components
import Login from "./auth/Login";
import Register from "./auth/Register";
import BlogDetail from "./components/Blog/BlogDetail";
import BlogList from "./components/Blog/BlogList";
import Enterprise from "./components/Enterprise/Enterprise";
import AboutUs from "./layout/componentsFooter/AboutUs";
import ContactSection from "./layout/componentsFooter/ContactSection";
import PaymentMethods from "./layout/componentsFooter/PaymentMethods";
import PrivacyPolicy from "./layout/componentsFooter/PrivacyPolicy";
import TermsAndConditions from "./layout/componentsFooter/TermsAndConditions";
import UserGuide from "./layout/componentsFooter/UserGuide";
import ChangePassword from "./layout/componentsHeader/ChangePassword";
import CustomerProfile from "./layout/componentsHeader/CustomerProfile";
import BookingHistory from "./pages/BookingHistory";
import DetailBoat from "./pages/DetailBoat";
import FindBoat from "./pages/FindBoat";
import HomePage from "./pages/HomePage";

import Calender from './components/company/Calender';
import Dashboard from './components/company/Dashboard';
import ManageCompany from './components/company/ManageCompany';
import ManageRoom from './components/company/ManageRoom';
import ManageSchedule from './components/company/ManageSchedule';
import ManageServiceYacht from './components/company/ManageServiceYacht';
import ManageYacht from './components/company/ManageYacht';
import ProfileCompany from './components/company/Profile';
import ViewBooking from './components/company/ViewBooking';
import ViewYacht from './components/company/ViewYacht';
import ProtectedRoute from './components/routers/ProtectedRoute';

// Footer Info Pages
import FAQ from "./layout/componentsFooter/FAQ";
import RulesAndNotes from "./layout/componentsFooter/RulesAndNotes";
import MainLayout from "./layout/MainLayout";

// Modals
import ConfirmationModal from "./components/DetailBoat/Booking/ConfirmationModal";
import InvoiceModal from "./components/DetailBoat/Booking/InvoiceModal";
import TransactionModal from "./components/DetailBoat/Booking/TransactionModal";

// Admin Components
import AdminLoginForm from "./components/Admin/AdminLoginForm";
import AdminDashboard from "./components/Admin/AdminDashboard";
import AdminProfile from "./components/Admin/AdminProfile";
import ProtectedAdminRoute from "./components/routers/ProtectedAdminRoute";

function useBodyScrollLock() {
  const showTransactionModal = useSelector((state) => state.ui.modals.showTransactionModal);
  const showConfirmationModal = useSelector((state) => state.ui.modals.showConfirmationModal);
  useEffect(() => {
    if (showTransactionModal || showConfirmationModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showTransactionModal, showConfirmationModal]);
}

function AppWrapper() {
  const [mode, setMode] = useState(localStorage.getItem("themeMode") || "light");
  const dispatch = useDispatch();
  const showTransactionModal = useSelector((state) => state.ui.modals.showTransactionModal);
  const bookingIdFortransaction = useSelector((state) => state.ui.modals.bookingIdFortransaction);
  const showConfirmationModal = useSelector((state) => state.ui.modals.showConfirmationModal);

  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  useEffect(() => {
    const bookingId = localStorage.getItem("bookingIdForTransaction");
    if (bookingId) {
      dispatch(openTransactionModal(bookingId));
    }
  }, [dispatch]);

  useBodyScrollLock();

  const toggleTheme = () => {
    const newMode = mode === "light" ? "dark" : "light";
    localStorage.setItem("themeMode", newMode);
    setMode(newMode);
  };

  const theme = getTheme(mode);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        <Route element={<MainLayout toggleTheme={toggleTheme} mode={mode} />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/find-boat" element={<FindBoat />} />
          <Route path="/boat-detail/:id" element={<DetailBoat />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/ve-chung-toi" element={<AboutUs />} />
          <Route path="/dieu-khoan-va-dieu-kien" element={<TermsAndConditions />} />
          <Route path="/chinh-sach-rieng-tu" element={<PrivacyPolicy />} />
          <Route path="/huong-dan-su-dung" element={<UserGuide />} />
          <Route path="/hinh-thuc-thanh-toan" element={<PaymentMethods />} />
          <Route path="/cau-hoi-thuong-gap" element={<FAQ />} />
          <Route path="/quy-dinh-chung-va-luu-y" element={<RulesAndNotes />} />
          <Route path="/lien-he-tu-van" element={<ContactSection />} />
          <Route path="/doanh-nghiep" element={<Enterprise />} />
          <Route path="/view-profile" element={<CustomerProfile />} />
          <Route path="/booking-history" element={<BookingHistory />} />
          <Route path="/blog" element={<BlogList />} />
          <Route path="/blog/:id" element={<BlogDetail />} />
          <Route path="/admin-login" element={<AdminLoginForm />} />
        </Route>

        <Route
          path="/manage-company"
          element={
            <ProtectedRoute>
              <ManageCompany toggleTheme={toggleTheme} mode={mode}/>
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="booking" element={<ViewBooking />} />
          <Route path="view-yacht" element={<ViewYacht />} />
          <Route path="profile" element={<ProfileCompany />} />
          <Route path="schedule" element={<Calender />} />
        </Route>

        <Route path="manage-yacht/:idYacht" element={<ManageYacht />} />
        <Route path="manage-room/:idYacht" element={<ManageRoom />} />
        <Route path="manage-services-yacht/:idYacht" element={<ManageServiceYacht />} />
        <Route path="manage-schedule/:idYacht" element={<ManageSchedule />} />

        {/* Khai báo các route cho admin */}
        <Route
          path="/admin"
          element={
            <ProtectedAdminRoute>
              <AdminDashboard toggleTheme={toggleTheme} mode={mode} />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/profile"
          element={
            <ProtectedAdminRoute>
              <AdminProfile toggleTheme={toggleTheme} mode={mode} />
            </ProtectedAdminRoute>
          }
        />
        <Route path="/admin-login" element={<AdminLoginForm />} />
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={mode}
      />

      <InvoiceModal />
      {showTransactionModal && <TransactionModal />}
      <ConfirmationModal />
    </ThemeProvider>
  );
}

// ✅ Bao ngoài bằng BrowserRouter đúng cách
function App() {
  return <AppWrapper />;
}

export default App;
