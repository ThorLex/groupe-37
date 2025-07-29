const momo = require("mtn-momo");

const collectionConfig = {
  baseUrl: process.env.MOMO_BASE_URL || "https://sandbox.momodeveloper.mtn.com",
  primaryKey: process.env.MOMO_PRIMARY_KEY,
  secondaryKey: process.env.MOMO_SECONDARY_KEY,
  userId: process.env.MOMO_USER_ID,
  apiSecret: process.env.MOMO_API_SECRET,
  callbackHost: process.env.MOMO_CALLBACK_HOST,
  environment: process.env.MOMO_ENVIRONMENT || "sandbox",
};

// Create collection instance using the correct method
const momoCollection = momo.create(collectionConfig);

let accessToken = null;
let tokenExpiry = null;

const getAccessToken = async () => {
  if (accessToken && tokenExpiry && new Date() < tokenExpiry) {
    return accessToken;
  }

  try {
    const response = await momoCollection.getToken();
    accessToken = response.access_token;
    // Set expiry with a small buffer (subtract 60 seconds for safety)
    tokenExpiry = new Date(
      new Date().getTime() + (response.expires_in - 60) * 1000
    );
    console.log("MoMo Access Token obtained successfully.");
    return accessToken;
  } catch (error) {
    console.error("Error obtaining MoMo Access Token:", error.message || error);
    throw error;
  }
};

// Optional: Function to request payment
const requestPayment = async (amount, currency, externalId, payer) => {
  try {
    const token = await getAccessToken();

    const paymentRequest = {
      amount: amount.toString(),
      currency: currency,
      externalId: externalId,
      payer: {
        partyIdType: "MSISDN",
        partyId: payer,
      },
      payerMessage: "Payment request",
      payeeNote: "Payment for services",
    };

    const response = await momoCollection.requestToPay(paymentRequest);
    console.log("Payment request initiated:", response);
    return response;
  } catch (error) {
    console.error("Error requesting payment:", error.message || error);
    throw error;
  }
};

// Optional: Function to check payment status
const getPaymentStatus = async (referenceId) => {
  try {
    const token = await getAccessToken();
    const status = await momoCollection.getTransaction(referenceId);
    console.log("Payment status:", status);
    return status;
  } catch (error) {
    console.error("Error getting payment status:", error.message || error);
    throw error;
  }
};

module.exports = {
  momoCollection,
  getAccessToken,
  requestPayment,
  getPaymentStatus,
};
