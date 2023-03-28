import { ethers, upgrades, run } from "hardhat";
import { COMMUNITY_PASSPORT_BEACON_ADDRESS } from "../const";

async function main() {
  console.log("---------------------------------------------");
  console.log("--- Start CommunityPassport Upgrade ---------");
  console.log("---------------------------------------------");
  console.log("");

  console.log("--- Upgrade ---------------------------------");

  console.log("Upgrading...");

  const [deployer] = await ethers.getSigners();
  console.log("Upgrading contracts with the account:", deployer.address);
  console.log(
    "Upgrade CommunityPassportBeacon address: ",
    COMMUNITY_PASSPORT_BEACON_ADDRESS,
  );

  const CommunityPassport = await ethers.getContractFactory(
    "CommunityPassport",
  );
  const communityPassportBeacon = await upgrades.upgradeBeacon(
    COMMUNITY_PASSPORT_BEACON_ADDRESS,
    CommunityPassport,
  );
  await communityPassportBeacon.deployed();
  console.log(
    "Upgraded CommunityPassport implementation:",
    await upgrades.beacon.getImplementationAddress(
      communityPassportBeacon.address,
    ),
  );

  console.log("Completed upgrade");

  // アップグレード完了直後にverifyすると失敗するので10秒待つ
  console.log("Waiting for 10 seconds before verification...");
  await new Promise((resolve) => setTimeout(resolve, 10000));

  console.log("--- Verify ----------------------------------");

  console.log("Verifying...");

  try {
    await run("verify:verify", {
      address: communityPassportBeacon.address,
      constructorArguments: [],
    });
  } catch (e) {
    console.log(e);
  }

  console.log("Completed verification");

  console.log("");
  console.log("---------------------------------------------");
  console.log("--- End CommunityPassport Upgrade -----------");
  console.log("---------------------------------------------");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
