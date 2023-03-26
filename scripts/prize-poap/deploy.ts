import { ethers, upgrades, run } from "hardhat";
import {
  COMMUNITY_PORTAL_PROXY_ADDRESS,
  PRIZE_POAP_BASE_URI,
  QUEST_BOARD_PROXY_ADDRESS,
} from "../const";

async function main() {
  console.log("---------------------------------------------");
  console.log("--- Start PrizePoap Deploy ------------------");
  console.log("---------------------------------------------");
  console.log("");

  console.log("--- Deploy ----------------------------------");

  console.log("Deploying...");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account: ", deployer.address);

  const PrizePoap = await ethers.getContractFactory("PrizePoap");
  const prizePoapProxy = await upgrades.deployProxy(
    PrizePoap,
    [
      COMMUNITY_PORTAL_PROXY_ADDRESS,
      QUEST_BOARD_PROXY_ADDRESS,
      PRIZE_POAP_BASE_URI,
    ],
    {
      kind: "uups",
      initializer: "initialize",
    },
  );
  await prizePoapProxy.deployed();
  console.log("Deployed PrizePoapProxy address: ", prizePoapProxy.address);
  console.log(
    "PrizePoap implementation deployed to:",
    await upgrades.erc1967.getImplementationAddress(prizePoapProxy.address),
  );

  console.log("Completed deployment");

  // デプロイ完了直後にverifyすると失敗するので10秒待つ
  console.log("Waiting for 10 seconds before verification...");
  await new Promise((resolve) => setTimeout(resolve, 10000));

  console.log("--- Verify ----------------------------------");

  console.log("Verifying...");

  await run("verify:verify", {
    address: prizePoapProxy.address,
    constructorArguments: [],
  });

  console.log("Completed verification");

  console.log("");
  console.log("---------------------------------------------");
  console.log("--- End PrizePoap Deploy --------------------");
  console.log("---------------------------------------------");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
