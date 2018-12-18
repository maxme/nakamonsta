const NakamonstaUtils = artifacts.require("./NakamonstaUtils.sol");
const NakamonstaAuctionTestable = artifacts.require("./NakamonstaAuctionTestable.sol");

describe("Nakamonsta Utils", function() {
  let nakamonstaAuction;

  beforeEach(function() {
    return NakamonstaAuctionTestable.new().then(function(instance) {
      nakamonstaAuction = instance;
    });
  });

  it("Get position", async () => {
    const contract = await NakamonstaUtils.new();
    const bn = new web3.BigNumber(
      "0x0001000200030004000500060000000000000000000000000000000000000000"
    );
    //console.log(web3.toHex(bn));
    assert.equal(web3.toHex(await contract.getBody(bn)), 1);
    assert.equal(web3.toHex(await contract.getColorPattern(bn)), 2);
    assert.equal(web3.toHex(await contract.getEyesType(bn)), 3);
    assert.equal(web3.toHex(await contract.getMouthType(bn)), 4);
    assert.equal(web3.toHex(await contract.getNoseType(bn)), 5);
    assert.equal(web3.toHex(await contract.getEarsType(bn)), 6);
  });

  it("Mix 2 identical nakamonstas", async () => {
    const bn = new web3.BigNumber(
      "0x0001000200030004000500060000000000000000000000000000000000000000"
    );

    const baby = await nakamonstaAuction.mixGenes(bn, bn);
    assert.equal(web3.toHex(baby), web3.toHex(bn));
  });

  it("Mix 2 nakamonstas - v1", async () => {
    const mother = new web3.BigNumber(
      "0x0002000200020002000200020000000000000000000000000000000000000000"
    );
    const father = new web3.BigNumber(
      "0x0001000100010001000100010000000000000000000000000000000000000000"
    );
    const expectedBaby = new web3.BigNumber(
      "0x2000200020001000100010000000000000000000000000000000000000000"
    );
    const baby = await nakamonstaAuction.mixGenes(mother, father);
    assert.equal(web3.toHex(baby), web3.toHex(expectedBaby));
  });

  it("Mix 2 nakamonstas - v2", async () => {
    const mother = new web3.BigNumber(
      "0x0001000200030004000500060000000000000000000000000000000000000000"
    );
    const father = new web3.BigNumber(
      "0x000700080009000a000b000c0000000000000000000000000000000000000000"
    );
    const expectedBaby = new web3.BigNumber(
      "0x7000200090004000b00060000000000000000000000000000000000000000"
    );
    const baby = await nakamonstaAuction.mixGenes(mother, father);
    assert.equal(web3.toHex(baby), web3.toHex(expectedBaby));
  });
});
