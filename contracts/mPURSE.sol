// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract mPURSE is ERC20 {
    address public owner;
    modifier ownerOnly {
        require(msg.sender == owner, "Only owner can call this function.");
        _;
    }
    constructor() public ERC20("mPURSE Token", "mPURSE") {
        owner = msg.sender;
    }

    function changeOwner(address newOwner) public ownerOnly {
        owner = newOwner;
    }

    function mint(address recipient, uint amount) external ownerOnly {
        _mint(recipient, amount);
    }

    function burn(address recipient, uint amount) external ownerOnly {
        _burn(recipient, amount);
    }
}