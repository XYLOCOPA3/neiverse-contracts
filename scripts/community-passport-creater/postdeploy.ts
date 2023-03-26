import { ethers } from "hardhat";
import { calcMaxGas } from "../../utils/gas-estimation";
import {
  COMMUNITY_PASSPORT_BEACON_ADDRESS,
  COMMUNITY_PASSPORT_CREATER_ADDRESS,
} from "../const";

async function main() {
  console.log("---------------------------------------------");
  console.log("--- Start CommunityPassportCreater Init -----");
  console.log("---------------------------------------------");
  console.log("");

  console.log("--- Init ------------------------------------");

  console.log("Init...");

  const [deployer] = await ethers.getSigners();
  console.log("Initialize contracts with account: ", deployer.address);

  const CommunityPassportCreater = await ethers.getContractFactory(
    "CommunityPassportCreater",
  );
  const communityPassportCreater = CommunityPassportCreater.attach(
    COMMUNITY_PASSPORT_CREATER_ADDRESS,
  );

  console.log("Set CommunityPassportBeacon address...");
  await (
    await communityPassportCreater.setCommunityPassportBeacon(
      COMMUNITY_PASSPORT_BEACON_ADDRESS,
      await calcMaxGas(false),
    )
  ).wait();
  console.log(
    "Set CommunityPassportBeacon address:",
    COMMUNITY_PASSPORT_BEACON_ADDRESS,
  );

  console.log("Completed init");

  console.log("");
  console.log("---------------------------------------------");
  console.log("--- End CommunityPassportCreater Init -------");
  console.log("---------------------------------------------");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
