import axios from "axios";
import { ethers } from "hardhat";

const args = require("../argument");

type CommunityPortalArgs = {
  passportCreaterAddress: string;
  questBoardAddress: string;
};

const toType = (args: any[]): CommunityPortalArgs => {
  const communityPortalArgs: CommunityPortalArgs = {
    passportCreaterAddress: args[0],
    questBoardAddress: args[1],
  };
  return communityPortalArgs;
};

async function main() {
  console.log("---------------------------------------------");
  console.log("--- Start CommunityPortal Deploy ------------");
  console.log("---------------------------------------------");

  console.log("");
  console.log("--- デプロイ ---------------------------------");
  console.log("デプロイ中...");
  const communityPortalArgs = toType(args);
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account: ", deployer.address);
  const CommunityPortal = await ethers.getContractFactory("CommunityPortal");
  const { maxFeePerGas, maxPriorityFeePerGas } = await calcMaxGas(false);
  const communityPortal = await CommunityPortal.deploy(
    communityPortalArgs.passportCreaterAddress,
    communityPortalArgs.questBoardAddress,
    {
      maxFeePerGas,
      maxPriorityFeePerGas,
    }
  );
  await communityPortal.deployed();
  console.log("Deployed address: ", communityPortal.address);
  console.log("デプロイ完了");

  console.log("");
  console.log("--- コミュニティ作成 ---------------------------");
  console.log("FANBASEコミュニティを作成中...");
  const fanbaseTx = await communityPortal.createCommunity(
    "ipfs://bafkreifdnoixhvg5j3egyykl7ctcs5kshajlu6orwgty2wx5pb7ut33gqa",
    "FANBASE",
    "ipfs://bafkreigwebay3llbklvxfnlmjyr7bvx4rivlyygdrkvhbwbylepgfbp4ei",
    {
      maxFeePerGas,
      maxPriorityFeePerGas,
    }
  );
  await fanbaseTx.wait();
  console.log("FANBASEコミュニティ作成完了");
  console.log("Transmit Streamersコミュニティを作成中...");
  const tsTx = await communityPortal.createCommunity(
    "ipfs://bafkreidxgkj4q36assf7gox7afrlzkkrpu4xfxejzbjv5k5f7wnziwc5ji",
    "Transmit Streamers",
    "ipfs://bafkreibxs7qvatg35kbve5stlerr3x46dbt2vuhvemkuieeanyygltjykq",
    {
      maxFeePerGas,
      maxPriorityFeePerGas,
    }
  );
  await tsTx.wait();
  console.log("Transmit Streamersコミュニティ作成完了");

  console.log("");
  console.log("---------------------------------------------");
  console.log("--- End CommunityPortal Deploy --------------");
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
