import { ethers, run } from "hardhat";
import { calcMaxGas } from "../../utils/gas-estimation";
import { COMMUNITY_PASSPORT_BEACON_ADDRESS } from "../const";

async function main() {
  console.log("---------------------------------------------");
  console.log("--- Start CommunityPassportCreater Deploy ---");
  console.log("---------------------------------------------");
  console.log("");

  console.log("--- Deploy ----------------------------------");

  console.log("Deploying...");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account: ", deployer.address);

  const CommunityPassportCreater = await ethers.getContractFactory(
    "CommunityPassportCreater",
  );
  const communityPassportCreater = await CommunityPassportCreater.deploy(
    COMMUNITY_PASSPORT_BEACON_ADDRESS,
    await calcMaxGas(false),
  );
  await communityPassportCreater.deployed();
  console.log(
    "CommunityPassportCreater deployed to:",
    communityPassportCreater.address,
  );

  console.log("Completed deployment");

  // デプロイ完了直後にverifyすると失敗するので10秒待つ
  console.log("Waiting for 10 seconds before verification...");
  await new Promise((resolve) => setTimeout(resolve, 10000));

  console.log("--- Verify ----------------------------------");

  console.log("Verifying...");

  await run("verify:verify", {
    address: communityPassportCreater.address,
    constructorArguments: [COMMUNITY_PASSPORT_BEACON_ADDRESS],
  });

  console.log("Completed verification");

  console.log("");
  console.log("---------------------------------------------");
  console.log("--- End CommunityPassportCreater Deploy -----");
  console.log("---------------------------------------------");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
