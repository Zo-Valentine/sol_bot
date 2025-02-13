Here's the updated README with instructions to run the `setup.py` script first before starting the project. 

---

# Solana Rug Checker 🚀

Welcome to **Solana Rug Checker** – an exciting open-source project built with passion by **Sphere_ai**, **Jeffery Nibo**, and **Zo Valentine**. We've poured timeless effort into creating this TypeScript-based tool that keeps a watchful eye on the Solana blockchain, specifically within the Raydium decentralized exchange ecosystem.

## What is Solana Rug Checker?

**Solana Rug Checker** is your go-to blockchain watchdog! It monitors new token creation events on Solana and evaluates the rug pull risk of these tokens using [rugcheck.xyz](https://rugcheck.xyz). By listening to blockchain logs linked to Raydium liquidity pools, it captures crucial details such as creator wallet addresses, safety scores, and transaction signatures. This real-time detection and risk analysis help you stay one step ahead of potentially fraudulent tokens.

## Perfect for Sniper Bot Development

Are you interested in building a **Sniper Bot**? With Solana Rug Checker, you can:
- **Monitor New Tokens:** Keep track of freshly minted tokens as soon as they launch.
- **Assess Risk Quickly:** Receive immediate insights into each token's safety.
- **Make Informed Decisions:** Act confidently on early token listings with our risk evaluation.

This blend of real-time monitoring and risk assessment is the perfect recipe for safer, smarter Sniper Bot strategies.

## Key Features

- **Real-Time Token Monitoring:** Stay updated on new token creation events on Solana.
- **Rug Pull Risk Analysis:** Leverage [rugcheck.xyz](https://rugcheck.xyz) to gauge token safety.
- **Comprehensive Data Storage:** Record essential details like:
  - Creator Wallet Addresses
  - Safety Scores
  - Transaction Signatures
- **Seamless Blockchain Integration:** Built using `@solana/web3.js` for smooth interactions with the Solana network.
- **Robust Error Handling & Logging:** Ensuring a reliable and seamless experience.

## Getting Started

### Prerequisites

Before you begin, make sure you have:
- [Python 3.8+](https://www.python.org/downloads/) installed.
- [Node.js](https://nodejs.org/) (v14.x or higher is recommended).
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/) for package management.

### Setup Instructions

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/FriedDev/solana-rug-checker.git
   cd solana-rug-checker
   ```

2. **Run the Setup Script:**  
   Before starting the project, run the `setup.py` script to configure your environment.
   ```bash
   python setup.py
   ```
   This script will:
   - Check your system configurations.
   - Create a virtual environment (`ari_bot.venv`).
   - Install required dependencies.

3. **Activate the Virtual Environment:**  
   - On **Windows**:
     ```bash
     .\ari_bot.venv\Scripts\activate
     ```
   - On **Mac/Linux**:
     ```bash
     source ari_bot.venv/bin/activate
     ```

4. **Install JavaScript Dependencies:**
   ```bash
   npm install
   npm install dotenv
   ```

5. **Configure Your RPC Endpoint:**
   Create a `.env` file in the project root and add your RPC endpoints:
   ```env
   # Mainnet RPC Endpoint (recommended)
   RPC_ENDPOINT=https://mainnet.helius-rpc.com/?api-key=your-api-key
   RPC_WEBSOCKET_ENDPOINT=wss://mainnet.helius-rpc.com/?api-key=your-api-key
   ```
   > **💡 Pro Tip:**  
   > - Secure an API key from Helius or another trusted Solana RPC provider for optimal performance.
   > - Fallback RPC endpoints are available by default.

6. **Run the Project:**
   ```bash
   npx tsx src/index.ts
   ```

## Troubleshooting Tips

- **Installing tsx Globally (Optional):**
  ```bash
  npm install -g tsx
  ```
- **Handling Dependency Conflicts:**
  ```bash
  npm cache clean --force
  npm install
  ```
- Ensure you're using the latest version of Python and Node.js.
- Double-check your Solana RPC endpoint configuration.
- Verify that `tsx` is properly installed and configured.

## Contributing

We warmly welcome contributions! Whether you’re fixing a bug, suggesting a new feature, or simply improving the docs, feel free to open a pull request. Together, we can make Solana Rug Checker even better.

## License

This project is open-source – you’re free to use, modify, and share it. For more details, please refer to the LICENSE file.

## Disclaimer

⚠️ **Use Responsibly:**  
This tool is designed for educational and development purposes. Always ensure you comply with local regulations and the terms of service of the platforms you use.

---

We hope you enjoy using Solana Rug Checker as much as we enjoyed creating it. Happy coding, and welcome to our community of blockchain enthusiasts!

*Crafted with love by the Sphere_ai team: Zo Valentine - AI Engineer, Jeffery Nibo - Forex Trader & Database Administrator*

---

### Is the Project Ready for GitHub?

Yes! The project is now **download-ready** for GitHub users. By including the `setup.py` script and clearly instructing users to run it first, we've streamlined the setup process. Anyone can now **clone, set up, and start monitoring Solana tokens** with minimal friction. 🚀

Would you like any further refinements or additional features added?