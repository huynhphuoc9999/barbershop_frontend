import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUserInfo } from "../../services/userServices";

const OAuth2RedirectHandler = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleOAuthRedirect = async () => {
      const queryParams = new URLSearchParams(window.location.search);
      const token = queryParams.get("token");

      if (!token) {
        // Không có token → có thể bị lỗi OAuth → về trang login
        navigate("/login?error=oauth2_failed", { replace: true });
        return;
      }

      localStorage.setItem("token", token);

      try {
        const res = await getUserInfo();
        const user = res.data.data;
        localStorage.setItem("user", JSON.stringify(user));

        // Redirect về đúng dashboard theo role (giống luồng login thường)
        const role = user?.roleEnum?.toLowerCase();
        if (role) {
          navigate(`/${role}/dashboard`, { replace: true });
        } else {
          navigate("/", { replace: true });
        }
      } catch (error) {
        console.error("Lỗi lấy thông tin người dùng:", error);
        // Token không hợp lệ → xóa và về login
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login?error=oauth2_failed", { replace: true });
      }
    };

    handleOAuthRedirect();
  }, [navigate]);

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <p>Đang đăng nhập bằng Google...</p>
    </div>
  );
};

export default OAuth2RedirectHandler;
