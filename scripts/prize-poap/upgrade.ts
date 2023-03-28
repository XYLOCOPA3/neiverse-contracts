import { ethers, upgrades, run } from "hardhat";
import { PRIZE_POAP_PROXY_ADDRESS } from "../const";

async function main() {
  console.log("---------------------------------------------");
  console.log("--- Start PrizePoap Upgrade -----------------");
  console.log("---------------------------------------------");
  console.log("");

  console.log("--- Upgrade ---------------------------------");

  console.log("Upgrading...");

  const [deployer] = await ethers.getSigners();
  console.log("Upgrading contracts with account: ", deployer.address);
  console.log("Upgrade PrizePoapProxy address: ", PRIZE_POAP_PROXY_ADDRESS);

  const PrizePoap = await ethers.getContractFactory("PrizePoap");
  const prizePoapProxy = await upgrades.upgradeProxy(
    PRIZE_POAP_PROXY_ADDRESS,
    PrizePoap,
  );
  await prizePoapProxy.deployed();
  console.log(
    "Upgraded PrizePoap implementation:",
    await upgrades.erc1967.getImplementationAddress(PRIZE_POAP_PROXY_ADDRESS),
  );

  console.log("Completed upgrade");

  // アップグレード完了直後にverifyすると失敗するので10秒待つ
  console.log("Waiting for 10 seconds before verification...");
  await new Promise((resolve) => setTimeout(resolve, 10000));

  console.log("--- Verify ----------------------------------");

  console.log("Verifying...");

  try {
    await run("verify:verify", {
      address: PRIZE_POAP_PROXY_ADDRESS,
      constructorArguments: [],
    });
  } catch (e) {
    console.log(e);
  }

  console.log("Completed verification");

  console.log("");
  console.log("---------------------------------------------");
  console.log("--- End PrizePoap Upgrade -------------------");
  console.log("---------------------------------------------");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
