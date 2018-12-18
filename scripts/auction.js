const NakamonstaAuction = artifacts.require("./NakamonstaAuction.sol");

async function createAnAuctionFor(nakamonstaId, account) {
  var contract = await NakamonstaAuction.deployed();
  const startPrice = web3.toWei("1", "ether");
  await contract.createAuction(nakamonstaId, startPrice, 2 * startPrice, 100000, {
    from: web3.eth.accounts[account]
  });
  console.log("Create an auction on: " + nakamonstaId);
}

module.exports = function(callback) {
  createAnAuctionFor(1, 0);
  createAnAuctionFor(2, 1);
  createAnAuctionFor(3, 1);
  createAnAuctionFor(4, 0);
  createAnAuctionFor(5, 0);
  createAnAuctionFor(6, 1);
  createAnAuctionFor(7, 1);
  createAnAuctionFor(8, 0);
  createAnAuctionFor(9, 0);
  createAnAuctionFor(10, 0);
  createAnAuctionFor(11, 1);
};
