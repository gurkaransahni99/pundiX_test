/**
 * @type import('hardhat/config').HardhatUserConfig
 */
 require("@nomiclabs/hardhat-waffle")
//  require("@nomiclabs/hardhat-truffle5");
 require('hardhat-contract-sizer');
 require("@nomiclabs/hardhat-etherscan");
  // require("hardhat-gas-reporter");
 const CONFIG = require("./credentials.js");
 
 module.exports = {
     solidity: {
         compilers: [
             {
                 version: "0.8.0",
                 settings: {
                     optimizer: {
                         enabled: true,
                         runs: 1000,
                     },
                 },
             },
        ]
     },
     spdxLicenseIdentifier: {
         overwrite: true,
         runOnCompile: true,
     },
     // gasReporter: {
     //     currency: 'USD',
     //     gasPrice: 1
     // },
     defaultNetwork: "hardhat",
     mocha: {
         timeout: 10000000000000000000,
     },
 
     networks: {
         hardhat: {
             blockGasLimit: 10000000000000,
             allowUnlimitedContractSize: true,
             timeout: 10000000000000000000,
             accounts: {
                 accountsBalance: "10000000000000000000000000",
                 count: 20,
             },
         },
         rinkeby: {
             url: `https://rinkeby.infura.io/v3/${CONFIG.infura.mainEndpoint}`,
             accounts: [`${CONFIG.wallet.PKEY}`]
         },
     },
 
     contractSizer: {
         alphaSort: false,
         runOnCompile: true,
         disambiguatePaths: false,
     },

     etherscan: {
      apiKey: `${CONFIG.etherscan.apiKey}`
     },
 };
 
 