import { ethers, upgrades, run } from "hardhat";
import {
  COMMUNITY_PASSPORT_CREATER_ADDRESS,
  QUEST_BOARD_PROXY_ADDRESS,
} from "../const";

async function main() {
  console.log("---------------------------------------------");
  console.log("--- Start CommunityPortal Deploy ------------");
  console.log("---------------------------------------------");
  console.log("");

  console.log("--- Deploy ----------------------------------");

  console.log("Deploying...");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account: ", deployer.address);

  const CommunityPortal = await ethers.getContractFactory("CommunityPortal");
  const communityPortalProxy = await upgrades.deployProxy(
    CommunityPortal,
    [COMMUNITY_PASSPORT_CREATER_ADDRESS, QUEST_BOARD_PROXY_ADDRESS],
    {
      kind: "uups",
      initializer: "initialize",
    },
  );
  await communityPortalProxy.deployed();
  console.log(
    "Deployed CommunityPortalProxy address: ",
    communityPortalProxy.address,
  );
  console.log(
    "CommunityPortal implementation deployed to:",
    await upgrades.erc1967.getImplementationAddress(
      communityPortalProxy.address,
    ),
  );

  console.log("Completed deployment");

  // デプロイ完了直後にverifyすると失敗するので10秒待つ
  console.log("Waiting for 10 seconds before verification...");
  await new Promise((resolve) => setTimeout(resolve, 10000));

  console.log("--- Verify ----------------------------------");

  console.log("Verifying...");

  await run("verify:verify", {
    address: communityPortalProxy.address,
    constructorArguments: [],
  });

  console.log("Completed verification");

  console.log("");
  console.log("---------------------------------------------");
  console.log("--- End CommunityPortal Deploy --------------");
  console.log("---------------------------------------------");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
