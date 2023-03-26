import { ethers, run } from "hardhat";
import { calcMaxGas } from "../../utils/gas-estimation";
import { QUEST_POAP_EXTERNAL_LINK, QUEST_POAP_NAME } from "../const";

async function main() {
  console.log("---------------------------------------------");
  console.log("--- Start QuestPoap Deploy ------------------");
  console.log("---------------------------------------------");
  console.log("");

  console.log("--- Deploy ----------------------------------");

  console.log("Deploying...");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account: ", deployer.address);

  const QuestPoap = await ethers.getContractFactory("QuestPoap");
  const questPoap = await QuestPoap.deploy(
    QUEST_POAP_NAME,
    QUEST_POAP_EXTERNAL_LINK,
    await calcMaxGas(false),
  );
  await questPoap.deployed();
  console.log("Deployed QuestPoap address: ", questPoap.address);

  console.log("Completed deployment");

  // デプロイ完了直後にverifyすると失敗するので10秒待つ
  console.log("Waiting for 10 seconds before verification...");
  await new Promise((resolve) => setTimeout(resolve, 10000));

  console.log("--- Verify ----------------------------------");

  console.log("Verifying...");

  await run("verify:verify", {
    address: questPoap.address,
    constructorArguments: [],
  });

  console.log("Completed verification");

  console.log("");
  console.log("---------------------------------------------");
  console.log("--- End QuestPoap Deploy --------------------");
  console.log("---------------------------------------------");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
