pragma solidity ^0.6.0;


contract Lottery {
    address public owner;
    address[] public players;

    constructor() public {
        owner = msg.sender;
    }

    modifier restricted() {
        require(msg.sender == owner, "Only the Owner can call this");
        _;
    }

    function enterLottery() public payable {
        require(msg.value > 0.2 ether, "Should have more than min value");
        players.push(msg.sender);
    }

    function random() private view returns (uint256) {
        return
            uint256(
                keccak256(
                    abi.encodePacked(block.difficulty, block.timestamp, players)
                )
            );
    }

    function pickWinner() public restricted {
        uint256 index = random() % players.length;
        payable(players[index]).transfer(address(this).balance);
        players = new address[](0);
    }

    function playersLength() public view returns (uint256) {
        return players.length;
    }

    function allPlayers() public view returns (address[] memory) {
        return players;
    }
}
