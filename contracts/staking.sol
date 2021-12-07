pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract Staking is ERC20("mPURSE Token", "mPURSE"){

    using SafeERC20 for IERC20;
    using SafeMath for uint;

    IERC20 public mPUNDIX;

    mapping (address => uint) public mStakingAmount;

    constructor(address _mPUNDIX) public {
        mPUNDIX = IERC20(_mPUNDIX);
    }

    function deposit(uint amount) external {
        mPUNDIX.safeTransferFrom(msg.sender, address(this), amount);
        mStakingAmount[msg.sender] = mStakingAmount[msg.sender].add(amount);
        _mint(msg.sender, amount);
    }

    function withdraw(uint amount) external {
        mStakingAmount[msg.sender] = mStakingAmount[msg.sender].sub(amount);
        _burn(msg.sender, amount);
        mPUNDIX.safeTransfer(msg.sender, amount);
    }
}