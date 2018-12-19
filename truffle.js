/*
 * NB: since truffle-hdwallet-provider 0.0.5 you must wrap HDWallet providers in a
 * function when declaring them. Failure to do so will cause commands to hang. ex:
 * ```
 * mainnet: {
 *     provider: function() {
 *       return new HDWalletProvider(mnemonic, 'https://mainnet.infura.io/<infura-key>')
 *     },
 *     network_id: '1',
 *     gas: 4500000,
 *     gasPrice: 10000000000,
 *   },
 */
var HDWalletProvider = require("truffle-hdwallet-provider");

module.exports = {
  // See <https://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  networks: {
    development: {
      host: "127.0.0.1",
      network_id: "*", // Match any network id
      port: 8545
    },
    ropstenInfura: {
      provider: function() {
        return new HDWalletProvider(
          process.env.INFURA_ROPSTEN_MNEMONIC,
          "https://ropsten.infura.io/v3/" + process.env.INFURA_PROJECT_ID
        );
      },
      network_id: "3"
    },
    ropstenLocal: {
      from: "0xde7ec724235b6aa0a37a0e3b4605a22cb3dd9b2d",
      host: "127.0.0.1",
      port: 8545,
      network_id: "*",
      gas: 5000000,
      gasPrice: 10000000000
    },
    live: {
      from: "0xde7ec724235b6aa0a37a0e3b4605a22cb3dd9b2d",
      host: "127.0.0.1",
      port: 8545,
      network_id: "*",
      gas: 500000,
      gasPrice: 1000000000
    }
  },
  compilers: {
    solc: {
      version: "0.4.25"
    }
  }
};
