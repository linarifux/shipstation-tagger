import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  shipStation: {
    // V2 Base URL
    baseUrl: process.env.SS_URL || 'https://api.shipstation.com/v2', 
    // V2 only requires the API Key
    apiKey: process.env.SS_API_KEY, 
  },
};