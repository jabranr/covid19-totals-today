module.exports = {
  env: {
    NODE_ENV: process.env.NODE_ENV || 'development',
    APP_HOSTNAME: process.env.APP_HOSTNAME,
    API_HOSTNAME: process.env.API_HOSTNAME,
    GTM_ID: process.env.GTM_ID
  }
};
