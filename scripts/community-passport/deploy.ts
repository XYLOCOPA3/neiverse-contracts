import { ethers, run, upgrades } from "hardhat";

async function main() {
  console.log("---------------------------------------------");
  console.log("--- Start CommunityPassport Deploy ----------");
  console.log("---------------------------------------------");
  console.log("");

  console.log("--- Deploy ----------------------------------");

  console.log("Deploying...");

  // デプロイアカウントを取得
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // ビーコンをデプロイ
  const CommunityPassport = await ethers.getContractFactory(
    "CommunityPassport",
  );
  const communityPassportBeacon = await upgrades.deployBeacon(
    CommunityPassport,
  );
  await communityPassportBeacon.deployed();
  console.log(
    "CommunityPassportBeacon deployed to:",
    communityPassportBeacon.address,
  );
  const communityPassportImplAddr =
    await upgrades.beacon.getImplementationAddress(
      communityPassportBeacon.address,
    );
  console.log(
    "CommunityPassport implementation deployed to:",
    communityPassportImplAddr,
  );

  console.log("Completed deployment");

  // デプロイ完了直後にverifyすると失敗するので10秒待つ
  console.log("Waiting for 10 seconds before verification...");
  await new Promise((resolve) => setTimeout(resolve, 10000));

  console.log("--- Verify ----------------------------------");

  console.log("Verifying...");

  await run("verify:verify", {
    address: communityPassportBeacon.address,
    constructorArguments: [],
  });

  console.log("Completed verification");

  console.log("");
  console.log("---------------------------------------------");
  console.log("--- End CommunityPassport Deploy ------------");
  console.log("---------------------------------------------");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
