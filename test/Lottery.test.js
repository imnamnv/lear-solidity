const assert = require("assert");
const ganache = require("ganache-cli");

const Web3 = require("web3");

const web3 = new Web3(ganache.provider());

const { bytecode, interface } = require("../compile");

let lottery;
let accountList;

beforeEach(async () => {
  accountList = await web3.eth.getAccounts();

  lottery = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({
      data: bytecode,
    })
    .send({ from: accountList[0], gas: "1000000" });
});

describe("Lottery Contract", () => {
  it("Deploys a contract", () => {
    assert.ok(lottery.options.address);
  });

  it("allows one account to enter", async () => {
    await lottery.methods.enter().send({
      from: accountList[0],
      value: web3.utils.toWei("0.02", "ether"),
    });

    const playerList = await lottery.methods
      .getPlayerList()
      .call({ from: accountList[0] });

    assert(accountList[0], playerList[0]);

    assert(1, playerList.length);
  });

  it("allows multiple account to enter", async () => {
    await lottery.methods.enter().send({
      from: accountList[0],
      value: web3.utils.toWei("0.02", "ether"),
    });

    await lottery.methods.enter().send({
      from: accountList[1],
      value: web3.utils.toWei("0.02", "ether"),
    });

    await lottery.methods.enter().send({
      from: accountList[2],
      value: web3.utils.toWei("0.02", "ether"),
    });

    const playerList = await lottery.methods
      .getPlayerList()
      .call({ from: accountList[0] });

    assert(accountList[0], playerList[0]);
    assert(accountList[1], playerList[1]);
    assert(accountList[2], playerList[2]);

    assert(3, playerList.length);
  });

  it("requires a minimun amount of ether to enter", async () => {
    try {
      await lottery.methods.enter().send({
        from: accountList[0],
        value: 0,
      });
      assert(false);
    } catch (error) {
      assert(error); //check if is truethy
    }
  });

  it("only manager can call pickWinner", async () => {
    try {
      await lottery.methods.pickWinner().send({
        from: accountList[3],
      });
      assert(false);
    } catch (error) {
      assert(error);
    }
  });

  it("send money to the winner  and resets the players array", async () => {
    await lottery.methods.enter().send({
      from: accountList[0],
      value: web3.utils.toWei("2", "ether"),
    });

    const initialBalance = await web3.eth.getBalance(accountList[0]);
    await lottery.methods.pickWinner().send({ from: accountList[0] });
    const finalBalance = await web3.eth.getBalance(accountList[0]);

    const difference = finalBalance - initialBalance;
    assert(difference > web3.utils.toWei("1.8", "ether"));
  });
});
