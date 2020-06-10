const assert = require("assert");
const Lottery = artifacts.require("./Lottery.sol");

contract("Lottery", (accounts) => {
  let contract;

  beforeEach(async () => {
    contract = await Lottery.deployed();
  });

  describe("Lottery Contract", async () => {
    it("Deploys contract", async () => {
      let address = contract.address;
      console.log(address);
      assert.ok(address);
    });

    it("Allows one account to enter", async () => {
      await contract.enterLottery({ from: accounts[0], value: web3.utils.toWei("0.3", "ether") });
      const players = await contract.allPlayers.call();
      assert.equal(accounts[0], players[0]);
      assert.equal(1, players.length);
    });

    it("Allows multiple accounts to enter", async () => {
      await contract.enterLottery({ from: accounts[0], value: web3.utils.toWei("0.3", "ether") });
      await contract.enterLottery({ from: accounts[1], value: web3.utils.toWei("0.3", "ether") });
      await contract.enterLottery({ from: accounts[2], value: web3.utils.toWei("0.3", "ether") });
      const players = await contract.allPlayers.call();
      console.log(players);
      //   assert.equal(accounts[0], players[0]);
      //   assert.equal(accounts[1], players[1]);
      assert.equal(4, players.length);
    });

    it("Allows min amount of ether to enter", async () => {
      try {
        await contract.enterLottery({ from: accounts[3], value: web3.utils.toWei("0.1", "ether") });
        assert(false);
      } catch (err) {
        assert(err);
      }
    });
  });
});
