

export const mpesaConfig = {
  baseURL: "https://sandbox.safaricom.co.ke",
  consumerKey: process.env.MPESA_CONSUMER_KEY!,
  consumerSecret: process.env.MPESA_CONSUMER_SECRET!,
  shortcode: process.env.MPESA_SHORTCODE!,
  passkey: process.env.MPESA_PASSKEY!,
  tillNumber: process.env.MPESA_TILL!,
  callbackURL: process.env.MPESA_CALLBACK_URL!,
};

// Timestamp generator
export const getTimestamp = (): string => {
  const pad = (num: number) => (num < 10 ? "0" + num : num);
  const now = new Date();
  return `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(
    now.getDate()
  )}${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
};

// Get Access Token
export const getMpesaToken = async (): Promise<string> => {
  const auth = Buffer.from(
    `${mpesaConfig.consumerKey}:${mpesaConfig.consumerSecret}`
  ).toString("base64");

  const response = await fetch(
    `${mpesaConfig.baseURL}/oauth/v1/generate?grant_type=client_credentials`,
    {
      method: "GET",
      headers: { Authorization: `Basic ${auth}` },
    }
  );

  if (!response.ok) {
    throw new Error(`Error fetching token: ${await response.text()}`);
  }

  const data = await response.json();
  return data.access_token;
};
