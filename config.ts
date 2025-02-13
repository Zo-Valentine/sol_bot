import { Connection, PublicKey } from '@solana/web3.js';
import dotenv from 'dotenv';

// Load environment variables from the .env file
dotenv.config();

// Default RPC endpoint and WebSocket endpoint (using the environment variables)
const RPC_ENDPOINT = process.env.RPC_ENDPOINT ?? 'https://mainnet.helius-rpc.com/?api-key=8594eae7-4279-4375-aaea-bf4de506dee1';
const RPC_WEBSOCKET_ENDPOINT = process.env.RPC_WEBSOCKET_ENDPOINT ?? 'wss://mainnet.helius-rpc.com/?api-key=8594eae7-4279-4375-aaea-bf4de506dee1';

// Establish the Solana connection
export const solanaConnection = new Connection(RPC_ENDPOINT, {
  wsEndpoint: RPC_WEBSOCKET_ENDPOINT,
});

// The PublicKey for rayFee (trusted constant)
export const rayFee = new PublicKey('7YttLkHDoNj9wyDur5pM1ejNaAvT9X4eqaYcHQqtj2G5');
