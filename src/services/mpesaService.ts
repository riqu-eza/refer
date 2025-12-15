import { getMpesaToken, getTimestamp, mpesaConfig } from "../lib/mpesa";

export const initiateStkPush = async (phoneNumber: string, amount: number) => {
  const token = await getMpesaToken();
  const timestamp = getTimestamp();
  const password = Buffer.from(
    `${mpesaConfig.shortcode}${mpesaConfig.passkey}${timestamp}`
  ).toString("base64");

  const formattedPhone = phoneNumber.startsWith("254")
    ? phoneNumber
    : `254${phoneNumber.substring(1)}`;

  const paymentData = {
    BusinessShortCode: mpesaConfig.shortcode,
    Password: password,
    Timestamp: timestamp,
    TransactionType: "CustomerBuyGoodsOnline",
    Amount: amount.toString(),
    PartyA: formattedPhone,
    PartyB: mpesaConfig.tillNumber,
    PhoneNumber: formattedPhone,
    CallBackURL: mpesaConfig.callbackURL,
    AccountReference: "airbnb",
    TransactionDesc: "Hotel booking payment",
  };
  console.log("payment data", paymentData);
  const response = await fetch(
    `${mpesaConfig.baseURL}/mpesa/stkpush/v1/processrequest`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paymentData),
    }
  );

  const responseData = await response.json();
  console.log("response data", responseData);
  return responseData;
};
