import React, { Component } from "react";
import LotteryContract from "./contracts/Lottery.json";
import getWeb3 from "./getWeb3";

class App extends Component {
  state = {
    value: "",
    balance: "",
    message: "",
    instance: "",
    account: "",
    web3: "",
    winnerMessage: "",
  };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = LotteryContract.networks[networkId];
      const instance = new web3.eth.Contract(LotteryContract.abi, deployedNetwork.address);

      const balance = await web3.eth.getBalance(deployedNetwork.address);

      const totalPlayers = await instance.methods.playersLength().call({ from: this.state.account });

      this.setState({ web3, account: accounts[0], instance, balance, totalPlayers });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(`Failed to load web3, accounts, or contract. Check console for details.`);
      console.error(error);
    }
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    this.setState({ message: "Please wait!" });
    await this.state.instance.methods
      .enterLottery()
      .send({ from: this.state.account, value: this.state.web3.utils.toWei(this.state.value, "ether") });
    this.setState({ message: "Entered into Lottery" });
    //console.log(this.state.value);
  };

  pickWinner = async (e) => {
    this.setState({ winnerMessage: "Picking winner" });
    console.log(this.state.instance.methods);
    await this.state.instance.methods.pickWinner().send({ from: this.state.account });
    this.setState({ winnerMessage: "Winner Picked!" });
  };

  render() {
    return (
      <div className="container center">
        <p>Hey! The contract is running from account :{this.state.account}</p>
        <p>
          There are currently {this.state.totalPlayers} players and the lottery pool is {this.state.balance} Wei
        </p>
        <hr />
        <div className="section">
          <h3>Try your luck</h3>
          <p>Enter your your bet</p>
          <form onSubmit={this.handleSubmit}>
            <div className="input-field ">
              <input
                id="value"
                type="text"
                onChange={(e) => {
                  this.setState({ value: e.target.value });
                }}
                value={this.state.value}
              />
              <label htmlFor="value">Enter in Ethers</label>
            </div>
            <div className="input-field ">
              <button className="btn">Submit</button>
            </div>
            <p>{this.state.message}</p>
          </form>
        </div>
        <hr />
        <div className="section">
          <h3>Let's pick a winner!</h3>
          <button className="btn" onClick={this.pickWinner}>
            Pick Winner
          </button>
          <p>{this.state.winnerMessage}</p>
        </div>
      </div>
    );
  }
}

export default App;
