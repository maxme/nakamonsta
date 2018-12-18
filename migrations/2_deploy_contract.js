var NakamonstaAuction = artifacts.require("./NakamonstaAuction.sol");
var Authentication = artifacts.require("./Authentication.sol");

module.exports = function(deployer) {
  deployer.deploy(NakamonstaAuction);
  deployer.deploy(Authentication);
};
