pragma solidity ^0.4.17;

contract Lottery{
    address public manager;

    address[] public playerList;

    function Lottery() public {
        manager = msg.sender;
    }

    function enter() public payable {
        require(msg.value > .011 ether); // default is wei

        playerList.push(msg.sender);
    }

    function random() private view returns (uint){
        return uint(keccak256(block.difficulty,now,playerList)); //random number
    }

    function pickWinner() public restricted {

        uint index = random() % playerList.length;

        // transfer is used to when type is address. it help address recieve money. 
        // this is instance of contract
        playerList[index].transfer(this.balance); 
        playerList = new address[](0);//create new array address with initial number element is 0. if 3 it will be [0x00000, 0x00000, 0x00000]
    }

    modifier restricted(){ // modifier function is help share logic and reduce number of line code
        require(msg.sender == manager);// if false: this funtions will throw a error. if true: go ahead
        _;
    }

    function getPlayerList() public view returns (address[]){
        return playerList;
    }
}