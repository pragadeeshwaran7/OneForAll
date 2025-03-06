import { ethers } from "ethers"
import { useWeb3 } from "@/hooks/use-web3"

// ABI for the Subscription contract
const SubscriptionABI = [
  "function subscribe(uint8 planType) payable",
  "function getPlanPrice(uint8 planType) view returns (uint256)",
  "function isSubscribed(address user) view returns (bool)",
  "function getUserSubscription(address user) view returns (uint8 planType, uint256 expiryDate)",
  "event SubscriptionPurchased(address indexed user, uint8 planType, uint256 amount, uint256 expiryDate)",
]

// Contract address (would be deployed on the blockchain)
const CONTRACT_ADDRESS = "0x987654321abcdef987654321abcdef98765432b"

export enum PlanType {
  Weekly = 0,
  Monthly = 1,
  Yearly = 2,
}

export function useSubscriptionContract() {
  const { provider, signer, account } = useWeb3()

  const getContract = () => {
    if (!provider || !signer) throw new Error("Wallet not connected")

    return new ethers.Contract(CONTRACT_ADDRESS, SubscriptionABI, signer)
  }

  const getPlanPrice = async (planType: PlanType) => {
    const contract = getContract()
    const price = await contract.getPlanPrice(planType)
    return ethers.formatEther(price)
  }

  const subscribe = async (planType: PlanType, amount: string) => {
    const contract = getContract()

    const tx = await contract.subscribe(planType, {
      value: ethers.parseEther(amount),
    })

    return await tx.wait()
  }

  const checkSubscription = async () => {
    if (!account) return { isSubscribed: false }

    const contract = getContract()
    const isSubscribed = await contract.isSubscribed(account)

    if (!isSubscribed) return { isSubscribed: false }

    const subscription = await contract.getUserSubscription(account)
    return {
      isSubscribed: true,
      planType: subscription.planType,
      expiryDate: new Date(Number(subscription.expiryDate) * 1000),
    }
  }

  return {
    getPlanPrice,
    subscribe,
    checkSubscription,
  }
}

