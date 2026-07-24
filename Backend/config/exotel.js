import dotenv from 'dotenv';
dotenv.config();

export const config = {
  apiKey: process.env.EXOTEL_API_KEY || 'sh_token_live_2563_dialer_representative_sec',
  apiToken: process.env.EXOTEL_API_TOKEN || 'mock_exotel_api_token_val_12345',
  accountSid: process.env.EXOTEL_ACCOUNT_SID || 'mock_exotel_account_sid_9999',
  virtualNumber: process.env.EXOTEL_VIRTUAL_NUMBER || '08047104970',
  subdomain: process.env.EXOTEL_SUBDOMAIN || 'api.exotel.com'
};

export const isConfigured = !!(
  config.apiKey && 
  config.apiToken && 
  config.accountSid && 
  config.virtualNumber && 
  !config.apiKey.includes('your_') &&
  !config.apiKey.includes('mock_') &&
  !config.apiToken.includes('mock_') &&
  !config.accountSid.includes('mock_')
);

if (!isConfigured) {
  console.warn('\n⚠️  [Exotel Config Warning]: Exotel API credentials are not fully set in the .env file. Outbound call features will operate in MOCK/SANDBOX mode.\n');
}

export const getBaseUrl = () => {
  return `https://${config.subdomain}/v1/Accounts/${config.accountSid}`;
};

export const getAuthHeaders = () => {
  const token = Buffer.from(`${config.apiKey}:${config.apiToken}`).toString('base64');
  return {
    'Authorization': `Basic ${token}`,
    'Content-Type': 'application/x-www-form-urlencoded'
  };
};
