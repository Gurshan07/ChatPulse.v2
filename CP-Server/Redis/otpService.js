import { createClient } from 'redis';
import dotenv from "dotenv";

dotenv.config({
    path: "./.env",
  });


const redis_password=process.env.REDIS_PASSWORD
const redis_host=process.env.REDIS_HOST
const redis_port=process.env.REDIS_PORT

const client = createClient({
    password: redis_password,
    socket: {
        host: redis_host,
        port: redis_port
    }
});

// Connect the client
client.connect().then(() => {
    console.log('Redis client connected successfully');
}).catch((err) => {
    console.error('Redis connection error:', err);
});

// Log any Redis client errors
client.on('error', (err) => {
    console.error('Redis client error:', err);
});

// Gracefully handle Redis client closure on app shutdown
process.on('SIGINT', () => {
    client.quit().then(() => {
        console.log('Redis client closed successfully');
        process.exit(0);
    }).catch((err) => {
        console.error('Error closing Redis client:', err);
        process.exit(1);
    });
});

export default client;

export async function generateAndStoreOTP(userId) {
    try {
        if (!client.isOpen) {
            await client.connect();
        }

        const otp = Math.floor(36 ** 5 + Math.random() * (36 ** 5)).toString(36).slice(-5).toUpperCase();
        const ttl = 300;

        await client.setEx(`otp:${userId}`, ttl, otp);

        return otp;
    }
    catch (error) {
        console.error("Error storing OTP in Redis:", error);
        throw error;  
    }
}

export async function verifyOTP(userId, userOTP, callback) {

    if (!client.isOpen) {
        await client.connect().catch(err => {
            console.error("Failed to connect to Redis:", err);
            return callback({ success: false, message: 'Error connecting to Redis' });
        });
        console.log("Connected to Redis.");
    }

    const storedOTP = await client.get(`otp:${userId}`);
console.log("userOTP",userOTP);
console.log("storedOTP",storedOTP);

    if (!storedOTP) {
        console.log("No OTP found for this user.");
        return callback({ success: false, message: 'No OTP found' });
    }

    if (storedOTP === userOTP) {
        console.log("OTP verified successfully!");

         client.del(`otp:${userId}`);

        return callback({ success: true, });

    } 
    else {
        console.log("OTP verification failed.");
        return callback({ success: false, message: 'Invalid OTP' });
    }
}












