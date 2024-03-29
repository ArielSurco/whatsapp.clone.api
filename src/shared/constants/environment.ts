import dotenv from 'dotenv'

dotenv.config()

export const ENV = {
  PORT: process.env.PORT ?? '',
  NODE_ENV: process.env.NODE_ENV ?? '',
  MONGO_URI: process.env.MONGO_URI ?? '',
  JWT_SECRET: process.env.JWT_SECRET ?? '',
} as const
