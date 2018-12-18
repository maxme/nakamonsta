pragma solidity ^0.4.24;

import "./NakamonstaMating.sol";


contract NakamonstaAuction is NakamonstaMating {
  struct Auction {
    address owner;
    uint128 startPrice;
    uint128 endPrice;
    uint128 startDate;
    uint128 duration;
  }

  // Map from token ID to their corresponding auction.
  mapping (uint => Auction) public auctionByTokenId;
  uint public totalAuctions;
  uint128 public minimumPrice = 0.0001 ether;

  event AuctionCreated(uint tokenId, uint startPrice, uint endPrice, uint duration);
  event AuctionCompleted(uint tokenId, uint totalPrice, address winner);
  event AuctionCancelled(uint tokenId);

  // --------------------------------
  // Admin functions (onlyOwner)
  // --------------------------------
  function setMinimumPrice(uint128 _minimumPrice) public onlyOwner {
    minimumPrice = _minimumPrice;
  }

  // --------------------------------
  // Public methods
  // --------------------------------
  function createAuction(uint _tokenId, uint128 _startPrice, uint128 _endPrice, uint128 _duration)
  public isOwnerOf(_tokenId) isReady(_tokenId) {
    // Check inputs
    require(_startPrice >= minimumPrice, "start price must be greater or equal to the minimum price");
    require(_endPrice >= minimumPrice, "end price must be greater or equal to the minimum price");
    require(_duration >= 1 hours, "duration must be minimum 1 hour");
    require(_duration <= 100 * 365 days, "duration must be maximum 100 years");
    // Check _tokendId is not Auctioned already
    require(!_auctionExists(auctionByTokenId[_tokenId]), "Auction already exists");
    require(now >= nakamonstas[_tokenId].readyDate, "Nakamonsta is not ready yet");

    // Create a new Auction in memory and add it to the storage mapping. We must keep
    // track of the owner as we must transfer
    Auction memory auction = Auction(msg.sender, uint128(_startPrice),
          uint128(_endPrice), uint128(now), uint128(_duration));
    auctionByTokenId[_tokenId] = auction;
    // Approve the contract address to transfer the token to an eventual future buyer
    approve(this, _tokenId);
    totalAuctions += 1;
    emit AuctionCreated(_tokenId, _startPrice, _endPrice, _duration);
  }

  function bidOnAuction(uint _tokenId) public payable {
    Auction storage auction = auctionByTokenId[_tokenId];
    require(_auctionExists(auction), "Auction doesn't exist");
    uint currentPrice = _calculateCurrentPrice(auction.startPrice, auction.endPrice,
      auction.startDate, auction.duration, uint128(now));
    require(msg.value >= currentPrice, "Value must be greater than current price");
    uint remainingAmount = msg.value - currentPrice;
    // Send price amount to the token owner
    address(auction.owner).transfer(currentPrice);
    // TODO: eventually add a pattern to take a cut here
    // Eventually send the remaining amount back to the sender.
    if (remainingAmount > 0) {
      msg.sender.transfer(remainingAmount);
    }
    // Transfer the token from old owner to its new owner
    this.transferFrom(auction.owner, msg.sender, _tokenId);
    // Reset the auction
    _resetAuctionForTokenId(_tokenId);
    totalAuctions -= 1;
    emit AuctionCompleted(_tokenId, currentPrice, msg.sender);
  }

  function cancelAuction(uint _tokenId) public {
    Auction storage auction = auctionByTokenId[_tokenId];
    // Make sure the auction exists
    require(_auctionExists(auction), "Auction doesn't exist");
    // Make sure the sender is the owner of the auction
    require(auction.owner == msg.sender, "Sender must be the Auction's owner");
    // Remove approval of _tokenId
    approve(0, _tokenId);
    // Reset the auction
    _resetAuctionForTokenId(_tokenId);
    totalAuctions -= 1;
    emit AuctionCancelled(_tokenId);
  }

  function isTokenAuctioned(uint _tokenId) public view returns(bool) {
    return _isTokenAuctioned(_tokenId);
  }

  // This is not a good way to list all auctions, we could have a _allAuctions array and a
  // _allAuctionsIndex mapping to keep track of auctions like it's done in ERC721Enumerable
  function getAllTokensAuctioned() public view returns(uint[] auctions) {
    auctions = new uint[](totalAuctions);
    uint auctionIndex;
    for (uint index = 0; index < totalSupply(); index += 1) {
      uint token = tokenByIndex(index);
      if (isTokenAuctioned(token)) {
        auctions[auctionIndex] = token;
        auctionIndex += 1;
      }
    }
    return auctions;
  }

  // --------------------------------
  // Utils
  // --------------------------------
  function _auctionExists(Auction memory _auction) internal pure returns(bool) {
    // Return true if the auction is valid. startDate must be initialized,
    // if it's not initialized, it means the auction was completed, cancelled
    // or never created (default value of the mapping).
    return _auction.startDate > 0;
  }

  function _isTokenAuctioned(uint _tokenId) internal view returns(bool) {
    // Get the auction from the mapping
    Auction memory auction = auctionByTokenId[_tokenId];
    // Check if it exists
    return _auctionExists(auction);
  }

  function _resetAuctionForTokenId(uint _tokenId) internal {
    Auction storage auction = auctionByTokenId[_tokenId];
    auction.owner = 0;
    auction.startDate = 0;
    auction.startPrice = 0;
    auction.endPrice = 0;
    auction.duration = 0;
  }

  function _calculateCurrentPrice(uint128 _startPrice, uint128 _endPrice,
  uint128 _startDate, uint128 _duration, uint128 _currentDate) internal pure returns (uint256) {
    require(_duration > 0);
    require(_currentDate >= _startDate);
    if (_startPrice == _endPrice) {
      return _startPrice;
    }
    if (_currentDate >= _startDate + _duration) {
      return _endPrice;
    }
    uint128 elapsedTime = _currentDate - _startDate;

    // We use signed integer here because we can have
    // prices going down (_endPrice < _startPrice)
    int256 priceDiff = int256(_endPrice) - int256(_startPrice);
    return uint256(_startPrice + priceDiff * int256(elapsedTime) / int256(_duration));
  }
}
