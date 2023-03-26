import { ethers } from "hardhat";
import { PrizePoap } from "../../typechain-types";
import { calcMaxGas } from "../../utils/gas-estimation";
import {
  COMMUNITY_INIT_PRIZE,
  COMMUNITY_PORTAL_PROXY_ADDRESS,
  PRIZE_POAP_PROXY_ADDRESS,
  QUEST_BOARD_PROXY_ADDRESS,
} from "../const";

async function main() {
  console.log("---------------------------------------------");
  console.log("--- Start PrizePoap Init --------------------");
  console.log("---------------------------------------------");
  console.log("");

  console.log("--- Init ------------------------------------");

  console.log("Init...");

  const [deployer] = await ethers.getSigners();
  console.log("Initialize contracts with account: ", deployer.address);
  console.log("Initialize PrizePoapProxy address: ", PRIZE_POAP_PROXY_ADDRESS);

  const PrizePoap = await ethers.getContractFactory("PrizePoap");
  const prizePoap = PrizePoap.attach(PRIZE_POAP_PROXY_ADDRESS);

  console.log("Set CommunityPortalProxy address...");
  await (
    await prizePoap.setCommunityPortal(
      COMMUNITY_PORTAL_PROXY_ADDRESS,
      await calcMaxGas(false),
    )
  ).wait();
  console.log(
    "Set CommunityPortalProxy address:",
    COMMUNITY_PORTAL_PROXY_ADDRESS,
  );

  console.log("Set QuestBoardProxy address...");
  await (
    await prizePoap.setQuestBoard(
      QUEST_BOARD_PROXY_ADDRESS,
      await calcMaxGas(false),
    )
  ).wait();
  console.log("Set QuestBoardProxy address:", QUEST_BOARD_PROXY_ADDRESS);

  await _createPrize(prizePoap, "community1", [
    "prize1",
    "prize2",
    "prize3",
    "prize4",
  ]);
  await _createPrize(prizePoap, "community2", [
    "prize1",
    "prize2",
    "prize3",
    "prize4",
  ]);

  console.log("Completed init");

  console.log("");
  console.log("---------------------------------------------");
  console.log("--- End PrizePoap Init ----------------------");
  console.log("---------------------------------------------");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

const _createPrize = async (
  prizePoap: PrizePoap,
  community: "community1" | "community2",
  prizeList: Array<"prize1" | "prize2" | "prize3" | "prize4">,
) => {
  console.log(`Start creating prize for ${community}`);
  for (let i = 0; i < prizeList.length; i++) {
    console.log(`${i + 1}/${prizeList.length}: Creating...`);
    await (
      await prizePoap.create(
        COMMUNITY_INIT_PRIZE[community][prizeList[i]].tokenURI,
        COMMUNITY_INIT_PRIZE[community][prizeList[i]].communityId,
        COMMUNITY_INIT_PRIZE[community][prizeList[i]].requiredExp,
        COMMUNITY_INIT_PRIZE[community][prizeList[i]].requiredQuestId,
        COMMUNITY_INIT_PRIZE[community][prizeList[i]].questRequired,
        await calcMaxGas(false),
      )
    ).wait();
    console.log(`${i + 1}/${prizeList.length}: DONE!!!`);
  }
  console.log(`Completed creating prize for ${community}`);
};
