const HDWalletProvider = require("@truffle/hdwallet-provider");

const Web3 = require("web3");
const { interface, bytecode } = require("./compile");

const provider = new HDWalletProvider(
  "dynamic fox clap hover onion bean twice dwarf exit vivid ice own",
  "https://rinkeby.infura.io/v3/33b670734ef2418facdb30106a7ff5a4" //it help web3 connect to rinkeby by infura(can know this a node in network)
);
const web3 = new Web3(provider);

const deploy = async () => {
  const accountList = await web3.eth.getAccounts();
  console.log("accountList", accountList[0]);

  const result = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({
      data: bytecode,
      arguments: ["Hi there!"],
    })
    .send({ gas: 1000000, from: accountList[0] });
  provider.engine.stop(); // stop in terminal
  console.log("result", result.options.address);
};

deploy();
