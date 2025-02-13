/**
 * ==============================================
 *      SOLANA RUG CHECKER - CORE MONITORING SCRIPT
 * ==============================================
 * 
 * Welcome to the heart of Solana Rug Checker! This script is designed to keep an eagle eye on the Solana blockchain,
 * specifically tracking new token creation events within Raydium liquidity pools. Crafted with passion by Sphere_ai,
 * Jeffery Nibo, and Zo Valentine, this tool ensures you stay one step ahead in the fast-paced world of Solana tokens.
 *
 * What does this code do?
 * -----------------------
 * 1. **Monitors New Token Events:**
 *    - Leverages the Solana Web3 API to listen for specific blockchain log events.
 *    - Uses a dedicated PublicKey (rayFee) to filter logs, ensuring only relevant token creation events are captured.
 *
 * 2. **Parses Transactions:**
 *    - Once a new token event is detected, it parses the corresponding transaction using `getParsedTransaction`.
 *    - Extracts crucial details such as the creator's wallet address and token balances for both base and quote tokens.
 *
 * 3. **Rug Risk Assessment via RugCheck API:**
 *    - Automatically sends the token's mint address to the RugCheck API to retrieve a comprehensive rug risk report.
 *    - Logs and attaches this safety evaluation to the token data for informed decision-making.
 *
 * 4. **Data Persistence:**
 *    - Stores key data (including transaction signature, creator information, token balances, and rug risk result)
 *      in a JSON file (`new_solana_tokens.json`) located in the `data` folder.
 *
 * 5. **Robust Error Handling:**
 *    - Employs try-catch blocks to gracefully handle any errors during transaction parsing or API calls.
 *    - Logs detailed error messages to the console using colorful chalk outputs and saves them to `errorNewTokensLogs.txt`
 *      for further analysis.
 *
 * With this script, you’re not just monitoring the blockchain—you’re gaining a strategic advantage by detecting potential risks early,
 * making it an essential tool for developers interested in building reliable Sniper Bots or enhancing their Solana projects.
 *
 * Let’s dive in and unleash the power of proactive blockchain monitoring!
 */

import { rayFee, solanaConnection } from './config';
import { storeData } from './utils';
import fs from 'fs';
import chalk from 'chalk';
import path from 'path';
import axios from 'axios';
import { Connection } from '@solana/web3.js';

const dataPath = path.join(__dirname, 'data', 'new_solana_tokens.json');

/**
 * Throttling configuration: Allow one RugCheck API call every 2000 milliseconds (2 seconds)
 */
const THROTTLE_PERIOD = 2000; // in milliseconds
let lastCheckTime = 0;

/**
 * A throttled version of the checkRug function.
 * If a call is attempted before the throttle period has elapsed,
 * it skips the API call to alleviate request pressure.
 */
async function throttledCheckRug(mint: string) {
  const now = Date.now();
  if (now - lastCheckTime < THROTTLE_PERIOD) {
    console.log(chalk.yellow(`Skipping RugCheck for ${mint} due to throttling`));
    return null;
  }
  lastCheckTime = now;
  return checkRug(mint);
}

