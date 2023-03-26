import { ethers, upgrades, run } from "hardhat";
import {
  COMMUNITY_PORTAL_PROXY_ADDRESS,
  PRIZE_POAP_PROXY_ADDRESS,
  QUEST_CHECKER_CREATER_ADDRESS,
} from "../const";

async function main() {
  console.log("---------------------------------------------");
  console.log("--- Start QuestBoard Deploy -----------------");
  console.log("---------------------------------------------");
  console.log("");

  console.log("--- Deploy ----------------------------------");

  console.log("Deploying...");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account: ", deployer.address);

  const QuestBoard = await ethers.getContractFactory("QuestBoard");
  const qustBoardProxy = await upgrades.deployProxy(
    QuestBoard,
    [
      COMMUNITY_PORTAL_PROXY_ADDRESS,
      QUEST_CHECKER_CREATER_ADDRESS,
      PRIZE_POAP_PROXY_ADDRESS,
    ],
    {
      kind: "uups",
      initializer: "initialize",
    },
  );
  await qustBoardProxy.deployed();
  console.log("Deployed QuestBoardProxy address: ", qustBoardProxy.address);
  console.log(
    "QuestBoard implementation deployed to:",
    await upgrades.erc1967.getImplementationAddress(qustBoardProxy.address),
  );

  console.log("Completed deployment");

  // デプロイ完了直後にverifyすると失敗するので10秒待つ
  console.log("Waiting for 10 seconds before verification...");
  await new Promise((resolve) => setTimeout(resolve, 10000));

  console.log("--- Verify ----------------------------------");

  console.log("Verifying...");

  await run("verify:verify", {
    address: qustBoardProxy.address,
    constructorArguments: [],
  });

  console.log("Completed verification");

  console.log("");
  console.log("---------------------------------------------");
  console.log("--- End QuestBoard Deploy -------------------");
  console.log("---------------------------------------------");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
