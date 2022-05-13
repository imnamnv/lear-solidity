const assert = require("assert");
const ganache = require("ganache-cli");

const Web3 = require("web3");

//connect Web3 to local Test nerwork
//provide like "a phone help 2 people communication"
const web3 = new Web3(ganache.provider());
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
    console.log(inbox);
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
