import { ethers } from "hardhat";

async function main() {
  console.log("---------------------------------------------");
  console.log("--- Start QuestCheckerERC721 Deploy ---------");
  console.log("---------------------------------------------");
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account: ", deployer.address);
  const QuestCheckerERC721 = await ethers.getContractFactory(
    "QuestCheckerERC721"
  );
  const erc721 = ethers.constants.AddressZero;
  const questBoard = ethers.constants.AddressZero;
  const questCheckerERC721 = await QuestCheckerERC721.deploy(
    erc721,
    questBoard
  );
  await questCheckerERC721.deployed();
  console.log("Deployed address: ", questCheckerERC721.address);
  console.log("---------------------------------------------");
  console.log("--- End QuestCheckerERC721 Deploy -----------");
  console.log("---------------------------------------------");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
