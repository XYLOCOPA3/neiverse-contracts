import axios from "axios";
import { ethers } from "hardhat";

const args = require("../argument");

type CommunityPassportArgs = {
  name: string;
  symbol: string;
  baseURI: string;
  initialContractURI: string;
  communityId: number;
};

const toType = (args: any[]): CommunityPassportArgs => {
  const communityPassportArgs: CommunityPassportArgs = {
    name: args[0],
    symbol: args[1],
    baseURI: args[2],
    initialContractURI: args[3],
    communityId: args[4],
  };
  return communityPassportArgs;
};

async function main() {
  console.log("---------------------------------------------");
  console.log("--- Start CommunityPassport Deploy ----------");
  console.log("---------------------------------------------");

  console.log("");
  console.log("--- デプロイ ---------------------------------");
  console.log("デプロイ中...");
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account: ", deployer.address);
  const communityPassportArgs = toType(args);
  const CommunityPassport = await ethers.getContractFactory(
    "CommunityPassport"
  );
  const { maxFeePerGas, maxPriorityFeePerGas } = await calcMaxGas(false);
  const communityPassport = await CommunityPassport.deploy(
    communityPassportArgs.name,
    communityPassportArgs.symbol,
    communityPassportArgs.baseURI,
    communityPassportArgs.initialContractURI,
    communityPassportArgs.communityId,
    {
      maxFeePerGas,
      maxPriorityFeePerGas,
    }
  );
  await communityPassport.deployed();
  console.log("Deployed address: ", communityPassport.address);
  console.log("デプロイ完了");

  console.log("");
  console.log("---------------------------------------------");
  console.log("--- End CommunityPassport Deploy ------------");
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
