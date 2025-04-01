export const DEBUG: boolean = process.env.DEBUG != undefined

import dotenv from "dotenv";

let env: any = {};

try {
  // Load environment variables
  if (DEBUG) {
    const result = dotenv.config();
    if (result.error) throw result.error;
  }

  // Retrieve all variables
  env = {
    ...env,
    PORT: Number(process.env.PORT) || 8080,
    ENV: DEBUG ? "development" : "production",
    ATLAS: process.env.ATLAS as string,
    SECRET: process.env.SECRET as string,
    JWT_SECRET: process.env.JWT_SECRET as string,
  }

  for (const key in env) {
    if (!env[key]) throw Error(`Must have ${key} in environment!`)
  }
} catch (error) {
  console.error("[error] Failed to load environment variables. Error:", (error as Error).message);
  process.exit(1);
}

export default env;