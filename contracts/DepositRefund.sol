// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract DepositRefund {
    address public owner;
    
    // User balances
    mapping(address => uint256) public balances;
    
    // Events
    event Deposited(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    
    constructor() {
        owner = msg.sender;
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    // Deposit funds
    function deposit() external payable {
        require(msg.value > 0, "Deposit amount must be greater than 0");
        
        balances[msg.sender] += msg.value;
        emit Deposited(msg.sender, msg.value);
    }
    
    // Withdraw funds
    function withdraw(uint256 amount) external {
        require(amount > 0, "Withdrawal amount must be greater than 0");
        require(balances[msg.sender] >= amount, "Insufficient balance");
        
        balances[msg.sender] -= amount;
        payable(msg.sender).transfer(amount);
        
        emit Withdrawn(msg.sender, amount);
    }
    
    // Get user balance
    function getBalance(address user) external view returns (uint256) {
        return balances[user];
    }
    
    // Admin function to withdraw contract funds (only owner)
    function adminWithdraw() external onlyOwner {
        payable(owner).transfer(address(this).balance);
    }
}

