import instance from "../utils/axiosInstance";

export const executePayment = (queryString) => {
  return instance.get(`/customer/payments/execute/vnpay?${queryString}`);
};

export const createPayment = (data) => {
  return instance.post("customer/payments/create", data);
};

export const addPayment = (data) => {
  return instance.post("customer/payments/add", data);
};
