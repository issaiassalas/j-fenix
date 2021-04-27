module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  admin: {
    auth: {
      secret: env('ADMIN_JWT_SECRET', 'aead4fdc1760332f22390df9c76ab08b'),
    },
  },
  cron: {
    enabled: env.bool('CRON_ENABLED', true),
  }
});
