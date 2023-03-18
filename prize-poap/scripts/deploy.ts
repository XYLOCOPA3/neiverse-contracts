import axios from "axios";
import { ethers } from "hardhat";

const args = require("../argument");

type PrizePoapArgs = {
  passportPortalAddress: string;
  questBoardAddress: string;
  baseURI: string;
};

const toType = (args: any[]): PrizePoapArgs => {
  const communityPortalArgs: PrizePoapArgs = {
    passportPortalAddress: args[0],
    questBoardAddress: args[1],
    baseURI: args[2],
  };
  return communityPortalArgs;
};

async function main() {
  console.log("---------------------------------------------");
  console.log("--- Start PrizePoap Deploy ------------------");
  console.log("---------------------------------------------");

  console.log("");
  console.log("--- デプロイ ---------------------------------");
  console.log("デプロイ中...");
  const prizePoapArgs = toType(args);
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account: ", deployer.address);
  const PrizePoap = await ethers.getContractFactory("PrizePoap");
  const { maxFeePerGas, maxPriorityFeePerGas } = await calcMaxGas(false);
  const prizePoap = await PrizePoap.deploy(
    prizePoapArgs.passportPortalAddress,
    prizePoapArgs.questBoardAddress,
    prizePoapArgs.baseURI,
    {
      maxFeePerGas,
      maxPriorityFeePerGas,
    },
  );
  await prizePoap.deployed();
  console.log("Deployed address: ", prizePoap.address);
  console.log("デプロイ完了");
  // const prizePoap = PrizePoap.attach(
  //   "0x4b1d43A1987CCB3F15B304d5114E7A9dd696AD56",
  // );

  console.log("");
  console.log("--- Prize作成 --------------------------------");
  console.log("FANBASEコミュニティ用Prize作成開始");
  console.log("1/4: 作成中...");
  let tx = await prizePoap.create(
    "bafkreibaadgoiqrouh5cnqfetzrt2pqunb2coi5wmivjhji64b3g6teqbm",
    0,
    100,
    0,
    false,
    {
      maxFeePerGas,
      maxPriorityFeePerGas,
    },
  );
  await tx.wait();
  console.log("1/4: DONE!!!");
  console.log("2/4: 作成中...");
  tx = await prizePoap.create(
    "bafkreiduyh2mipn6recedsi55uuuzhqzjbzl2ev6w72aoeszrzaj32rgga",
    0,
    1600,
    0,
    false,
    {
      maxFeePerGas,
      maxPriorityFeePerGas,
    },
  );
  await tx.wait();
  console.log("2/4: DONE!!!");
  console.log("3/4: 作成中...");
  tx = await prizePoap.create(
    "bafkreicvbh7exviejfa2ezrtwkhjctuuhpxmbkfhyksv7rntoebegr3vke",
    0,
    8100,
    0,
    false,
    {
      maxFeePerGas,
      maxPriorityFeePerGas,
    },
  );
  await tx.wait();
  console.log("3/4: DONE!!!");
  console.log("4/4: 作成中...");
  tx = await prizePoap.create(
    "bafkreig34rncewz4dzcfayfvge55kik7d2anhfx4aye2kykvf2hb5bnwyy",
    0,
    0,
    0,
    true,
    {
      maxFeePerGas,
      maxPriorityFeePerGas,
    },
  );
  await tx.wait();
  console.log("4/4: DONE!!!");
  console.log("FANBASEコミュニティ用Prize作成完了");
  console.log("Transmit Streamersコミュニティ用Prize作成開始");
  console.log("1/4: 作成中...");
  tx = await prizePoap.create(
    "bafkreieig75gjmqp44uuacyiok7km64p6tfig5on2ww2faf7pe5mivckjq",
    1,
    100,
    0,
    false,
    {
      maxFeePerGas,
      maxPriorityFeePerGas,
    },
  );
  await tx.wait();
  console.log("1/4: DONE!!!");
  console.log("2/4: 作成中...");
  tx = await prizePoap.create(
    "bafkreicdywyr4t3rhmc4wzq4wlbk4j5x23qo27ygzukgy2ygvwnm2fvwpe",
    1,
    1600,
    0,
    false,
    {
      maxFeePerGas,
      maxPriorityFeePerGas,
    },
  );
  await tx.wait();
  console.log("2/4: DONE!!!");
  console.log("3/4: 作成中...");
  tx = await prizePoap.create(
    "bafkreiekwdihvywqxdye3vyjnpxy27obwds276iq6nb3ioij2tvbgab7l4",
    1,
    8100,
    0,
    false,
    {
      maxFeePerGas,
      maxPriorityFeePerGas,
    },
  );
  await tx.wait();
  console.log("3/4: DONE!!!");
  console.log("4/4: 作成中...");
  tx = await prizePoap.create(
    "bafkreiha7zcstwpofbi4rlyjqk2sx2g7g3pjtvbtubxphvtsg7mj4sdhbe",
    1,
    0,
    5,
    true,
    {
      maxFeePerGas,
      maxPriorityFeePerGas,
    },
  );
  await tx.wait();
  console.log("4/4: DONE!!!");
  console.log("Transmit Streamersコミュニティ用Prize作成完了");
  // console.log("T1コミュニティ用Prize作成開始");
  // console.log("1/3: 作成中...");
  // let tx = await prizePoap.create(
  //   "bafkreib5ufpiuvk76jdqhjcyc2aeumry4anby7xemp6egfel4tidqrsqo4",
  //   2,
  //   100,
  //   0,
  //   false,
  //   {
  //     maxFeePerGas,
  //     maxPriorityFeePerGas,
  //   }
  // );
  // await tx.wait();
  // console.log("1/3: DONE!!!");
  // console.log("2/3: 作成中...");
  // tx = await prizePoap.create(
  //   "bafkreigiiznus3hskoejir3wref7oshvw6fwiehdfyiig3oajy7itdwjhi",
  //   2,
  //   1600,
  //   0,
  //   false,
  //   {
  //     maxFeePerGas,
  //     maxPriorityFeePerGas,
  //   }
  // );
  // await tx.wait();
  // console.log("2/3: DONE!!!");
  // console.log("3/3: 作成中...");
  // tx = await prizePoap.create(
  //   "bafkreigkano32akeg4raj5ogzp72346jishxahrm2rzsf324fnhzt3wu6y",
  //   2,
  //   8100,
  //   0,
  //   false,
  //   {
  //     maxFeePerGas,
  //     maxPriorityFeePerGas,
  //   }
  // );
  // await tx.wait();
  // console.log("3/3: DONE!!!");
  // console.log("T1コミュニティ用Prize作成完了");
  // console.log("T2コミュニティ用Prize作成開始");
  // console.log("1/3: 作成中...");
  // tx = await prizePoap.create(
  //   "bafkreigs5k2oz3kbxdf3trc7srheao4p5z2ojmsasabyqwtj3rgychodye",
  //   3,
  //   100,
  //   0,
  //   false,
  //   {
  //     maxFeePerGas,
  //     maxPriorityFeePerGas,
  //   }
  // );
  // await tx.wait();
  // console.log("1/3: DONE!!!");
  // console.log("2/3: 作成中...");
  // tx = await prizePoap.create(
  //   "bafkreigjrnqtlm34hjodp5a6bd6gp7t6f676ujt27gtagdugxuna63emj4",
  //   3,
  //   1600,
  //   0,
  //   false,
  //   {
  //     maxFeePerGas,
  //     maxPriorityFeePerGas,
  //   }
  // );
  // await tx.wait();
  // console.log("2/3: DONE!!!");
  // console.log("3/3: 作成中...");
  // tx = await prizePoap.create(
  //   "bafkreibknjnp3jxdd3dlkypweeevfi2jmdrfud5xsitvtnlcfrhn7r4gmm",
  //   3,
  //   8100,
  //   0,
  //   false,
  //   {
  //     maxFeePerGas,
  //     maxPriorityFeePerGas,
  //   }
  // );
  // await tx.wait();
  // console.log("3/3: DONE!!!");
  // console.log("T2コミュニティ用Prize作成完了");

  console.log("");
  console.log("---------------------------------------------");
  console.log("--- End PrizePoap Deploy --------------------");
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
      "gwei",
    );
    maxPriorityFeePerGas = ethers.utils.parseUnits(
      Math.ceil(data.fast.maxPriorityFee) + "",
      "gwei",
    );
  } catch {
    throw Error("ガス代を計算できません。");
  }
  return { maxFeePerGas, maxPriorityFeePerGas };
};
