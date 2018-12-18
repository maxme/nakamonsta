pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/token/ERC721/ERC721.sol";
import "openzeppelin-solidity/contracts/token/ERC721/ERC721Enumerable.sol";


contract NakamonstaERC721 is Ownable, ERC721, ERC721Enumerable {
  string public symbol = "NKM";
  string public name = "Nakamonsta";

  modifier isOwnerOf(uint _tokendId) {
    require(ownerOf(_tokendId) == msg.sender, "Sender must be the token owner");
    _;
  }

  function withdrawAll() public onlyOwner {
    owner().transfer(address(this).balance);
  }
}
