import { ethers } from "ethers"
import { useWeb3 } from "@/hooks/use-web3"

// ABI for the Deposit and Refund contract
const DepositRefundABI = [
  "function deposit() payable",
  "function withdraw(uint256 amount)",
  "function getBalance(address user) view returns (uint256)",
  "event Deposited(address indexed user, uint256 amount)",
  "event Withdrawn(address indexed user, uint256 amount)",
]

// Contract address (would be deployed on the blockchain)
const CONTRACT_ADDRESS = "0xabcdef123456789abcdef123456789abcdef123c"

export function useDepositRefundContract() {
  const { provider, signer, account } = useWeb3()

  const getContract = () => {
    if (!provider || !signer) throw new Error("Wallet not connected")

    return new ethers.Contract(CONTRACT_ADDRESS, DepositRefundABI, signer)
  }

  const getBalance = async () => {
    if (!account) return "0"

    const contract = getContract()
    const balance = await contract.getBalance(account)
    return ethers.formatEther(balance)
  }

  const deposit = async (amount: string) => {
    const contract = getContract()

    const tx = await contract.deposit({
      value: ethers.parseEther(amount),
    })

    return await tx.wait()
  }

  const withdraw = async (amount: string) => {
    const contract = getContract()

    const tx = await contract.withdraw(ethers.parseEther(amount))

    return await tx.wait()
  }

  return {
    getBalance,
    deposit,
    withdraw,
  }
}