// Function to check rug risk using RugCheck API
async function checkRug(mint: string) {
  try {
    console.log(`Checking rug risk for token with mint: ${mint}`);

    // Call RugCheck API with the mint address
    const response = await axios.get(`https://api.rugcheck.xyz/v1/tokens/${mint}/report/summary`);
    
    // Return the RugCheck report if it is valid
    return response.data;
  } catch (error) {
    // Enhanced error logging for better understanding of API failure
    if (error.response) {
      console.error(`Error checking token on RugCheck: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
    } else {
      console.error(`Error checking token on RugCheck: ${error.message}`);
    }
    return null; // Return null if RugCheck fails
  }
}

// Function to monitor new tokens and check for rug risk
async function monitorNewTokens(connection: Connection) {
  console.log(chalk.green(`Monitoring new Solana tokens...`));

  try {
    connection.onLogs(
      rayFee,  // This is the PublicKey we're using to listen for logs
      async ({ logs, err, signature }) => {
        try {
          if (err) {
            console.error(`Connection error: ${err}`);
            return;
          }

          console.log(chalk.bgGreen(`Found new token signature: ${signature}`));

          let signer = '';
          let baseAddress = '';
          let baseDecimals = 0;
          let baseLpAmount = 0;
          let quoteAddress = '';
          let quoteDecimals = 0;
          let quoteLpAmount = 0;

          // You need to use a proper RPC provider for getParsedTransaction to work.
          const parsedTransaction = await connection.getParsedTransaction(
            signature,
            {
              maxSupportedTransactionVersion: 0,
              commitment: 'confirmed',
            }
          );

          if (parsedTransaction && parsedTransaction?.meta.err == null) {
            console.log(`Successfully parsed transaction`);

            signer = parsedTransaction?.transaction.message.accountKeys[0].pubkey.toString();
            console.log(`Creator: ${signer}`);

            const postTokenBalances = parsedTransaction?.meta.postTokenBalances;

            const baseInfo = postTokenBalances?.find(
              (balance) =>
                balance.owner ===
                  '5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1' &&
                balance.mint !== 'So11111111111111111111111111111111111111112'
            );

            if (baseInfo) {
              baseAddress = baseInfo.mint;
              baseDecimals = baseInfo.uiTokenAmount.decimals;
              baseLpAmount = baseInfo.uiTokenAmount.uiAmount;
            }

            const quoteInfo = postTokenBalances.find(
              (balance) =>
                balance.owner ==
                  '5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1' &&
                balance.mint == 'So11111111111111111111111111111111111111112'
            );

            if (quoteInfo) {
              quoteAddress = quoteInfo.mint;
              quoteDecimals = quoteInfo.uiTokenAmount.decimals;
              quoteLpAmount = quoteInfo.uiTokenAmount.uiAmount;
            }
          }

          // Create a new token data object
          const newTokenData = {
            lpSignature: signature,
            creator: signer,
            timestamp: new Date().toISOString(),
            baseInfo: {
              baseAddress,
              baseDecimals,
              baseLpAmount,
            },
            quoteInfo: {
              quoteAddress: quoteAddress,
              quoteDecimals: quoteDecimals,
              quoteLpAmount: quoteLpAmount,
            },
            logs: logs,
            rugCheckResult: null,  // Initially set to null until we get the RugCheck result
          };

          // Store new tokens data in the data folder
          await storeData(dataPath, newTokenData);

          // Call the throttled version of RugCheck API with the baseAddress (mint address) for rug risk check
          const rugCheckResult = await throttledCheckRug(baseAddress);
          
          if (rugCheckResult) {
            console.log(chalk.green(`RugCheck result for ${baseAddress}:`, JSON.stringify(rugCheckResult, null, 2)));  // Stringify the result
            newTokenData.rugCheckResult = rugCheckResult;  // Update the new token data with RugCheck result
            await storeData(dataPath, newTokenData); // Store updated token data with RugCheck result
          } else {
            console.log(chalk.yellow(`No RugCheck result for ${baseAddress}`));
          }
          
        } catch (error) {
          const errorMessage = `Error occurred in new Solana token log callback function: ${JSON.stringify(error, null, 2)}`;
          console.log(chalk.red(errorMessage));

          // Save error logs to a separate file
          fs.appendFile('errorNewTokensLogs.txt', `${errorMessage}\n`, function (err) {
            if (err) console.log('Error writing error logs', err);
          });
        }
      },
      'confirmed'
    );
  } catch (error) {
    const errorMessage = `Error occurred in new Solana LP monitor: ${JSON.stringify(error, null, 2)}`;
    console.log(chalk.red(errorMessage));

    // Save error logs to a separate file
    fs.appendFile('errorNewTokensLogs.txt', `${errorMessage}\n`, function (err) {
      if (err) console.log('Error writing error logs', err);
    });
  }
}

// Start monitoring new tokens
monitorNewTokens(solanaConnection);
