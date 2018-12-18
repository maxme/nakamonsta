pragma solidity ^0.4.24;

import "./NakamonstaERC721.sol";


contract NakamonstaBase is NakamonstaERC721 {
  struct Nakamonsta {
    string name;
    uint genes;
    uint64 birthDate;
    uint64 readyDate;
    uint64 motherId;
    uint64 fatherId;
  }

  Nakamonsta[] public nakamonstas;

  event NakamonstaBirth(uint nakamonstaId, string name, uint genes);

  constructor() public {
    _createGenesis(msg.sender);
  }

  // --------------------------------
  // Modifiers
  // --------------------------------
  modifier isReady(uint _tokendId) {
    require(isNakammonstaReady(_tokendId), "Nakamonsta is not ready yet");
    _;
  }

  // --------------------------------
  // Public methods
  // --------------------------------
  function createGen0Nakamonsta(address _to, string memory _name, uint _genes)
  public onlyOwner returns (uint) {
    require(nakamonstas.length != 0, "Genesis must be created");
    return _createNakamonsta(_to, _name, _genes, 0, 0);
  }

  function isNakammonstaReady(uint _tokendId) public view returns (bool) {
    return now >= nakamonstas[_tokendId].readyDate;
  }

  // --------------------------------
  // Utils
  // --------------------------------
  function _createNakamonsta(address _to, string memory _name, uint _genes, uint64 _motherId, uint64 _fatherId)
  internal onlyOwner returns (uint) {
    require(_to != address(0));
    // Give birth to a new Nakamonsta
    // solhint-disable-next-line not-rely-on-time
    Nakamonsta memory nakamonsta = Nakamonsta(_name, _genes, uint64(now), uint64(now), _motherId, _fatherId);
    // Add it to the array of nakamonstas and get its id
    uint nakamonstaId = nakamonstas.push(nakamonsta) - 1;
    // Call the ERC721 _mint function, assign nakamonstaId to it's new owner, it will also emit a Transfer event.
    _mint(_to, nakamonstaId);
    emit NakamonstaBirth(nakamonstaId, _name, _genes);
    return nakamonstaId;
  }

  function _createGenesis(address _to)
  internal onlyOwner returns (uint) {
    require(nakamonstas.length == 0, "Genesis must be the first Nakamonsta created");
    return _createNakamonsta(_to, "Genesis", 0, 0, 0);
  }
}
