/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import 'dotenv/config';

import * as joi from 'joi';

interface EnvVars {
  PORT: number;
  HOST: string;
  NODE_ENV: string;

  DB_URL: string;
  API_KEY: string;
  API_SECRET: string;
  API_NAME: string;
}

const envsSchema = joi
  .object<EnvVars>({
    PORT: joi.number().required(),
    HOST: joi.string().required(),
    NODE_ENV: joi.string().required(),
    DB_URL: joi.string().required(),
    API_KEY: joi.string().required(),
    API_SECRET: joi.string().required(),
    API_NAME: joi.string().required(),
  })
  .unknown(true);

const { error, value } = envsSchema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const envVars: EnvVars = value;

export const envs = {
  PORT: envVars.PORT,
  HOST: envVars.HOST,
  NODE_ENV: envVars.NODE_ENV,

  DB_URL: envVars.DB_URL,
  API_KEY: envVars.API_KEY,
  API_SECRET: envVars.API_SECRET,
  API_NAME: envVars.API_NAME,
};
