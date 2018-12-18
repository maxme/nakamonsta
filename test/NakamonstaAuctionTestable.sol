pragma solidity ^0.4.24;

import "../contracts/NakamonstaAuction.sol";
import "../contracts/NakamonstaUtils.sol";


contract NakamonstaAuctionTestable is NakamonstaAuction {
  function calculateCurrentPriceTestable(uint128 _startPrice, uint128 _endPrice, uint128 _startDate,
  uint128 _duration, uint128 _currentDate) public pure returns (uint256) {
    return _calculateCurrentPrice(_startPrice, _endPrice, _startDate, _duration, _currentDate);
  }

  function tokenIdToAuction(uint256 _tokenId) public view returns (address, uint128, uint128, uint128, uint128) {
    Auction memory auction = auctionByTokenId[_tokenId];
    return (auction.owner, auction.startPrice, auction.endPrice, auction.startDate, auction.duration);
  }

  function mixGenes(uint _mother, uint _father) public pure returns (uint) {
    return NakamonstaUtils._mixGenes(_mother, _father);
  }
}
