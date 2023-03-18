import axios from "axios";
import { ethers } from "hardhat";

const args = require("../argument");

type QuestPoapArgs = {
  name: string;
};

const toType = (args: any[]): QuestPoapArgs => {
  const questPoapArgs: QuestPoapArgs = {
    name: args[0],
  };
  return questPoapArgs;
};

async function main() {
  console.log("---------------------------------------------");
  console.log("--- Start QuestPoap Deploy ------------------");
  console.log("---------------------------------------------");
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account: ", deployer.address);
  const questPoapArgs = toType(args);
  const { maxFeePerGas, maxPriorityFeePerGas } = await calcMaxGas(false);
  const QuestPoap = await ethers.getContractFactory("QuestPoap");
  const questPoap = await QuestPoap.deploy(questPoapArgs.name, {
    maxFeePerGas,
    maxPriorityFeePerGas,
  });
  await questPoap.deployed();
  console.log("Deployed address: ", questPoap.address);
  console.log("---------------------------------------------");
  console.log("--- End QuestPoap Deploy --------------------");
  console.log("---------------------------------------------");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

const calcMaxGas = async (isProd: boolean) => {
  let maxFeePerGas = ethers.BigNumber.from(40000000000); // fallback to 40 gwei
  let maxPriorityFeePerGas = ethers.BigNumber.from(40000000000); // fallback to 40 gwei
  try {
    const { data } = await axios({
      method: "get",
      url: isProd
        ? "https://gasstation-mainnet.matic.network/v2"
        : "https://gasstation-mumbai.matic.today/v2",
    });
    maxFeePerGas = ethers.utils.parseUnits(
      Math.ceil(data.fast.maxFee) + "",
      "gwei"
    );
    maxPriorityFeePerGas = ethers.utils.parseUnits(
      Math.ceil(data.fast.maxPriorityFee) + "",
      "gwei"
    );
  } catch {
    throw Error("ガス代を計算できません。");
  }
  return { maxFeePerGas, maxPriorityFeePerGas };
};
