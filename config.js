module.exports = {
    PORT: process.env.PORT,
    DB: {
      PGHOST: process.env.DATABASE_HOSTNAME,
      PGUSER: process.env.DATABASE_USER_NAME,
      PGDATABASE: process.env.DATABASE_NAME,
      PGPASSWORD: process.env.DATABASE_PASSWORD,
      PGPORT: process.env.DATABASE_PORT
    },
    SESSION_SECRET: process.env.SESSION_SECRET
  }