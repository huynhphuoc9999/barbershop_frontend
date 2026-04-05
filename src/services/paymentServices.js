import instance from "../utils/axiosInstance";

export const executePayment = (responseCode, userId, amount, txnRef) => {
  return instance.get(
    `customer/payments/execute/vnpay?vnp_ResponseCode=${responseCode}&userId=${userId}&vnp_Amount=${amount}&vnp_TxnRef=${txnRef}`,
  );
};

export const createPayment = (data) => {
  return instance.post("customer/payments/create", data);
};

export const addPayment = (data) => {
  return instance.post("customer/payments/add", data);
};
