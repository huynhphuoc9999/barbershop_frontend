import React, { useEffect, useState } from "react";
import { ToastContainer, toast, Slide } from "react-toastify";
import { useSearchParams, useNavigate } from "react-router-dom";

const PaymentSuccessVNPay = () => {
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const status = searchParams.get("status");
    const paymentId = searchParams.get("paymentId");
    const appointmentId = searchParams.get("appointmentId");
    const reason = searchParams.get("reason");

    setLoading(false);

    if (status === "success") {
      setMessage("Thanh toán thành công!");
      toast.success("Thanh toán thành công!", {
        position: "top-right",
        autoClose: 3000,
        transition: Slide,
      });

      setTimeout(() => {
        if (appointmentId) {
          navigate("/customer/history-booking");
        } else {
          navigate("/customer/order-history");
        }
      }, 3000);
    } else {
      const errorMsg = reason ? `Thanh toán thất bại: ${reason}` : "Thanh toán thất bại!";
      setMessage(errorMsg);
      toast.error(errorMsg, {
        position: "top-right",
        autoClose: 3000,
        transition: Slide,
      });

      setTimeout(() => {
        navigate("/");
      }, 3000);
    }
  }, [searchParams, navigate]);

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-gradient-to-br from-black via-gray-900 to-gray-800 p-6">
      <ToastContainer />
      <div className="bg-gray-900 rounded-2xl shadow-2xl border border-yellow-500 p-8 max-w-md w-full text-center">
        <h2 className="text-2xl font-bold mb-4 text-yellow-400">
          Kết quả thanh toán VNPay
        </h2>
        {loading ? (
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mb-4"></div>
            <p className="text-gray-300 text-lg">Đang xử lý...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            {message.includes("thành công") ? (
              <div className="text-green-400 text-5xl mb-4">✓</div>
            ) : (
              <div className="text-red-400 text-5xl mb-4">✗</div>
            )}
            <p className={`${message.includes("thành công") ? "text-green-400" : "text-red-400"} text-lg font-medium`}>
              {message}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccessVNPay;
