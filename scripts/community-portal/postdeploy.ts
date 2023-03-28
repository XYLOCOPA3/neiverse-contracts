import { ethers, run } from "hardhat";
import { CommunityPortal } from "../../typechain-types";
import { calcMaxGas } from "../../utils/gas-estimation";
import {
  COMMUNITY_PASSPORT_CREATER_ADDRESS,
  COMMUNITY_PORTAL_PROXY_ADDRESS,
  QUEST_BOARD_PROXY_ADDRESS,
  COMMUNITY_INIT_DATA,
} from "../const";

async function main() {
  console.log("---------------------------------------------");
  console.log("--- Start CommunityPortal Init --------------");
  console.log("---------------------------------------------");
  console.log("");

  console.log("--- Init ------------------------------------");

  console.log("Init...");

  const [deployer] = await ethers.getSigners();
  console.log("Initialize contracts with account: ", deployer.address);
  console.log(
    "Initialize CommunityPortalProxy address: ",
    COMMUNITY_PORTAL_PROXY_ADDRESS,
  );

  const CommunityPortal = await ethers.getContractFactory("CommunityPortal");
  const communityPortal = CommunityPortal.attach(
    COMMUNITY_PORTAL_PROXY_ADDRESS,
  );

  console.log("Set CommunityPassportCreater address...");
  await (
    await communityPortal.setPassportCreater(
      COMMUNITY_PASSPORT_CREATER_ADDRESS,
      await calcMaxGas(false),
    )
  ).wait();
  console.log(
    "Set CommunityPassportCreater address:",
    COMMUNITY_PASSPORT_CREATER_ADDRESS,
  );

  console.log("Set QuestBoardProxy address...");
  await (
    await communityPortal.setQuestBoard(
      QUEST_BOARD_PROXY_ADDRESS,
      await calcMaxGas(false),
    )
  ).wait();
  console.log("Set QuestBoardProxy address:", QUEST_BOARD_PROXY_ADDRESS);

  await _createCommunity(communityPortal, "community1");

  await _createCommunity(communityPortal, "community2");

  console.log("Completed init");

  console.log("");
  console.log("---------------------------------------------");
  console.log("--- End CommunityPortal Init ----------------");
  console.log("---------------------------------------------");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

const _createCommunity = async (
  communityPortal: CommunityPortal,
  name: "community1" | "community2",
) => {
  console.log(`Create ${name}...`);
  await (
    await communityPortal.createCommunity(
      COMMUNITY_INIT_DATA[name].name,
      COMMUNITY_INIT_DATA[name].baseURI,
      COMMUNITY_INIT_DATA[name].firstURI,
      COMMUNITY_INIT_DATA[name].contractURI,
      COMMUNITY_INIT_DATA[name].adminList,
      `${COMMUNITY_INIT_DATA[name].baseURI}${COMMUNITY_INIT_DATA[name].firstURI}`,
      await calcMaxGas(false),
    )
  ).wait();
  console.log(`Completed ${name} creation`);

  // デプロイ完了直後にverifyすると失敗するので10秒待つ
  console.log("Waiting for 10 seconds before verification...");
  await new Promise((resolve) => setTimeout(resolve, 10000));

  console.log("Verifying...");

  const communityId = (await communityPortal.communitySupply()).sub(1);
  const community = await communityPortal.getCommunity(communityId);
  console.log("Community:", community);

  try {
    // `Error 1: Failed to verify BeaconProxy contract at 0x777503cbfb1092E30302D8d58f2a10F2637AA468: Bytecode does not match with the current version of BeaconProxy in the Hardhat Upgrades plugin.` というエラーが必ず出るが無視して良い
    // `verify and publish` に失敗しているだけで、コントラクトは問題なくデプロイできているため
    // TODO: コントラクト内でデプロイしたコントラクトをhardhat経由でverifyする方法を確立する
    await run("verify:verify", {
      address: community.passport,
      constructorArguments: [],
    });
  } catch (e) {
    console.log(e);
  }

  console.log("Completed verification");
};
