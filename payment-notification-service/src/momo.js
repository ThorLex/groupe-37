const { Collection, Consumer } = require('mtn-momo');

const collectionConfig = {
  baseUrl: process.env.MOMO_BASE_URL || 'https://sandbox.momodeveloper.mtn.com',
  primaryKey: process.env.MOMO_PRIMARY_KEY,
  secondaryKey: process.env.MOMO_SECONDARY_KEY,
  userId: process.env.MOMO_USER_ID,
  apiSecret: process.env.MOMO_API_SECRET,
  callbackHost: process.env.MOMO_CALLBACK_HOST,
  environment: process.env.MOMO_ENVIRONMENT || 'sandbox',
};

const momoCollection = new Collection({
  config: collectionConfig,
});

let accessToken = null;
let tokenExpiry = null;

const getAccessToken = async () => {
  if (accessToken && tokenExpiry && new Date() < tokenExpiry) {
    return accessToken;
  }
  try {
    const response = await momoCollection.getToken();
    accessToken = response.access_token;
    tokenExpiry = new Date(new Date().getTime() + response.expires_in * 1000);
    console.log('Momo Access Token obtained successfully.');
    return accessToken;
  } catch (error) {
    console.error('Error obtaining Momo Access Token:', error);
    throw error;
  }
};

module.exports = { momoCollection, getAccessToken };