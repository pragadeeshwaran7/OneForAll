import { ethers } from "ethers"
import { useWeb3 } from "@/hooks/use-web3"

// ABI for the Pay Per Use contract
const PayPerUseABI = [
  "function pay(uint256 stationId, uint256 durationMinutes) payable",
  "function getRate(uint256 stationId) view returns (uint256)",
  "event PaymentReceived(address indexed user, uint256 indexed stationId, uint256 amount, uint256 durationMinutes)",
]

// Contract address (would be deployed on the blockchain)
const CONTRACT_ADDRESS = "0x123456789abcdef123456789abcdef123456789a"

export function usePayPerUseContract() {
  const { provider, signer } = useWeb3()

  const getContract = () => {
    if (!provider || !signer) throw new Error("Wallet not connected")

    return new ethers.Contract(CONTRACT_ADDRESS, PayPerUseABI, signer)
  }

  const getRate = async (stationId: number) => {
    const contract = getContract()
    const rate = await contract.getRate(stationId)
    return ethers.formatEther(rate)
  }

  const makePayment = async (stationId: number, durationMinutes: number, amount: string) => {
    const contract = getContract()

    const tx = await contract.pay(stationId, durationMinutes, {
      value: ethers.parseEther(amount),
    })

    return await tx.wait()
  }

  return {
    getRate,
    makePayment,
  }
}

