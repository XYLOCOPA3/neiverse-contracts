import { ethers, upgrades, run } from "hardhat";
import { QUEST_BOARD_PROXY_ADDRESS } from "../const";

async function main() {
  console.log("---------------------------------------------");
  console.log("--- Start QuestBoard Upgrade -----------------");
  console.log("---------------------------------------------");
  console.log("");

  console.log("--- Upgrade ---------------------------------");

  console.log("Upgrading...");

  const [deployer] = await ethers.getSigners();
  console.log("Upgrading contracts with account: ", deployer.address);
  console.log("Upgrade QuestBoardProxy address: ", QUEST_BOARD_PROXY_ADDRESS);

  const QuestBoard = await ethers.getContractFactory("QuestBoard");
  const questBoardProxy = await upgrades.upgradeProxy(
    QUEST_BOARD_PROXY_ADDRESS,
    QuestBoard,
  );
  await questBoardProxy.deployed();
  console.log(
    "Upgraded QuestBoard implementation:",
    await upgrades.erc1967.getImplementationAddress(QUEST_BOARD_PROXY_ADDRESS),
  );

  console.log("Completed upgrade");

  console.log("--- Verify ----------------------------------");

  console.log("Verifying...");

  await run("verify:verify", {
    address: QUEST_BOARD_PROXY_ADDRESS,
    constructorArguments: [],
  });

  console.log("Completed verification");

  console.log("");
  console.log("---------------------------------------------");
  console.log("--- End QuestBoard Upgrade -------------------");
  console.log("---------------------------------------------");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
