import {StreamChat} from "stream-chat";
import dotenv from "dotenv/config";

const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;

if (!apiKey || !apiSecret) {
    console.error("Stream API key or secret not found");
    process.exit(1);
}

const streamClient = StreamChat.getInstance(apiKey, apiSecret);

export const upsertStreamUser = async (userData) => {
    try {
      await streamClient.upsertUsers([userData]);
      return userData;
    } catch (error) {
      console.error("Error upserting Stream user:", error);
    }
  };
  
  //TODO: generate stream token
  export const generateStreamToken = (userId) => {
    try {
        const token = streamClient.createToken(userId);
        console.log("Generated Stream token for user:", userId);
        return token;
    } catch (error) {
        console.error("Error generating Stream token:", error);
        throw error;
    }
};