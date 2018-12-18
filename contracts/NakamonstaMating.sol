pragma solidity ^0.4.24;

import "./NakamonstaUtils.sol";
import "./NakamonstaBase.sol";


contract NakamonstaMating is NakamonstaBase {
  uint128 public matingPrice = 0.01 ether;

  // --------------------------------
  // Admin functions (onlyOwner)
  // --------------------------------
  function setMinimumPrice(uint128 _matingPrice) public onlyOwner {
    matingPrice = _matingPrice;
  }

  // --------------------------------
  // Public methods
  // --------------------------------
  function mate(uint _tokenIdMother, uint _tokenIdFather) public
  isOwnerOf(_tokenIdMother) isOwnerOf(_tokenIdFather) payable
  returns(uint) {
    require(msg.value == matingPrice, "matingPrice isn't met");
    return _mate(_tokenIdMother, _tokenIdFather);
  }

  // --------------------------------
  // Utils
  // --------------------------------
  function _mate(uint _tokenIdMother, uint _tokenIdFather) internal
  isReady(_tokenIdMother) isReady(_tokenIdFather)
  returns(uint) {
    require(_tokenIdMother != _tokenIdFather, "Mother and father must be different");

    Nakamonsta storage mother = nakamonstas[_tokenIdMother];
    Nakamonsta storage father = nakamonstas[_tokenIdFather];

    // Calculate new genes
    uint babyGenes = NakamonstaUtils._mixGenes(father.genes, mother.genes);

    // Create new nakamonsta,
    uint babyNakamonstaId = _createNakamonsta(ownerOf(_tokenIdMother), "Baby", babyGenes,
      uint64(_tokenIdMother), uint64(_tokenIdFather));

    // After mating/giving birth, both parents must rest for 2 days
    mother.readyDate = uint64(now + 2 days);
    father.readyDate = uint64(now + 2 days);

    // Baby becomes adult after 7 days
    nakamonstas[babyNakamonstaId].readyDate = uint64(now + 7 days);
    return babyNakamonstaId;
  }
}
