import 'dotenv/config';

export default 
  {
    schema: './src/models/*.js',
    out: './drizzle/generated',
    dialect: 'postgresql',
    dbCredentials: {
      url: process.env.DATABASE_URL,
    },
  }
