import { ethers } from "hardhat";
import { QuestBoard } from "../../typechain-types";
import { calcMaxGas } from "../../utils/gas-estimation";
import {
  COMMUNITY_INIT_QUEST,
  COMMUNITY_PORTAL_PROXY_ADDRESS,
  PRIZE_POAP_PROXY_ADDRESS,
  QUEST_BOARD_PROXY_ADDRESS,
  QUEST_CHECKER_CREATER_ADDRESS,
} from "../const";

async function main() {
  console.log("---------------------------------------------");
  console.log("--- Start QuestBoard Init -------------------");
  console.log("---------------------------------------------");
  console.log("");

  console.log("--- Init ------------------------------------");

  console.log("Init...");

  const [deployer] = await ethers.getSigners();
  console.log("Initialize contracts with account: ", deployer.address);
  console.log(
    "Initialize QuestBoardProxy address: ",
    QUEST_BOARD_PROXY_ADDRESS,
  );

  const QuestBoard = await ethers.getContractFactory("QuestBoard");
  const questBoard = QuestBoard.attach(QUEST_BOARD_PROXY_ADDRESS);

  console.log("Set CommunityPortalProxy address...");
  await (
    await questBoard.setCommunityPortal(
      COMMUNITY_PORTAL_PROXY_ADDRESS,
      await calcMaxGas(false),
    )
  ).wait();
  console.log(
    "Set CommunityPortalProxy address:",
    COMMUNITY_PORTAL_PROXY_ADDRESS,
  );

  console.log("Set QuestCheckerCreater address...");
  await (
    await questBoard.setQuestCheckerCreater(
      QUEST_CHECKER_CREATER_ADDRESS,
      await calcMaxGas(false),
    )
  ).wait();
  console.log("Set QuestCheckerCreater address:", QUEST_BOARD_PROXY_ADDRESS);

  console.log("Set PrizePoapProxy address...");
  await (
    await questBoard.setPrizePoap(
      PRIZE_POAP_PROXY_ADDRESS,
      await calcMaxGas(false),
    )
  ).wait();
  console.log("Set PrizePoapProxy address:", QUEST_BOARD_PROXY_ADDRESS);

  await _createQuest(questBoard, "community1", [
    "quest1",
    "quest2",
    "quest3",
    "quest4",
    "quest5",
  ]);

  await _createQuest(questBoard, "community2", [
    "quest1",
    "quest2",
    "quest3",
    "quest4",
    "quest5",
  ]);

  console.log("Completed init");

  console.log("");
  console.log("---------------------------------------------");
  console.log("--- End QuestBoard Init ---------------------");
  console.log("---------------------------------------------");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

const _getCommunity = async (questBoard: QuestBoard) => {
  const CommunityPortal = await ethers.getContractFactory("CommunityPortal");
  const communityPortal = CommunityPortal.attach(
    await questBoard.communityPortal(),
  );
  const communityList = await Promise.all([
    await communityPortal.getCommunity(0),
    await communityPortal.getCommunity(1),
  ]);
  const community1 = communityList[0];
  const community2 = communityList[1];
  return { community1, community2 };
};

const _getInitQuest = async (questBoard: QuestBoard) => {
  const { community1, community2 } = await _getCommunity(questBoard);
  COMMUNITY_INIT_QUEST["community1"]["quest1"].target = community1.passport;
  COMMUNITY_INIT_QUEST["community1"]["quest2"].target = community2.passport;
  COMMUNITY_INIT_QUEST["community2"]["quest1"].target = community2.passport;
  return COMMUNITY_INIT_QUEST;
};

const _createQuest = async (
  questBoard: QuestBoard,
  community: "community1" | "community2",
  questList: Array<"quest1" | "quest2" | "quest3" | "quest4" | "quest5">,
) => {
  const communityInitQuest = await _getInitQuest(questBoard);
  console.log(`Start creating quest for ${community}`);
  for (let i = 0; i < questList.length; i++) {
    console.log(`${i + 1}/${questList.length}: Creating...`);
    await (
      await questBoard.createQuest(
        communityInitQuest[community][questList[i]].title,
        communityInitQuest[community][questList[i]].questURI,
        communityInitQuest[community][questList[i]].communityId,
        communityInitQuest[community][questList[i]].obtainableExp,
        communityInitQuest[community][questList[i]].obtainablePrizeId,
        communityInitQuest[community][questList[i]].prizeObtainable,
        communityInitQuest[community][questList[i]].interfaceId,
        communityInitQuest[community][questList[i]].target,
        await calcMaxGas(false),
      )
    ).wait();
    console.log(`${i + 1}/${questList.length}: DONE!!!`);
  }
  console.log(`Completed creating quest for ${community}`);
};
