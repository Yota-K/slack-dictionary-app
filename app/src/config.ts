import dotenv from 'dotenv';

dotenv.config();

export const ENV = {
  SLACK_SIGNING_SECRET: process.env.SLACK_SIGNING_SECRET,
  SLACK_BOT_TOKEN: process.env.SLACK_BOT_TOKEN,
} as const;
