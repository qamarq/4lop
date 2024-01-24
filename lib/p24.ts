import { P24 } from "@ingameltd/node-przelewy24";

const p24ClientSingleton = () => {
    const merchantId = 1
    const posId = 1
    const apiKey = ""
    const crcKey = ""
    const options = {
        sandbox: true,
    }
    return new P24(
        merchantId, 
        posId, 
        apiKey,
        crcKey,
        options
    );
}

type P24ClientSingleton = ReturnType<typeof p24ClientSingleton>

const globalForP24 = globalThis as unknown as {
    p24: P24ClientSingleton | undefined
}

export const p24 = globalForP24.p24 ?? p24ClientSingleton()

if (process.env.NODE_ENV !== 'production') globalForP24.p24 = p24