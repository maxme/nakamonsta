const NakamonstaAuctionTestable = artifacts.require("./NakamonstaAuctionTestable.sol");

const READY_DATE = 3;

contract("NakamonstaAuctionTestable", accounts => {
  let contract;

  beforeEach(function() {
    return NakamonstaAuctionTestable.new().then(function(instance) {
      contract = instance;
    });
  });

  describe("Mating 2 Nakamonstas:", function() {
    it("should create a new nakamonsta", async () => {
      await contract.createGen0Nakamonsta(accounts[0], "Nakameow 1", 11);
      await contract.createGen0Nakamonsta(accounts[0], "Nakameow 2", 12);

      assert.equal(await contract.totalSupply(), 3);
      await contract.mate(1, 2, { value: web3.toWei("0.01", "ether") });
      assert.equal(await contract.totalSupply(), 4, "we should have a new nakamamonsta");
    });

    it("shouldn't be possible if mother and father is the same nakamonsta", async () => {
      await contract.createGen0Nakamonsta(accounts[0], "Nakameow 1", 11);

      assert.equal(await contract.totalSupply(), 2);
      try {
        await contract.mate(1, 1, { value: web3.toWei("0.01", "ether") });
      } catch (error) {
        assert(
          error.message.endsWith("revert Mother and father must be different"),
          "Expected a revert"
        );
      }
      assert.equal(await contract.totalSupply(), 2);
    });

    it("should put mother and father to rest", async () => {
      // mother
      await contract.createGen0Nakamonsta(accounts[0], "Nakameow 1", 11);
      // father
      await contract.createGen0Nakamonsta(accounts[0], "Nakameow 2", 12);
      // baby
      await contract.mate(1, 2, { value: web3.toWei("0.01", "ether") });

      // Get mother and father
      const mother = await contract.nakamonstas(1);
      const father = await contract.nakamonstas(2);
      const baby = await contract.nakamonstas(3);

      const motherReadyDate = new Date(mother[READY_DATE] * 1000);
      const fatherReadyDate = new Date(father[READY_DATE] * 1000);
      const babyReadyDate = new Date(baby[READY_DATE] * 1000);

      // Should be ~48 hours (2 days - now - test time)
      const motherDiffDateHours = Math.round((motherReadyDate - Date.now()) / 1000 / 3600);
      const fatherDiffDateHours = Math.round((fatherReadyDate - Date.now()) / 1000 / 3600);
      const babyDiffDateHours = Math.round((babyReadyDate - Date.now()) / 1000 / 3600);

      assert.equal(motherDiffDateHours, 24 * 2, "Mother ready date must be 48 hours in the future");
      assert.equal(fatherDiffDateHours, 24 * 2, "Father ready date must be 48 hours in the future");
      assert.equal(babyDiffDateHours, 24 * 7, "Baby ready date must be 168 hours in the future");
    });

    it("shouldn't be possible if mother is resting", async () => {
      // mother
      await contract.createGen0Nakamonsta(accounts[0], "Nakameow 1", 11);
      // father 1
      await contract.createGen0Nakamonsta(accounts[0], "Nakameow 2", 12);
      // father 2
      await contract.createGen0Nakamonsta(accounts[0], "Nakameow 3", 12);
      // make a baby
      await contract.mate(1, 2, { value: web3.toWei("0.01", "ether") });

      try {
        // try to make a second baby
        await contract.mate(1, 3, { value: web3.toWei("0.01", "ether") });
      } catch (error) {
        assert(error.message.endsWith("revert Nakamonsta is not ready yet"), "Expected a revert");
      }
    });

    it("shouldn't be possible if the father is resting", async () => {
      // mother 1
      await contract.createGen0Nakamonsta(accounts[0], "Nakameow 1", 11);
      // father
      await contract.createGen0Nakamonsta(accounts[0], "Nakameow 2", 12);
      // mother 2
      await contract.createGen0Nakamonsta(accounts[0], "Nakameow 3", 12);
      // make a baby
      await contract.mate(1, 2, { value: web3.toWei("0.01", "ether") });

      try {
        // try to make a second baby
        await contract.mate(3, 2, { value: web3.toWei("0.01", "ether") });
      } catch (error) {
        assert(error.message.endsWith("revert Nakamonsta is not ready yet"), "Expected a revert");
      }
    });

    it("sender must own the 2 parents", async () => {
      // mother
      await contract.createGen0Nakamonsta(accounts[0], "Nakameow 1", 11);
      // father
      await contract.createGen0Nakamonsta(accounts[1], "Nakameow 2", 12);

      try {
        // try to make a baby
        await contract.mate(1, 2, { value: web3.toWei("0.01", "ether") });
      } catch (error) {
        assert(
          error.message.endsWith("revert Sender must be the token owner"),
          "Expected a revert"
        );
      }
    });

    it("is not free", async () => {
      // mother
      await contract.createGen0Nakamonsta(accounts[0], "Nakameow 1", 11);
      // father
      await contract.createGen0Nakamonsta(accounts[0], "Nakameow 2", 12);

      try {
        // try to make a baby
        await contract.mate(1, 2);
      } catch (error) {
        assert(error.message.endsWith("revert matingPrice isn't met"), "Expected a revert");
      }
    });

    it("is not very expensive", async () => {
      // mother
      await contract.createGen0Nakamonsta(accounts[0], "Nakameow 1", 11);
      // father
      await contract.createGen0Nakamonsta(accounts[0], "Nakameow 2", 12);

      try {
        // try to make a baby
        await contract.mate(1, 2), { value: web3.toWei("1", "ether") };
      } catch (error) {
        assert(error.message.endsWith("revert matingPrice isn't met"), "Expected a revert");
      }
    });
  });
});
