// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract PayPerUse {
    address public owner;
    
    // Station rates in wei per minute
    mapping(uint256 => uint256) public stationRates;
    
    // Events
    event PaymentReceived(address indexed user, uint256 indexed stationId, uint256 amount, uint256 durationMinutes);
    event RateUpdated(uint256 indexed stationId, uint256 newRate);
    
    constructor() {
        owner = msg.sender;
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    // Set rate for a charging station
    function setRate(uint256 stationId, uint256 ratePerMinute) external onlyOwner {
        stationRates[stationId] = ratePerMinute;
        emit RateUpdated(stationId, ratePerMinute);
    }
    
    // Get rate for a charging station
    function getRate(uint256 stationId) external view returns (uint256) {
        return stationRates[stationId];
    }
    
    // Pay for charging
    function pay(uint256 stationId, uint256 durationMinutes) external payable {
        uint256 rate = stationRates[stationId];
        require(rate > 0, "Station rate not set");
        
        uint256 requiredAmount = rate * durationMinutes;
        require(msg.value >= requiredAmount, "Insufficient payment");
        
        // Process payment
        emit PaymentReceived(msg.sender, stationId, msg.value, durationMinutes);
        
        // Return excess payment if any
        uint256 excess = msg.value - requiredAmount;
        if (excess > 0) {
            payable(msg.sender).transfer(excess);
        }
    }
    
    // Withdraw funds (only owner)
    function withdraw() external onlyOwner {
        payable(owner).transfer(address(this).balance);
    }
}

