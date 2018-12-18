# Nakamonsta

Catch, collect and fight collectible monsters. This is an open source dApp mostly inspired by Cryptokitties.

A side project to learn more about some smart contract development concepts and tools (Truffle, Drizzle and Mythril Classic).

Warning: this is highly inspired by Cryptokitties, but it's not supposed to be a clone. This project is mostly an experiment to use Truffle + Drizzle.

# Features

- Basic Blockchain Authentication
- ERC721 tokens
- Clock Auction
- Genetic based traits
- Nakamonsta Minting and Reproduction

## Demos

- Create an Auction for a Nakamonsta

  ![Create an Auction for a Nakamonsta Demo Video](https://bia.is/s/Znbu/demo-create-auction.gif)

- Buy a Nakamonsta

  ![Buy a Nakamonsta Demo Video](https://bia.is/s/Znbu/demo-buy.gif)

- Mate 2 Nakamonstas

  ![Mate 2 Nakamonstas Demo Video](https://bia.is/s/Znbu/demo-mating.gif)

# Development

## Setup

Make sure to have a local dev Ethereum blockchain started (geth --dev, Ganache, etc.). And make sure to have a web3 enabled browser (Firefox + Metamask for instance) connected to that development blockchain. Then you can run the following commands deploy the smart contracts, create some initial data and serve the web app.

```shell
$ truffle migrate # build and deploy the smart contracts
$ yarn populate   # create some test data + the genesis nakamonsta, father and mother of all nakamonstas
$ yarn start      # run the local webserver and serve the web app
```

There is also a shortcut that does exactly this:

```shell
$ yarn fullstart
```

## Run the linter

```shell
$ yarn lint
```

# Other Documents

- [Milestones / TODO list](./TODO.md)
- [Genome: encoding information in ](./GENOME.md)

# Known Issues

- Rejecting a transaction (for instance when creating an auction or buying a nakamonsta) puts the view into infinite loading mode. This is partly due to this issue https://github.com/trufflesuite/drizzle/issues/134 in Drizzle.

# FAQ

> When I try to run the `yarn fullstart` command, I get the error:
>
>     Writing artifacts to ./build/contracts
>
>     Could not connect to your Ethereum client. Please check that your Ethereum client:
>         - is running
>         - is accepting RPC connections (i.e., "--rpc" option is used in geth)
>         - is accessible over the network
>         - is properly configured in your Truffle configuration file (truffle.js)
>
>     error Command failed with exit code 1.
>
> What should I do?

Make sure that the default config in `truffle.js` suits your needs. The expected development server is `127.0.0.1:8545`.

> I get the error: `You must connect to a local development network. Contracts haven't been deployed on testnet or mainet yet.` when I try to visit the dev server on my web browser.

Metamask is not connected to your development server, make sure to point Metamask

# LICENSE

[MIT](./LICENSE)
