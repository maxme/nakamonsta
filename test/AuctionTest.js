const NakamonstaAuctionTestable = artifacts.require("./NakamonstaAuctionTestable.sol");

const ADDRESS = 0;
const START_PRICE = 1;
const END_PRICE = 2;
const START_DATE = 3;
const DURATION = 4;

contract("NakamonstaAuctionTestable", accounts => {
  let contract;
  const ONE_ETH = web3.toWei("1", "ether");

  beforeEach(function() {
    return NakamonstaAuctionTestable.new().then(function(instance) {
      contract = instance;
    });
  });

  describe("Auction creation", function() {
    it("creates an auction and check everything went fine", async () => {
      // uint _tokenId, uint128 _startPrice, uint128 _endPrice, uint128 _duration
      await contract.createAuction(0, ONE_ETH, 2 * ONE_ETH, 100000);
      const auction = await contract.tokenIdToAuction(0);
      const address = auction[ADDRESS];
      const startPrice = auction[START_PRICE];
      const endPrice = auction[END_PRICE];
      const startDate = auction[START_DATE];
      const duration = auction[DURATION];
      assert.equal(address, accounts[0]);
      assert.equal(startPrice, ONE_ETH);
      assert.equal(endPrice, 2 * ONE_ETH);
      assert.equal(duration, 100000);
      assert.notStrictEqual(startDate, 0);
      assert.equal(await contract.totalAuctions(), 1);
    });

    it("checks that a non-existing auction is non existant", async () => {
      // uint _tokenId, uint128 _startPrice, uint128 _endPrice, uint128 _duration
      const auction = await contract.tokenIdToAuction(345);
      assert.equal(auction[START_DATE], 0, "Auction startDate should be 0");
    });

    it("fails when creating an auction on a token we don't own", async () => {
      try {
        await contract.createAuction(0, ONE_ETH, 2 * ONE_ETH, 100000, {
          from: accounts[1]
        });
      } catch (error) {
        expect(error.message).to.include("Sender must be the token owner");
      }
      assert.equal(await contract.totalAuctions(), 0);
    });

    it("fails when creating an auction on a token already auctioned", async () => {
      await contract.createAuction(0, ONE_ETH, 2 * ONE_ETH, 100000);
      const auction1 = await contract.tokenIdToAuction(0);
      assert.notStrictEqual(auction1[START_DATE].toNumber(), 0);
      try {
        await contract.createAuction(0, ONE_ETH, 2 * ONE_ETH, 100000);
      } catch (error) {
        expect(error.message).to.include("Auction already exists");
      }
      assert.equal(await contract.totalAuctions(), 1);
    });
  });

  describe("List auctions", function() {
    it("get all tokens auctioned", async () => {
      // Create 5 nakamonstas
      await contract.createGen0Nakamonsta(accounts[0], "Nakameow 1", 0);
      await contract.createGen0Nakamonsta(accounts[0], "Nakameow 2", 0);
      await contract.createGen0Nakamonsta(accounts[0], "Nakameow 3", 0);
      await contract.createGen0Nakamonsta(accounts[0], "Nakameow 4", 0);
      await contract.createGen0Nakamonsta(accounts[0], "Nakameow 5", 0);

      // Create 3 auctions (genesis, Nakameow 1, Nakameow 2)
      await contract.createAuction(0, ONE_ETH, 2 * ONE_ETH, 100000);
      await contract.createAuction(1, ONE_ETH, 2 * ONE_ETH, 100000);
      await contract.createAuction(2, ONE_ETH, 2 * ONE_ETH, 100000);

      const auctions = await contract.getAllTokensAuctioned();
      assert.equal(auctions.length, 3, "Total auctions should be: 3");
      assert.equal(await contract.totalAuctions(), 3);
    });
  });

  describe("Auction cancellation", function() {
    it("cancels an option an owner created", async () => {
      // Create an auction
      await contract.createAuction(0, ONE_ETH, 2 * ONE_ETH, 100000);
      // Check the auction exists
      const auction1 = await contract.tokenIdToAuction(0);
      assert.notStrictEqual(auction1[START_DATE].toNumber(), 0);
      // Cancel it
      await contract.cancelAuction(0);
      // Check it doesn't exist anymore
      const auction2 = await contract.tokenIdToAuction(0);
      assert.equal(auction2[START_DATE], 0, "Auction startDate should be 0");
    });

    it("fails when an account tries to cancel an auction it didn't created", async () => {
      // Create an auction
      await contract.createAuction(0, ONE_ETH, 2 * ONE_ETH, 100000);
      // Check the auction exists
      const auction1 = await contract.tokenIdToAuction(0);
      assert.notStrictEqual(auction1[START_DATE].toNumber(), 0);
      // Try to cancel it from another account
      try {
        await contract.cancelAuction(0, {
          from: accounts[1]
        });
      } catch (error) {
        expect(error.message).to.include("Sender must be the Auction's owner");
      }
      // Check the auction still exists
      const auction2 = await contract.tokenIdToAuction(0);
      assert.notStrictEqual(auction2[START_DATE].toNumber(), 0);
    });
  });

  describe("Bidding on an auction", function() {
    it("transfers property when completed and set balances correctly", async () => {
      const startPrice = ONE_ETH;
      await contract.createAuction(0, startPrice, 2 * startPrice, 100000);
      const sellerBalanceBefore = web3.eth.getBalance(accounts[0]);

      // Try to cancel it from another account
      const owner1 = await contract.ownerOf(0);
      expect(owner1).to.equal(accounts[0]);
      const buyerBalanceBefore = Math.round(
        web3.eth
          .getBalance(accounts[1])
          .div(1000000000000000)
          .toNumber()
      );
      const gasPrice = 100000000000;
      const tx = await contract.bidOnAuction(0, {
        from: accounts[1],
        value: 1500000000000000000,
        gasPrice: gasPrice
      });
      const owner2 = await contract.ownerOf(0);
      // Make sure the new owner is the buyer
      expect(owner2).to.equal(accounts[1]);

      // Make sure the buyer spent the right amount (startPrice + gasCost)
      const buyerBalanceAfter = web3.eth.getBalance(accounts[1]);
      const gasCost = gasPrice * tx.receipt.gasUsed;
      const shouldBeEqualAsBuyerBalanceBefore = Math.round(
        buyerBalanceAfter
          .add(gasCost)
          .add(startPrice)
          .div(1000000000000000)
          .toNumber()
      );
      expect(shouldBeEqualAsBuyerBalanceBefore).to.equal(buyerBalanceBefore);

      // Make sure the seller got his money back
      const sellerBalanceAfter = web3.eth.getBalance(accounts[0]);
      const shouldBeEqualAsSellerBalanceAfter = sellerBalanceBefore.add(startPrice);
      expect(shouldBeEqualAsSellerBalanceAfter.toString()).to.equal(sellerBalanceAfter.toString());
    });

    it("fails when the bidding prices is too low", async () => {
      await contract.createAuction(0, ONE_ETH, 2 * ONE_ETH, 100000);
      const owner1 = await contract.ownerOf(0);
      expect(owner1).to.equal(accounts[0]);
      try {
        await contract.bidOnAuction(0, {
          from: accounts[1],
          value: 900000000000000000
        });
      } catch (error) {
        expect(error.message).to.include("Value must be greater than current price");
      }
      const owner2 = await contract.ownerOf(0);
      expect(owner2).to.equal(accounts[0]);
    });
  });

  // _calculateCurrentPrice(_startPrice, _endPrice, _startDate, _duration, _currentDate)
  describe("contract._calculateCurrentPrice:", function() {
    it("returns startPrice if startPrice == endPrice - whatever startDate/duration/currentDate 1", async () => {
      const price = await contract.calculateCurrentPriceTestable(42, 42, 100, 100, 100);
      assert.equal(price.toNumber(), 42, "Wrong price");
    });

    it("returns startPrice if startPrice == endPrice - whatever startDate/duration/currentDate 2", async () => {
      const price = await contract.calculateCurrentPriceTestable(42, 42, 100, 1, 10000);
      assert.equal(price.toNumber(), 42, "Wrong price");
    });

    it("returns startPrice if startPrice == endPrice - whatever startDate/duration/currentDate 3", async () => {
      const price = await contract.calculateCurrentPriceTestable(42, 42, 100, 100000, 100);
      assert.equal(price.toNumber(), 42, "Wrong price");
    });

    it("returns startPrice if startPrice == endPrice - whatever startDate/duration/currentDate 4", async () => {
      const price = await contract.calculateCurrentPriceTestable(42, 42, 100, 100, 150);
      assert.equal(price.toNumber(), 42, "Wrong price");
    });

    it("calculates current price - price up - after auction", async () => {
      const price = await contract.calculateCurrentPriceTestable(11, 53, 1000, 1, 200000);
      assert.equal(price.toNumber(), 53, "Wrong price");
    });

    it("calculates current price - price up - right after start", async () => {
      const price = await contract.calculateCurrentPriceTestable(11, 53, 1000, 1000, 1000);
      assert.equal(price.toNumber(), 11, "Wrong price");
    });

    it("calculates current price - price up - half auction", async () => {
      const price = await contract.calculateCurrentPriceTestable(11, 53, 1000, 100, 1050);
      assert.equal(price.toNumber(), 32);
    });

    it("calculates current price - price down - after auction", async () => {
      const price = await contract.calculateCurrentPriceTestable(53, 11, 1000, 1, 200000);
      assert.equal(price.toNumber(), 11, "Wrong price");
    });

    it("calculates current price - price down - right after start", async () => {
      const price = await contract.calculateCurrentPriceTestable(53, 11, 1000, 1000, 1000);
      assert.equal(price.toNumber(), 53, "Wrong price");
    });

    it("calculates current price - price down - half auction", async () => {
      const price = await contract.calculateCurrentPriceTestable(53, 11, 1000, 100, 1050);
      assert.equal(price.toNumber(), 32);
    });

    it("calculates current price - price up - long duration auction (max int128)", async () => {
      const price = await contract.calculateCurrentPriceTestable(
        11,
        53,
        1000,
        "170141183460469231731687303715884105728",
        "170141183460469231731687303715884106728"
      );
      assert.equal(price.toNumber(), 53, "Wrong price");
    });

    it("reverts on overflow - long duration / high price", async () => {
      try {
        await contract.calculateCurrentPriceTestable(
          0,
          "170141183460469231731687303715884105728",
          0,
          "170141183460469231731687303715884105728",
          "170141183460469231731687303715884105728"
        );
      } catch (error) {
        assert(error.message.endsWith("revert"), "Expected a revert");
      }
    });

    it("reverts when duration is null", async () => {
      try {
        await contract.calculateCurrentPriceTestable(0, 100, 1000, 0, 100);
      } catch (error) {
        assert(error.message.endsWith("revert"), "Expected a revert");
      }
    });
  });
});
