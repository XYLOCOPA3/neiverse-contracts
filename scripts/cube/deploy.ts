import { ethers, upgrades, run } from "hardhat";
import { PRIZE_POAP_PROXY_ADDRESS } from "../const";

async function main() {
  console.log("---------------------------------------------");
  console.log("--- Start Cube Deploy -----------------------");
  console.log("---------------------------------------------");
  console.log("");

  console.log("--- Deploy ----------------------------------");

  console.log("Deploying...");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account: ", deployer.address);

  const Cube = await ethers.getContractFactory("Cube");
  const cubeProxy = await upgrades.deployProxy(
    Cube,
    [PRIZE_POAP_PROXY_ADDRESS],
    {
      kind: "uups",
      initializer: "initialize",
    },
  );
  await cubeProxy.deployed();
  console.log("Deployed CubeProxy address: ", cubeProxy.address);
  console.log(
    "Cube implementation deployed to:",
    await upgrades.erc1967.getImplementationAddress(cubeProxy.address),
  );

  console.log("Completed deployment");

  // デプロイ完了直後にverifyすると失敗するので10秒待つ
  console.log("Waiting for 10 seconds before verification...");
  await new Promise((resolve) => setTimeout(resolve, 10000));

  console.log("--- Verify ----------------------------------");

  console.log("Verifying...");

  try {
    await run("verify:verify", {
      address: cubeProxy.address,
      constructorArguments: [],
    });
  } catch (e) {
    console.log(e);
  }

  console.log("Completed verification");

  console.log("");
  console.log("---------------------------------------------");
  console.log("--- End Cube Deploy -------------------------");
  console.log("---------------------------------------------");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
