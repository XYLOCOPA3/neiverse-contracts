import { ethers, upgrades, run } from "hardhat";
import { CUBE_PROXY_ADDRESS } from "../const";

async function main() {
  console.log("---------------------------------------------");
  console.log("--- Start Cube Upgrade ----------------------");
  console.log("---------------------------------------------");
  console.log("");

  console.log("--- Upgrade ---------------------------------");

  console.log("Upgrading...");

  const [deployer] = await ethers.getSigners();
  console.log("Upgrading contracts with account: ", deployer.address);
  console.log("Upgrade CubeProxy address: ", CUBE_PROXY_ADDRESS);

  const Cube = await ethers.getContractFactory("Cube");
  const cubeProxy = await upgrades.upgradeProxy(CUBE_PROXY_ADDRESS, Cube);
  await cubeProxy.deployed();
  console.log(
    "Upgraded Cube implementation:",
    await upgrades.erc1967.getImplementationAddress(CUBE_PROXY_ADDRESS),
  );

  console.log("Completed upgrade");

  console.log("--- Verify ----------------------------------");

  console.log("Verifying...");

  await run("verify:verify", {
    address: CUBE_PROXY_ADDRESS,
    constructorArguments: [],
  });

  console.log("Completed verification");

  console.log("");
  console.log("---------------------------------------------");
  console.log("--- End Cube Upgrade ------------------------");
  console.log("---------------------------------------------");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
