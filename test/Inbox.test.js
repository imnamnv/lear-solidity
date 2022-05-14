//dynamic fox clap hover onion bean twice dwarf exit vivid ice own

const assert = require("assert");
const ganache = require("ganache-cli");

const Web3 = require("web3");

//connect Web3 to local Test nerwork
//provide like "a phone help 2 people communication"
const web3 = new Web3(ganache.provider()); // send ganache.provider which help web3 comunicate with ganache
const { bytecode, interface } = require("../compile");

let accountList;
let inbox;
beforeEach(async () => {
  //get list all of accounts
  accountList = await web3.eth.getAccounts();

  //use one of account to deploy the contract

  inbox = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({
      data: bytecode,
      arguments: ["Hi there!"],
    })
    .send({ from: accountList[0], gas: "1000000" });
});

describe("Inbox", () => {
  it("Deploys a contract", () => {
    assert.ok(inbox.options.address);
  });

  it("has a default message", async () => {
    const message = await inbox.methods.message().call();
    //message() is function in Contract
    //Call is function if you want to customize the Gas or who pay this transaction,....
    //use call for get (read only)

    assert.equal(message, "Hi there!");
  });

  it("can change the message", async () => {
    await inbox.methods.setMessage("bye").send({ from: accountList[0] }); // use send for set

    const message = await inbox.methods.message().call();
    assert.equal(message, "bye");
  });
});

// class Car {
//   park() {
//     return "parking";
//   }

//   driver() {
//     return "vroom";
//   }
// }

// beforeEach(() => {
//   car = new Car();
// });

// describe("Car", () => {
//   it("Can parking", () => {
//     assert.equal(car.park(), "parking");
//   });
//   it("Can driver", () => {
//     assert.equal(car.driver(), "vroom");
//   });
// });
