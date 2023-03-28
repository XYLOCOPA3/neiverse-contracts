import { ethers, run } from "hardhat";
import { calcMaxGas } from "../../utils/gas-estimation";
import { QUEST_BOARD_PROXY_ADDRESS, TARGET_ERC721_ADDRESS } from "../const";

async function main() {
  console.log("---------------------------------------------");
  console.log("--- Start QuestCheckerERC721 Deploy ---------");
  console.log("---------------------------------------------");
  console.log("");

  console.log("--- Deploy ----------------------------------");

  console.log("Deploying...");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account: ", deployer.address);

  const QuestCheckerERC721 = await ethers.getContractFactory(
    "QuestCheckerERC721",
  );
  const questCheckerERC721 = await QuestCheckerERC721.deploy(
    TARGET_ERC721_ADDRESS,
    QUEST_BOARD_PROXY_ADDRESS,
    await calcMaxGas(false),
  );
  await questCheckerERC721.deployed();
  console.log(
    "Deployed QuestCheckerERC721 address: ",
    questCheckerERC721.address,
  );

  console.log("Completed deployment");

  // デプロイ完了直後にverifyすると失敗するので10秒待つ
  console.log("Waiting for 10 seconds before verification...");
  await new Promise((resolve) => setTimeout(resolve, 10000));

  console.log("--- Verify ----------------------------------");

  console.log("Verifying...");

  try {
    await run("verify:verify", {
      address: questCheckerERC721.address,
      constructorArguments: [TARGET_ERC721_ADDRESS, QUEST_BOARD_PROXY_ADDRESS],
    });
  } catch (e) {
    console.log(e);
  }

  console.log("Completed verification");

  console.log("");
  console.log("---------------------------------------------");
  console.log("--- End QuestCheckerERC721 Deploy -----------");
  console.log("---------------------------------------------");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
