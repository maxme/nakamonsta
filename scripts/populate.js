const NakamonstaAuction = artifacts.require("./NakamonstaAuction.sol");
const crypto = require("crypto");
const utils = web3.utils;

function bigNumberToHexPadded(bigNumber, size) {
  var bnHex = utils.toHex(bigNumber);
  bnHex = bnHex.slice(2, bnHex.length);
  if (bnHex.length >= size) return "0x" + bnHex;
  return "0x" + "0".repeat(size - bnHex.length) + bnHex;
}

async function createGen0(contract, name, genes) {
  const accounts = await web3.eth.getAccounts();

  console.log("Create a new Nakamonsta - transfer it to: " + accounts[0]);
  console.log("Genes: " + bigNumberToHexPadded(genes, 64));

  contract.createGen0Nakamonsta(accounts[0], name, genes);
}

function randomGene(minValue, maxValue) {
  return (crypto.randomBytes(4).readUInt32BE() % maxValue) + minValue;
}

function getRandomName() {
  const NAMES = [
    "Alain",
    "Alex",
    "Andrei",
    "Anthony",
    "Ben",
    "Chad",
    "Chance",
    "Charles",
    "Christopher",
    "Daniel",
    "Darren",
    "Deacon",
    "Eddie",
    "Edward",
    "Frank",
    "GR44",
    "George",
    "Gibson",
    "Guile",
    "Ivan",
    "Jack",
    "Jacques",
    "Jean",
    "Jean-Claude",
    "Kurt",
    "Kyle",
    "Louis",
    "Luc",
    "Lukas",
    "Lyon",
    "Marcus",
    "Master",
    "Max",
    "Mikhail",
    "Paul",
    "Phillip",
    "Phillippe",
    "Replicant",
    "Rudy",
    "Sam",
    "Samson",
    "Samuel",
    "Scott",
    "Stillman",
    "Storm",
    "Tiano",
    "Vincent",
    "Xander"
  ];
  return NAMES[Math.floor(Math.random() * NAMES.length)];
}

function writeGene(chromosome, position, size, value) {
  const valueBg = new utils.BN(value);
  // The eraser is useless in this case because we know the init value (0), also we should
  // erase the input value to avoid overflows.
  const ffff = new utils.BN(2).pow(new utils.BN(size * 4)).sub(new utils.BN(1));
  const eraser = new utils.BN(ffff).shln(256 - position * 4 - size * 4).notn(256);
  chromosome = chromosome.and(eraser).or(valueBg.shln(256 - position * 4 - size * 4));
  return chromosome;
}

function randomChromosome() {
  var chromosome = new utils.BN(0);
  // Body (3 types)
  chromosome = writeGene(chromosome, 0, 4, randomGene(0, 3));
  // Color pattern
  chromosome = writeGene(chromosome, 4, 4, randomGene(0, 2));
  // Eyes (3 types)
  chromosome = writeGene(chromosome, 8, 4, randomGene(0, 3));
  // Mouth (3 types)
  chromosome = writeGene(chromosome, 12, 4, randomGene(0, 3));
  // Nose (2 types)
  chromosome = writeGene(chromosome, 16, 4, randomGene(0, 2));
  // Ears (2 types)
  chromosome = writeGene(chromosome, 20, 4, randomGene(0, 2));
  return chromosome;
}

// TODO: generate some common / rare / epic genes
async function createSomeRandomGen1(max) {
  var contract = await NakamonstaAuction.deployed();
  for (var i = 0; i < max; i++) {
    createGen0(contract, getRandomName(), randomChromosome());
  }
}

async function transferSomeToAccount1() {
  var contract = await NakamonstaAuction.deployed();
  const accounts = await web3.eth.getAccounts();
  console.log("Transfering some tokens from : " + accounts[0] + " To " + accounts[1]);

  contract.transferFrom(accounts[0], accounts[1], 2);
  contract.transferFrom(accounts[0], accounts[1], 3);
  contract.transferFrom(accounts[0], accounts[1], 6);
  contract.transferFrom(accounts[0], accounts[1], 7);
  contract.transferFrom(accounts[0], accounts[1], 11);
}

async function createAnAuctionFor(nakamonstaId) {
  var contract = await NakamonstaAuction.deployed();
  const startPrice = utils.toWei("1", "ether");
  await contract.createAuction(nakamonstaId, startPrice, startPrice, 1000000);
  console.log("Create an auction on: " + nakamonstaId);
}

async function mate(fatherId, motherId) {
  var contract = await NakamonstaAuction.deployed();
  await contract.mate(fatherId, motherId, { value: utils.toWei("0.01", "ether") });
  console.log("A baby is born");
}

module.exports = function(callback) {
  createSomeRandomGen1(18);
  transferSomeToAccount1();
  createAnAuctionFor(0);
  mate(4, 5);
};
