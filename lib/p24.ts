import { P24 } from "@ingameltd/node-przelewy24";

export const p24 = new P24(
    parseInt(process.env.P24_MERCHANT_ID || "1"), 
    parseInt(process.env.P24_POS_ID || "1"), 
    process.env.P24_API_KEY || "",
    process.env.P24_CRC_KEY || "", 
    { 
        sandbox: process.env.P24_SANDBOX_MODE === "true" ? true : false // enable or disable sandbox
    }
);