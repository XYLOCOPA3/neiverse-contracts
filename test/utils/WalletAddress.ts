import { ethers } from "hardhat";

export async function getWalletAddress() {
  const [deployer, admin1, admin2, user1, user2, user3] =
    await ethers.getSigners();

  return {
    deployer,
    admin1,
    admin2,
    user1,
    user2,
    user3,
  };
}
