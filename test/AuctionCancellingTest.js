const NakamonstaAuctionTestable = artifacts.require("./NakamonstaAuctionTestable.sol");

const ADDRESS = 0;
const START_PRICE = 1;
const END_PRICE = 2;
const START_DATE = 3;
const DURATION = 4;

contract("NakamonstaAuctionTestable", accounts => {
  let nakamonstaAuction;

  beforeEach(function() {
    return NakamonstaAuctionTestable.new().then(function(instance) {
      nakamonstaAuction = instance;
    });
  });

  describe("Auction cancelling", function() {
    it("cancels an option an owner created", async () => {
      // Create an auction
      await nakamonstaAuction.createAuction(0, 1000000000000000, 2000000000000000, 100000);
      // Check the auction exists
      const auction1 = await nakamonstaAuction.tokenIdToAuction(0);
      assert.notStrictEqual(auction1[START_DATE].toNumber(), 0);
      // Cancel it
      await nakamonstaAuction.cancelAuction(0);
      // Check it doesn't exist anymore
      const auction2 = await nakamonstaAuction.tokenIdToAuction(0);
      assert.equal(auction2[START_DATE], 0, "Auction startDate should be 0");
    });
  });
});
