import axios from "axios";
import { ethers } from "hardhat";
import { QuestBoard } from "../typechain-types";

const args = require("../argument");

type QuestBoardArgs = {
  communityPortalAddress: string;
  questCheckerCreaterAddress: string;
  prizePoapAddress: string;
};

const toType = (args: any[]): QuestBoardArgs => {
  const questBoardArgs: QuestBoardArgs = {
    communityPortalAddress: args[0],
    questCheckerCreaterAddress: args[1],
    prizePoapAddress: args[2],
  };
  return questBoardArgs;
};

const ERC721_INTERFACE_ID = "0x80ac58cd";

async function main() {
  console.log("---------------------------------------------");
  console.log("--- Start QuestBoard Deploy -----------------");
  console.log("---------------------------------------------");

  console.log("");
  console.log("--- デプロイ ---------------------------------");
  console.log("デプロイ中...");
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account: ", deployer.address);
  const questBoardArgs = toType(args);
  const { maxFeePerGas, maxPriorityFeePerGas } = await calcMaxGas(false);
  const QuestBoard = await ethers.getContractFactory("QuestBoard");
  const questBoard = await QuestBoard.deploy(
    questBoardArgs.communityPortalAddress,
    questBoardArgs.questCheckerCreaterAddress,
    questBoardArgs.prizePoapAddress,
    {
      maxFeePerGas,
      maxPriorityFeePerGas,
    },
  );
  await questBoard.deployed();
  console.log("Deployed address: ", questBoard.address);
  console.log("デプロイ完了");
  // const questBoard = QuestBoard.attach(
  //   "0x5e0d4D650fC75155D01987ac0581AD1711617aFc",
  // );

  console.log("");
  console.log("--- クエスト発行 ------------------------------");
  const fanbaseQuestList = await createFanbaseQuest(
    questBoard,
    maxFeePerGas.toNumber(),
    maxPriorityFeePerGas.toNumber(),
  );
  console.log(fanbaseQuestList);
  const transmitStreamersQuestList = await createTransmitStreamersQuest(
    questBoard,
    maxFeePerGas.toNumber(),
    maxPriorityFeePerGas.toNumber(),
  );
  console.log(transmitStreamersQuestList);
  // const t1QuestList = await createT1Quest(
  //   questBoard,
  //   maxFeePerGas.toNumber(),
  //   maxPriorityFeePerGas.toNumber(),
  // );
  // console.log(t1QuestList);
  // const t2QuestList = await createT2Quest(
  //   questBoard,
  //   maxFeePerGas.toNumber(),
  //   maxPriorityFeePerGas.toNumber(),
  // );
  // console.log(t2QuestList);

  console.log("");
  console.log("---------------------------------------------");
  console.log("--- End QuestBoard Deploy -------------------");
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

const createFanbaseQuest = async (
  questBoard: QuestBoard,
  maxFeePerGasNum: number,
  maxPriorityFeePerGasNum: number,
) => {
  const CommunityPortal = await ethers.getContractFactory("CommunityPortal");
  const communityPortal = CommunityPortal.attach(
    await questBoard.communityPortal(),
  );
  const communityList = await Promise.all([
    await communityPortal.getCommunity(0),
    await communityPortal.getCommunity(1),
  ]);
  const fanbase = communityList[0];
  const transmitStreamers = communityList[1];
  const maxFeePerGas = ethers.BigNumber.from(maxFeePerGasNum);
  const maxPriorityFeePerGas = ethers.BigNumber.from(maxPriorityFeePerGasNum);
  const receiptList = [];
  console.log("1/5: FANBASE QUEST発行中...");
  receiptList.push(
    await (
      await questBoard.createQuest(
        "パスポートを手に入れてみよう！",
        "ipfs://bafkreifo2amfjr6v2rqcrflengjdmteykc7mi6mx4wo2gjac4pyiojthoe",
        0,
        100,
        3,
        true,
        ERC721_INTERFACE_ID,
        fanbase.passport,
        {
          maxFeePerGas,
          maxPriorityFeePerGas,
        },
      )
    ).wait(),
  );
  console.log("1/5: DONE!!!");
  console.log("2/5: FANBASE QUEST発行中...");
  receiptList.push(
    await (
      await questBoard.createQuest(
        "Transmit Streamersを応援しよう！",
        "ipfs://bafkreifyc7nntnufequtdhhwcuabz7gmzxasmfvelokbqqbnas2mbvcyxm",
        0,
        200,
        0,
        false,
        ERC721_INTERFACE_ID,
        transmitStreamers.passport,
        {
          maxFeePerGas,
          maxPriorityFeePerGas,
        },
      )
    ).wait(),
  );
  console.log("2/5: DONE!!!");
  console.log("3/5: FANBASE QUEST発行中...");
  receiptList.push(
    await (
      await questBoard.createQuest(
        "Twitterを連携しよう！",
        "ipfs://bafkreictzuz2ryjfg2e2rbtmr2vas6qk5n36ey4uo36l5wzqwqneueiysy",
        0,
        200,
        0,
        false,
        ERC721_INTERFACE_ID,
        "0x34d2741f92Dd815FcABe06D8d8b48CeaB4884bf6",
        {
          maxFeePerGas,
          maxPriorityFeePerGas,
        },
      )
    ).wait(),
  );
  console.log("3/5: DONE!!!");
  console.log("4/5: FANBASE QUEST発行中...");
  receiptList.push(
    await (
      await questBoard.createQuest(
        "XXXをRTしよう！",
        "ipfs://bafkreifjjctxi5xcx6veaqpmkqlvz5y572qv2xkbfaoribsoylf7w4ytam",
        0,
        300,
        0,
        false,
        ERC721_INTERFACE_ID,
        "0x23C8ABEdf8783E6EA1ff631e54E04f5F01d4A527",
        {
          maxFeePerGas,
          maxPriorityFeePerGas,
        },
      )
    ).wait(),
  );
  console.log("4/5: DONE!!!");
  console.log("5/5: FANBASE QUEST発行中...");
  receiptList.push(
    await (
      await questBoard.createQuest(
        "クエストを3つクリアしよう！",
        "ipfs://bafkreigepnljnr5d56lwht5wrpc2awcriyje7crlwmdasfprnvk3xatngi",
        0,
        300,
        0,
        false,
        ERC721_INTERFACE_ID,
        "0x018702B50b0548972643B132Da2957012F571870",
        {
          maxFeePerGas,
          maxPriorityFeePerGas,
        },
      )
    ).wait(),
  );
  console.log("5/5: DONE!!!");
  return receiptList;
};

const createTransmitStreamersQuest = async (
  questBoard: QuestBoard,
  maxFeePerGasNum: number,
  maxPriorityFeePerGasNum: number,
) => {
  const CommunityPortal = await ethers.getContractFactory("CommunityPortal");
  const communityPortal = CommunityPortal.attach(
    await questBoard.communityPortal(),
  );
  const communityList = await Promise.all([
    await communityPortal.getCommunity(0),
    await communityPortal.getCommunity(1),
  ]);
  const transmitStreamers = communityList[1];
  const maxFeePerGas = ethers.BigNumber.from(maxFeePerGasNum);
  const maxPriorityFeePerGas = ethers.BigNumber.from(maxPriorityFeePerGasNum);
  const receiptList = [];
  console.log("1/5: Transmit Streamers QUEST発行中...");
  receiptList.push(
    await (
      await questBoard.createQuest(
        "パスポートを取得しよう！",
        "ipfs://bafkreialf2ss3djt7rwbisgxqtvgs6hvfhci7iu2g5isbzkuokpotgpquu",
        1,
        100,
        7,
        true,
        ERC721_INTERFACE_ID,
        transmitStreamers.passport,
        {
          maxFeePerGas,
          maxPriorityFeePerGas,
        },
      )
    ).wait(),
  );
  console.log("1/5: DONE!!!");
  console.log("2/5: Transmit Streamers QUEST発行中...");
  receiptList.push(
    await (
      await questBoard.createQuest(
        "Twitterをフォローしよう！",
        "ipfs://bafkreiftvbrbjiinkcd3iioh7fdcfuvysl72vyckjoxnnqz6yasnjq5kwu",
        1,
        200,
        0,
        false,
        ERC721_INTERFACE_ID,
        "0x2f387D22ee7ddC1E9bfC2A5C3E4B07030823934B",
        {
          maxFeePerGas,
          maxPriorityFeePerGas,
        },
      )
    ).wait(),
  );
  console.log("2/5: DONE!!!");
  console.log("3/5: Transmit Streamers QUEST発行中...");
  receiptList.push(
    await (
      await questBoard.createQuest(
        "Youtubeを登録しよう！",
        "ipfs://bafkreiajf7memizuky3piiky4pr7zrkf7o5ea22nlmgyvvyw7nczkmrmy4",
        1,
        200,
        0,
        false,
        ERC721_INTERFACE_ID,
        "0x1928968Ffc0106116E464f7bFbB0F130e2e439db",
        {
          maxFeePerGas,
          maxPriorityFeePerGas,
        },
      )
    ).wait(),
  );
  console.log("3/5: DONE!!!");
  console.log("4/5: Transmit Streamers QUEST発行中...");
  receiptList.push(
    await (
      await questBoard.createQuest(
        "XXXをRTしよう！",
        "ipfs://bafkreihpq4qxzymv7zu6km3xgeflsunsham34tttm6ce3hfkh6e47ku74e",
        1,
        300,
        0,
        false,
        ERC721_INTERFACE_ID,
        "0x23C8ABEdf8783E6EA1ff631e54E04f5F01d4A527",
        {
          maxFeePerGas,
          maxPriorityFeePerGas,
        },
      )
    ).wait(),
  );
  console.log("4/5: DONE!!!");
  console.log("5/5: Transmit Streamers QUEST発行中...");
  receiptList.push(
    await (
      await questBoard.createQuest(
        "Transmit Streamers NFTを手に入れよう！",
        "ipfs://bafkreigivrniuuzcpmgvtz7bnokesndjbmumwlkrv7xwfsllukajhbxzli",
        1,
        500,
        0,
        false,
        ERC721_INTERFACE_ID,
        "0x4360a98e2d3cD2feA456b6aFa281827D571650ea",
        {
          maxFeePerGas,
          maxPriorityFeePerGas,
        },
      )
    ).wait(),
  );
  console.log("5/5: DONE!!!");
  return receiptList;
};

const createT1Quest = async (
  questBoard: QuestBoard,
  maxFeePerGasNum: number,
  maxPriorityFeePerGasNum: number,
) => {
  const maxFeePerGas = ethers.BigNumber.from(maxFeePerGasNum);
  const maxPriorityFeePerGas = ethers.BigNumber.from(maxPriorityFeePerGasNum);
  const receiptList = [];
  console.log("1/5: T1 QUEST発行中...");
  receiptList.push(
    await (
      await questBoard.createQuest(
        "Next 86 PJに参加しよう！",
        "ipfs://bafkreiesmxex2jk26gphvllz45qnvohjsf4qyucs3tznyihudx3di76sfe",
        2,
        100,
        0,
        false,
        ERC721_INTERFACE_ID,
        "0x05540dCCf2632D981D5776d13eA0421a93f7Aaa9",
        {
          maxFeePerGas,
          maxPriorityFeePerGas,
        },
      )
    ).wait(),
  );
  console.log("1/5: DONE!!!");
  console.log("2/5: T1 QUEST発行中...");
  receiptList.push(
    await (
      await questBoard.createQuest(
        "86好きを共有しよう！",
        "ipfs://bafkreie4sozkvyxdf3s7e7ou7jsx3incpzsekdnf2tb55pa75q46xo6tje",
        2,
        1500,
        0,
        false,
        ERC721_INTERFACE_ID,
        "0x23C8ABEdf8783E6EA1ff631e54E04f5F01d4A527",
        {
          maxFeePerGas,
          maxPriorityFeePerGas,
        },
      )
    ).wait(),
  );
  console.log("2/5: DONE!!!");
  console.log("3/5: T1 QUEST発行中...");
  receiptList.push(
    await (
      await questBoard.createQuest(
        "86の課題を共有しよう！",
        "ipfs://bafkreidubcox43zdocr32uiufqunndmfrbsxkbteaget2khpbb4tulz7ga",
        2,
        2000,
        0,
        false,
        ERC721_INTERFACE_ID,
        "0x23C8ABEdf8783E6EA1ff631e54E04f5F01d4A527",
        {
          maxFeePerGas,
          maxPriorityFeePerGas,
        },
      )
    ).wait(),
  );
  console.log("3/5: DONE!!!");
  console.log("4/5: T1 QUEST発行中...");
  receiptList.push(
    await (
      await questBoard.createQuest(
        "次世代86を提案しよう！",
        "ipfs://bafkreiarhkcnj2ckv6uuxjegsbsl3u7qtyeeqk6s4wmypxp25o6vzozyse",
        2,
        3000,
        0,
        false,
        ERC721_INTERFACE_ID,
        "0x2f387D22ee7ddC1E9bfC2A5C3E4B07030823934B",
        {
          maxFeePerGas,
          maxPriorityFeePerGas,
        },
      )
    ).wait(),
  );
  console.log("4/5: DONE!!!");
  console.log("5/5: T1 QUEST発行中...");
  receiptList.push(
    await (
      await questBoard.createQuest(
        "クエストを3つクリアしよう！",
        "ipfs://bafkreiebo2ofx4t6bxbs5j7rvuebzimhbhwted2k6ncx4iviv4jhwibel4",
        2,
        3000,
        0,
        false,
        ERC721_INTERFACE_ID,
        "0x018702B50b0548972643B132Da2957012F571870",
        {
          maxFeePerGas,
          maxPriorityFeePerGas,
        },
      )
    ).wait(),
  );
  console.log("5/5: DONE!!!");
  return receiptList;
};

const createT2Quest = async (
  questBoard: QuestBoard,
  maxFeePerGasNum: number,
  maxPriorityFeePerGasNum: number,
) => {
  const maxFeePerGas = ethers.BigNumber.from(maxFeePerGasNum);
  const maxPriorityFeePerGas = ethers.BigNumber.from(maxPriorityFeePerGasNum);
  const receiptList = [];
  console.log("1/5: T2 QUEST発行中...");
  receiptList.push(
    await (
      await questBoard.createQuest(
        "Pop-up PJに参加しよう！",
        "ipfs://bafkreiaee5v6e3y5s6rfp4cwi76jbqhuh6j4b5r27q7ngwe3eveoxzv2zq",
        3,
        100,
        0,
        false,
        ERC721_INTERFACE_ID,
        "0x9f5961f4bB9D8fADdefD63Bb961d7510Ca773809",
        {
          maxFeePerGas,
          maxPriorityFeePerGas,
        },
      )
    ).wait(),
  );
  console.log("1/5: DONE!!!");
  console.log("2/5: T2 QUEST発行中...");
  receiptList.push(
    await (
      await questBoard.createQuest(
        "リトラ好きを共有しよう！",
        "ipfs://bafkreigwqnglee7oseo5asw55uwhdp3taiuiolnfplx3hg4qc4unlgdtgy",
        3,
        1500,
        0,
        false,
        ERC721_INTERFACE_ID,
        "0x23C8ABEdf8783E6EA1ff631e54E04f5F01d4A527",
        {
          maxFeePerGas,
          maxPriorityFeePerGas,
        },
      )
    ).wait(),
  );
  console.log("2/5: DONE!!!");
  console.log("3/5: T2 QUEST発行中...");
  receiptList.push(
    await (
      await questBoard.createQuest(
        "リトラの課題を共有しよう！",
        "ipfs://bafkreihnphrcuq7e4u3brwusczfrlvxfgxjbdbdqh6gfqej272f3jvxcai",
        3,
        2000,
        0,
        false,
        ERC721_INTERFACE_ID,
        "0x23C8ABEdf8783E6EA1ff631e54E04f5F01d4A527",
        {
          maxFeePerGas,
          maxPriorityFeePerGas,
        },
      )
    ).wait(),
  );
  console.log("3/5: DONE!!!");
  console.log("4/5: T2 QUEST発行中...");
  receiptList.push(
    await (
      await questBoard.createQuest(
        "次世代リトラを提案しよう！",
        "ipfs://bafkreigfohkdj23xtnp75jmutsvqzla4jjspp2sbu5sdnos6wbqinfg27e",
        3,
        3000,
        0,
        false,
        ERC721_INTERFACE_ID,
        "0x2f387D22ee7ddC1E9bfC2A5C3E4B07030823934B",
        {
          maxFeePerGas,
          maxPriorityFeePerGas,
        },
      )
    ).wait(),
  );
  console.log("4/5: DONE!!!");
  console.log("5/5: T2 QUEST発行中...");
  receiptList.push(
    await (
      await questBoard.createQuest(
        "クエストを3つクリアしよう！",
        "ipfs://bafkreidt2bokyhvljve3szzmjjicthkutt45cscqp75ch7xlzgyfuxkm24",
        3,
        3000,
        0,
        false,
        ERC721_INTERFACE_ID,
        "0x018702B50b0548972643B132Da2957012F571870",
        {
          maxFeePerGas,
          maxPriorityFeePerGas,
        },
      )
    ).wait(),
  );
  console.log("5/5: DONE!!!");
  return receiptList;
};
