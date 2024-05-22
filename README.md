# NFT Drop DApp

Welcome to the NFT Drop DApp! This project is a decentralized application (DApp) for minting NFTs (Non-Fungible Tokens) using the Ethereum blockchain. The smart contract is deployed on the Sepolia test network, and the front end is deployed on Vercel.

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Getting Started](#getting-started)
- [Deployment](#deployment)
- [Usage](#usage)

## Project Overview

The NFT Drop DApp allows users to mint their own NFTs by interacting with a smart contract deployed on the Ethereum Sepolia test network. The application is built with React and utilizes Hardhat and the ethers.js library to interact with the Ethereum blockchain.

## Features

- Mint NFTs directly from the DApp
- Whitelisted users can mint NFTs
- Owner can pause and resume minting
- Display all NFTs owned by the user
- Responsive design with Tailwind CSS

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn
- MetaMask extension for your web browser

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/nft-drop-dapp.git
   cd nft-drop-dapp
   ```

2. Install the dependencies

   ```bash
   npm install
   # or
   yarn install
   ```

3. Add your environment variables

   ```bash
   npx hardhat vars set ALCHEMY_API_KEY
   npx hardhat vars set SEPOLIA_PRIVATE_KEY
   ```

### Running the application

1. Start the development server

   ```bash
   npm run start
   ```

2. Open your web browser and visit **\`http://localhost:3000\`**

### Deployment

The application is deployed on Vercel and can be accessed at the following URL:

https://nft-drop-cyan.vercel.app/

The smart contract is deployed on the Sepolia test network and can be viewed on Etherscan:

[Smart Contract on Etherscan](https://sepolia.etherscan.io/address/0x559b4cd01dd8a546b6c9731d2d2a1ceb1de79555)

### Usage

1. Connect your MetaMask wallet to the Sepolia test network.

2. Ensure you have Sepolia ETH in your wallet for transaction fees.

3. Visit the deployed application at https://nft-drop-cyan.vercel.app/.

4. If you are whitelisted, you can mint NFTs by specifying the number of NFTs and clicking the "Mint" button.

5. View your minted NFTs displayed under the main preview image.
