import { task } from 'hardhat/config';
import '@nomiclabs/hardhat-waffle';
import '@nomiclabs/hardhat-ethers';
import 'hardhat-typechain';

task('accounts', 'Prints the list of accounts', async (args, hre) => {
  const accounts = await hre.ethers.getSigners();
  for (const account of accounts) {
    console.log(await account.address);
  }
});

export default {
  networks: {
    hardhat: {
      hardfork: 'berlin',
    },
  },
  solidity: {
    version: '0.7.3',
    settings: {
      optimizer: {
        enabled: true,
        runs: 2000,
      },
      metadata: {
        bytecodeHash: 'none',
      },
    },
  },
};
