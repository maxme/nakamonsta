const NakamonstaAuction = artifacts.require("./NakamonstaAuction.sol");

contract("NakamonstaAuction", accounts => {
  it("should create 2 tokens and totalSupply is 3", async () => {
    const contract = await NakamonstaAuction.deployed();

    await contract.createGen0Nakamonsta(accounts[0], "Nakameow", 0);
    await contract.createGen0Nakamonsta(accounts[0], "Nakameow", 0);
    const totalSupply = await contract.totalSupply.call();
    // During contract initialization, one nakamonsta will be created: Genesis
    // Then, we create 2 new nakamonstas, so we should get 3 total nakamonstas
    assert.equal(totalSupply.toString(), "3", "wrong total supply");
  });
});
