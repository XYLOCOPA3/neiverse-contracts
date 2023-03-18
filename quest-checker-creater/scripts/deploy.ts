import { ethers } from "hardhat";

async function main() {
  console.log("---------------------------------------------");
  console.log("--- Start QuestCheckerCreater Deploy --------");
  console.log("---------------------------------------------");
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account: ", deployer.address);
  const QuestCheckerCreater = await ethers.getContractFactory(
    "QuestCheckerCreater"
  );
  const questCheckerCreater = await QuestCheckerCreater.deploy();
  await questCheckerCreater.deployed();
  console.log("Deployed address: ", questCheckerCreater.address);
  console.log("---------------------------------------------");
  console.log("--- End QuestCheckerCreater Deploy ----------");
  console.log("---------------------------------------------");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
