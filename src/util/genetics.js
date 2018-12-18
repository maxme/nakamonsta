import { utils } from "web3";

// 0xffff 0000 0000 0000 0000 0000 ....
export function getBodyType(genes) {
  return getXType(genes, 4, 0);
}

// 0x0000 ffff 0000 0000 0000 0000 ....
export function getColorPattern(genes) {
  return getXType(genes, 4, 4);
}

// 0x0000 0000 ffff 0000 0000 0000 ....
export function getEyesType(genes) {
  return getXType(genes, 4, 8);
}

export function getMouthType(genes) {
  return getXType(genes, 4, 12);
}

export function getNoseType(genes) {
  return getXType(genes, 4, 16);
}

export function getEarsType(genes) {
  return getXType(genes, 4, 20);
}

export function bigNumberToHexPadded(bigNumber, size) {
  var bnHex = utils.toHex(bigNumber);
  bnHex = bnHex.slice(2, bnHex.length);
  if (bnHex.length >= size) return "0x" + bnHex;
  return "0x" + "0".repeat(size - bnHex.length) + bnHex;
}

/*
 * Size and Shift are 4 bits multipliers.
 *
 * I made this to make sure the hex version was readable, but this
 * doesn't have any meaning and the constraint could be lifted.
 */
function getXType(genes, size, shift) {
  const genesBN = utils.toBN(genes);
  var type = genesBN.shrn(256 - shift * 4 - size * 4);
  if (shift != 0) {
    type = type.and(utils.toBN("0x" + "0".repeat(shift) + "f".repeat(size)));
  }
  return type.toString();
}
