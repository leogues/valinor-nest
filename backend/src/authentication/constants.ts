import * as dotenv from 'dotenv';
dotenv.config();

export const frontendUrl = process.env.FRONTEND_URL;

export enum Providers {
  google = 'google',
  github = 'github',
}

export const jwtConstants = {
  secret: process.env.JWT_SECRET,
};
