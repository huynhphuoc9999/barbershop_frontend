import axios from "axios";

const instance = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    "https://barbershop-backend-yn3c.onrender.com/api", // use env variable for flexibility
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Gắn token vào mọi request qua interceptor
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // hoặc authToken nếu bạn lưu cookie token ở đó
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default instance;
