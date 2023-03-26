import { ethers, run } from "hardhat";
import { calcMaxGas } from "../../utils/gas-estimation";

async function main() {
  console.log("---------------------------------------------");
  console.log("--- Start QuestCheckerCreater Deploy --------");
  console.log("---------------------------------------------");
  console.log("");

  console.log("--- Deploy ----------------------------------");

  console.log("Deploying...");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account: ", deployer.address);

  const QuestCheckerCreater = await ethers.getContractFactory(
    "QuestCheckerCreater",
  );
  const questCheckerCreater = await QuestCheckerCreater.deploy(
    await calcMaxGas(false),
  );
  await questCheckerCreater.deployed();
  console.log(
    "Deployed QuestCheckerCreater address: ",
    questCheckerCreater.address,
  );

  console.log("Completed deployment");

  // デプロイ完了直後にverifyすると失敗するので10秒待つ
  console.log("Waiting for 10 seconds before verification...");
  await new Promise((resolve) => setTimeout(resolve, 10000));

  console.log("--- Verify ----------------------------------");

  console.log("Verifying...");

  await run("verify:verify", {
    address: questCheckerCreater.address,
    constructorArguments: [],
  });

  console.log("Completed verification");

  console.log("---------------------------------------------");
  console.log("--- End QuestCheckerCreater Deploy ----------");
  console.log("---------------------------------------------");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
