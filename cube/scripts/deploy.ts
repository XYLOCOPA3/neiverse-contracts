import axios from "axios";
import { ethers } from "hardhat";

const args = require("../argument");

type CubeArgs = {
  prizePoapAddress: string;
};

const toType = (args: any[]): CubeArgs => {
  const cubeArgs: CubeArgs = {
    prizePoapAddress: args[0],
  };
  return cubeArgs;
};

async function main() {
  console.log("---------------------------------------------");
  console.log("--- Start Cube Deploy -----------------------");
  console.log("---------------------------------------------");

  console.log("");
  console.log("--- デプロイ ---------------------------------");
  console.log("デプロイ中...");
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account: ", deployer.address);
  const cubeArgs = toType(args);
  const Cube = await ethers.getContractFactory("Cube");
  const { maxFeePerGas, maxPriorityFeePerGas } = await calcMaxGas(false);
  const cube = await Cube.deploy(cubeArgs.prizePoapAddress, {
    maxFeePerGas,
    maxPriorityFeePerGas,
  });
  await cube.deployed();
  console.log("Deployed address: ", cube.address);
  console.log("デプロイ完了");

  console.log("");
  console.log("---------------------------------------------");
  console.log("--- End Cube Deploy -------------------------");
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
