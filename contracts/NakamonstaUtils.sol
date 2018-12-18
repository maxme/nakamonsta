pragma solidity ^0.4.24;


library NakamonstaUtils {
  function getBody(uint _dna) public pure returns (uint16) {
    return getX(_dna, 4);
  }

  function getColorPattern(uint _dna) public pure returns (uint16) {
    return getX(_dna, 8);
  }

  function getEyesType(uint _dna) public pure returns (uint16) {
    return getX(_dna, 12);
  }

  function getMouthType(uint _dna) public pure returns (uint16) {
    return getX(_dna, 16);
  }

  function getNoseType(uint _dna) public pure returns (uint16) {
    return getX(_dna, 20);
  }

  function getEarsType(uint _dna) public pure returns (uint16) {
    return getX(_dna, 24);
  }

  function getX(uint _dna, uint8 _position) public pure returns (uint16) {
    uint shifted = _dna >> 256 - 4 * _position;
    return uint16(shifted % 2 ** 16);
  }

  function getBit(uint a, uint8 n) public pure returns (bool) {
    return a & (uint(1) << n) != 0;
  }

  function _mixGenes(uint _dna1, uint _dna2) internal pure returns (uint) {
    // TODO: Do something smarter here
    // TODO: eventually add mutations
    // TODO: Fix upper bounds / genes

    uint8 r = _random(_dna1, _dna2, 0, 255);
    uint body = getBody(getBit(r, 1) ? _dna1 : _dna2);
    uint colorPattern = getColorPattern(getBit(r, 2) ? _dna1 : _dna2);
    uint eyes = getEyesType(getBit(r, 3) ? _dna1 : _dna2);
    uint mouth = getMouthType(getBit(r, 4) ? _dna1 : _dna2);
    uint nose = getNoseType(getBit(r, 5) ? _dna1 : _dna2);
    uint ears = getEarsType(getBit(r, 6) ? _dna1 : _dna2);
    return body << (256 - 4 * 4) | colorPattern << (256 - 4 * 8) | eyes << (256 - 4 * 12)
      | mouth << (256 - 4 * 16) | nose << (256 - 4 * 20) | ears << (256 - 4 * 24);
  }

  function _random(uint t1, uint t2, uint8 min, uint8 max) internal pure returns (uint8) {
    return uint8(keccak256(abi.encodePacked(t1 + t2))) % (min + max) - min;
  }
}
