import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUserInfo } from "../../services/userServices";

const OAuth2RedirectHandler = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleOAuthRedirect = async () => {
      const queryParams = new URLSearchParams(window.location.search);
      const token = queryParams.get("token");

      console.log("OAuth2 Redirect - Token:", token ? "Token received" : "No token");

      if (!token) {
        console.error("OAuth2 Redirect - No token in URL");
        navigate("/login?error=oauth2_failed", { replace: true });
        return;
      }

      localStorage.setItem("token", token);
      console.log("OAuth2 Redirect - Token saved to localStorage");

      try {
        console.log("OAuth2 Redirect - Calling getUserInfo API...");
        const res = await getUserInfo();
        console.log("OAuth2 Redirect - API Response:", res);
        
        const user = res.data.data;
        console.log("OAuth2 Redirect - User data:", user);
        
        localStorage.setItem("user", JSON.stringify(user));

        // Redirect về đúng dashboard theo role (giống luồng login thường)
        const role = user?.roleEnum?.toLowerCase();
        console.log("OAuth2 Redirect - User role:", role);
        
        if (role) {
          navigate(`/${role}/dashboard`, { replace: true });
        } else {
          navigate("/", { replace: true });
        }
      } catch (error) {
        console.error("OAuth2 Redirect - Error details:", error);
        console.error("OAuth2 Redirect - Error response:", error.response);
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
