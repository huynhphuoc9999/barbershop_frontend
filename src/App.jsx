import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { routes } from "./routes/routes";
import PrivateRoute from "./routes/PrivateRoute";
import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";

// Toast message
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Import các trang Auth
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import ResetPassword from "./pages/Auth/ResetPassword";

// Import Homepage
import HomePage from "./pages/HomePage"; // 🔁 Bạn cần tạo file này

// Import các trang public đặc biệt
import OAuth2RedirectHandler from "./pages/Auth/OAuth2RedirectHandler";
import PaymentSuccessVNPay from "./pages/payment/PaymentSuccessVNPay";

function App() {
  return (
    <BrowserRouter>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        {/* ✅ Public homepage - KHÔNG dùng PrivateRoute */}
        <Route
          path="/"
          element={
            <MainLayout>
              <HomePage />
            </MainLayout>
          }
        />

        {/* ✅ Auth routes */}
        <Route
          path="/login"
          element={
            <AuthLayout>
              <Login />
            </AuthLayout>
          }
        />
        <Route
          path="/register"
          element={
            <AuthLayout>
              <Register />
            </AuthLayout>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <AuthLayout>
              <ForgotPassword />
            </AuthLayout>
          }
        />
        <Route
          path="/reset-password"
          element={
            <AuthLayout>
              <ResetPassword />
            </AuthLayout>
          }
        />

        {/* ✅ Public OAuth2 redirect - KHÔNG dùng PrivateRoute vì chưa có token */}
        <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />

        {/* ✅ Public VNPay return - KHÔNG dùng PrivateRoute vì VNPay redirect không kèm JWT */}
        <Route path="/vnpay-return" element={<PaymentSuccessVNPay />} />

        {/* ✅ Admin routes */}
        {routes.Admin.map((route, idx) => (
          <Route
            key={idx}
            path={route.path}
            element={
              <PrivateRoute allowedRoles={["Admin"]}>
                <MainLayout>{route.element}</MainLayout>
              </PrivateRoute>
            }
          />
        ))}

        {/* ✅ Owner routes */}
        {routes.Owner.map((route, idx) => (
          <Route
            key={idx}
            path={route.path}
            element={
              <PrivateRoute allowedRoles={["Owner"]}>
                <MainLayout>{route.element}</MainLayout>
              </PrivateRoute>
            }
          />
        ))}

        {/* ✅ Barber routes */}
        {routes.Barber.map((route, idx) => (
          <Route
            key={idx}
            path={route.path}
            element={
              <PrivateRoute allowedRoles={["Barber"]}>
                <MainLayout>{route.element}</MainLayout>
              </PrivateRoute>
            }
          />
        ))}

        {/* ✅ Customer routes */}
        {routes.Customer.map((route, idx) => (
          <Route
            key={idx}
            path={route.path}
            element={
              <PrivateRoute allowedRoles={["Customer"]}>
                <MainLayout>{route.element}</MainLayout>
              </PrivateRoute>
            }
          />
        ))}

        {/* Fallback nếu không khớp */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
