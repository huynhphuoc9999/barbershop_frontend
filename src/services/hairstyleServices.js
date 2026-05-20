import instance from "../utils/axiosInstance";

export const tryHairstyle = (userImage, hairstyleUrl) => {
  const formData = new FormData();
  formData.append("userImage", userImage);
  formData.append("hairstyleUrl", hairstyleUrl);

  return instance.post("/customer/hairstyle/try-on", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
