#!/usr/bin/env node

/**
 * Script to update contract addresses in frontend config after deployment
 * Usage: node update-contract-addresses.js <contract_address> [network_id]
 */

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const contractAddress = args[0];
const networkId = args[1] || '31337'; // Default to Hardhat local network

if (!contractAddress) {
  console.error('❌ Please provide a contract address');
  console.log('Usage: node update-contract-addresses.js <contract_address> [network_id]');
  process.exit(1);
}

const configPath = path.join(__dirname, 'frontend', 'src', 'config', 'contracts.ts');

try {
  let content = fs.readFileSync(configPath, 'utf8');
  
  // Update the authorization address for the specified network
  const regex = new RegExp(`(${networkId}:\\s*{[^}]*authorization:\\s*")[^"]*(")`);
  
  if (content.match(regex)) {
    content = content.replace(regex, `$1${contractAddress}$2`);
    fs.writeFileSync(configPath, content);
    console.log(`✅ Updated authorization contract address for network ${networkId}: ${contractAddress}`);
  } else {
    console.error(`❌ Could not find network configuration for chain ID ${networkId}`);
  }
} catch (error) {
  console.error('❌ Error updating contract addresses:', error.message);
}
