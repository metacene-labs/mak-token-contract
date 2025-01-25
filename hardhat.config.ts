import { HardhatUserConfig } from 'hardhat/config'
import '@nomicfoundation/hardhat-toolbox'
import '@openzeppelin/hardhat-upgrades'
import '@nomicfoundation/hardhat-ethers'

import { config as dotEnvConfig } from 'dotenv'
dotEnvConfig()

const config: HardhatUserConfig = {
  defaultNetwork: 'hardhat',
  networks: {
    hardhat: {
    },
    mantle_sepolia: {
      chainId: 5003,
      url: 'https://rpc.sepolia.mantle.xyz',
      accounts: [
        '',
      ],
    },
    mantle: {
      chainId: 5000,
      url: 'https://rpc.mantle.xyz',
      accounts: [
        '',
      ],
    },

  },
  solidity: {
    version: '0.8.20',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  paths: {
    artifacts: './artifacts',
    cache: './cache',
    sources: './contracts',
    tests: './test',
  },
  etherscan: {
    apiKey: "",
  },
}

export default config
