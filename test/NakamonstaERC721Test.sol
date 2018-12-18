pragma solidity ^0.4.24;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/NakamonstaAuction.sol";


contract NakamonstaERC721Test {
  function testInitialBalanceUsingDeployedContract() public {
    NakamonstaAuction erc721 = NakamonstaAuction(DeployedAddresses.NakamonstaAuction());
    uint expected = 1;
    Assert.equal(erc721.totalSupply(), expected, "Owner should have 1 erc721 initially");
  }
}
