import NakamonstaAuction from "./../build/contracts/NakamonstaAuction.json";
import Authentication from "./../build/contracts/Authentication.json";

const drizzleOptions = {
  web3: {
    block: false,
    fallback: {
      type: "ws",
      url: "ws://127.0.0.1:8545"
    }
  },
  contracts: [NakamonstaAuction, Authentication],
  events: {
    NakamonstaAuction: ["NakamonstaBirth", "Transfer", "Approval"]
  },
  polls: {}
};

export default drizzleOptions;
