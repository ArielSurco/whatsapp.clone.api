import dotenv from 'dotenv'

dotenv.config()

export const ENV = {
  PORT: process.env.PORT ?? '',
  NODE_ENV: process.env.NODE_ENV ?? '',
} as const
