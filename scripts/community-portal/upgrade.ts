import { ethers, upgrades, run } from "hardhat";
import { COMMUNITY_PORTAL_PROXY_ADDRESS } from "../const";

async function main() {
  console.log("---------------------------------------------");
  console.log("--- Start CommunityPortal Upgrade -----------");
  console.log("---------------------------------------------");
  console.log("");

  console.log("--- Upgrade ---------------------------------");

  console.log("Upgrading...");

  const [deployer] = await ethers.getSigners();
  console.log("Upgrading contracts with account: ", deployer.address);
  console.log(
    "Upgrade CommunityPortalProxy address: ",
    COMMUNITY_PORTAL_PROXY_ADDRESS,
  );

  const CommunityPortal = await ethers.getContractFactory("CommunityPortal");
  const communityPortalProxy = await upgrades.upgradeProxy(
    COMMUNITY_PORTAL_PROXY_ADDRESS,
    CommunityPortal,
  );
  await communityPortalProxy.deployed();
  console.log(
    "Upgraded CommunityPortal implementation:",
    await upgrades.erc1967.getImplementationAddress(
      COMMUNITY_PORTAL_PROXY_ADDRESS,
    ),
  );

  console.log("Completed upgrade");

  console.log("--- Verify ----------------------------------");

  console.log("Verifying...");

  await run("verify:verify", {
    address: COMMUNITY_PORTAL_PROXY_ADDRESS,
    constructorArguments: [],
  });

  console.log("Completed verification");

  console.log("");
  console.log("---------------------------------------------");
  console.log("--- End CommunityPortal Upgrade -------------");
  console.log("---------------------------------------------");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
