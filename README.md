# Environmental Monitoring System

This repository contains the full implementation of an **Environmental Monitoring System** that gathers real-time environmental data (temperature, humidity, and GPS location) using an ESP32 microcontroller and stores it on the Ethereum blockchain. It also includes a React-based front-end application to visualize the collected data and its location on a Mapbox-powered map.

---

## Table of Contents
1. [Project Overview](#project-overview)
2. [Features](#features)
3. [ESP32 Code](#esp32-code)
4. [React Frontend Code](#react-frontend-code)
5. [Smart Contract Code](#smart-contract-code)
6. [Deployment Code](#deployment-code)
7. [Metamask Custom Network Setup](#metamask-custom-network-setup)
8. [Generating `0xYOUR_FUNCTION_SIGNATURE`](#generating-0xyour_function_signature)
9. [Setup Instructions](#setup-instructions)
10. [Contributing](#contributing)
11. [License](#license)

---

## Project Overview

This system leverages an ESP32 to collect environmental data from:
- A **DHT22 sensor** for temperature and humidity.
- A **GPS module** for geolocation.

The collected data is sent to an Ethereum-based blockchain (via an Alchemy RPC endpoint) using a smart contract. A React-based front-end retrieves and displays this data in a table and on a Mapbox map.

---

## Features

- **ESP32 Integration**:
  - Collect temperature, humidity, and GPS data.
  - Send data to an Ethereum smart contract.
  
- **Blockchain**:
  - Securely store environmental data in a decentralized manner using a custom smart contract.
  - Retrieve data via Ethereum RPC endpoints.

- **React Frontend**:
  - Display collected data in a user-friendly table.
  - Visualize GPS coordinates on a Mapbox map.

---

## ESP32 Code

The ESP32 code initializes the DHT22 sensor and GPS module, collects data, and sends it to the Ethereum blockchain using Alchemy's RPC endpoint. **Key features include:**
- Reading environmental data.
- Preparing ABI-encoded data for the blockchain.
- Sending HTTP POST requests to interact with the blockchain.

### Key Function: `generateABIEncodedData`

This function creates the ABI-encoded data required to call the `addData` function of the smart contract.

---

## React Frontend Code

The React app connects to the Ethereum blockchain via Metamask and interacts with the deployed smart contract. It:
1. **Fetches data** from the smart contract.
2. **Displays the data** in a table.
3. **Visualizes the GPS data** on a Mapbox-powered map.

---

## Smart Contract Code

The smart contract defines a `StoreData` contract with:
- A `Data` struct to store humidity, temperature, GPS location, and timestamps.
- Functions to add and retrieve data from the blockchain.

---

## Deployment Code

The deployment script, written in Hardhat, deploys the `StoreData` contract to the Ethereum blockchain.

---

## Metamask Custom Network Setup

To test the system locally with a custom Ethereum network, you need to:
1. **Start a Local Node**:
   - Use tools like [Hardhat Network](https://hardhat.org/) to start a local Ethereum node:
     ```bash
     npx hardhat node
     ```
   - By default, this starts a JSON-RPC server at `http://127.0.0.1:8545`.

2. **Add the Custom Network to Metamask**:
   - Open Metamask and go to **Settings > Networks > Add Network**.
   - Fill in the following details:
     - **Network Name**: Localhost 8545
     - **RPC URL**: `http://127.0.0.1:8545`
     - **Chain ID**: `1337` (default for Hardhat)
     - **Currency Symbol**: ETH
   - Save the network.

3. **Deploy the Contract to the Local Network**:
   - Run the Hardhat deployment script:
     ```bash
     npx hardhat run scripts/deploy.js --network localhost
     ```

---

## Generating `0xYOUR_FUNCTION_SIGNATURE`

To encode the function signature in the ESP32 code, use the following steps:
1. **Obtain the Function Signature**:
   - For the `addData` function, the signature is:
     ```
     addData(uint256,uint256,string)
     ```
   - Hash the signature using [Keccak-256](https://emn178.github.io/online-tools/keccak_256.html) to get the first 4 bytes of the hash.

2. **Generate the Hexadecimal Signature**:
   - Example:
     ```
     Keccak-256 hash: c7d56c3b70972a8a1f2c78e08dbfdb4a6c5f8f6eac2523b5fcbdbf9d1334caaa
     First 4 bytes: c7d56c3b
     ```
   - Add `0x` to the result, so the function signature is: `0xc7d56c3b`.

3. **Include the Signature in the ESP32 Code**:
   - Replace `0xYOUR_FUNCTION_SIGNATURE` with the generated signature in the `generateABIEncodedData` function.

---

## Setup Instructions

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/environmental-monitoring-system.git
   cd environmental-monitoring-system
   ```

2. **Install Dependencies**:
   - For React Frontend:
     ```bash
     cd frontend
     npm install
     ```

3. **Configure `.env` Files**:
   - Create a `.env` file in both the ESP32 code and React app directories with:
     ```plaintext
     REACT_APP_CONTRACT_ADDRESS=<deployed_contract_address>
     REACT_APP_MAPBOX_API=<mapbox_access_token>
     ```

4. **Run the ESP32 Code**:
   - Flash the ESP32 with the code provided using the Arduino IDE or PlatformIO.

5. **Run the Frontend**:
   - Start the React app:
     ```bash
     npm start
     ```

6. **Interact with the System**:
   - Connect to the React app with Metamask to fetch and visualize data.

---

## Contributing

Contributions are welcome! Please open issues or submit pull requests with improvements.

---

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.
