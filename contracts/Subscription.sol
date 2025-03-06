// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract Subscription {
    address public owner;
    
    enum PlanType { Weekly, Monthly, Yearly }
    
    struct Plan {
        uint256 price;
        uint256 durationDays;
    }
    
    struct UserSubscription {
        PlanType planType;
        uint256 expiryDate;
        bool isActive;
    }
    
    // Plan details
    mapping(PlanType => Plan) public plans;
    
    // User subscriptions
    mapping(address => UserSubscription) public userSubscriptions;
    
    // Events
    event SubscriptionPurchased(address indexed user, PlanType planType, uint256 amount, uint256 expiryDate);
    event PlanUpdated(PlanType planType, uint256 newPrice, uint256 newDuration);
    
    constructor() {
        owner = msg.sender;
        
        // Initialize plans
        plans[PlanType.Weekly] = Plan(0.01 ether, 7);
        plans[PlanType.Monthly] = Plan(0.03 ether, 30);
        plans[PlanType.Yearly] = Plan(0.25 ether, 365);
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    // Update plan details
    function updatePlan(PlanType planType, uint256 price, uint256 durationDays) external onlyOwner {
        plans[planType].price = price;
        plans[planType].durationDays = durationDays;
        emit PlanUpdated(planType, price, durationDays);
    }
    
    // Get plan price
    function getPlanPrice(PlanType planType) external view returns (uint256) {
        return plans[planType].price;
    }
    
    // Subscribe to a plan
    function subscribe(PlanType planType) external payable {
        Plan memory plan = plans[planType];
        require(plan.price > 0, "Invalid plan");
        require(msg.value >= plan.price, "Insufficient payment");
        
        // Calculate expiry date
        uint256 expiryDate;
        UserSubscription storage userSub = userSubscriptions[msg.sender];
        
        if (userSub.isActive && userSub.expiryDate > block.timestamp) {
            // Extend existing subscription
            expiryDate = userSub.expiryDate + (plan.durationDays * 1 days);
        } else {
            // New subscription
            expiryDate = block.timestamp + (plan.durationDays * 1 days);
        }
        
        // Update user subscription
        userSubscriptions[msg.sender] = UserSubscription(
            planType,
            expiryDate,
            true
        );
        
        emit SubscriptionPurchased(msg.sender, planType, msg.value, expiryDate);
        
        // Return excess payment if any
        uint256 excess = msg.value - plan.price;
        if (excess > 0) {
            payable(msg.sender).transfer(excess);
        }
    }
    
    // Check if user is subscribed
    function isSubscribed(address user) external view returns (bool) {
        UserSubscription memory userSub = userSubscriptions[user];
        return userSub.isActive && userSub.expiryDate > block.timestamp;
    }
    
    // Get user subscription details
    function getUserSubscription(address user) external view returns (PlanType planType, uint256 expiryDate) {
        UserSubscription memory userSub = userSubscriptions[user];
        return (userSub.planType, userSub.expiryDate);
    }
    
    // Withdraw funds (only owner)
    function withdraw() external onlyOwner {
        payable(owner).transfer(address(this).balance);
    }
}

