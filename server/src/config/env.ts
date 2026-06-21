import dotenv from "dotenv";

dotenv.config({
  path: "../../.env",
});

export const env = {
  PORT: process.env.PORT || "5000",
  JWT_SECRET: process.env.JWT_SECRET || "super-secret",
};
