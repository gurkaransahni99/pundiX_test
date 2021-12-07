// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract mPUNDIX is ERC20 {
    constructor(uint256 initialSupply) public ERC20("mPUNDIX Token", "mPUNDIX") {
        _mint(msg.sender, initialSupply);
    }
}