import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { deployCommunityPassportCreater } from "../../community-passport-creater/Deployment/CommunityPassportCreater";
import { deployCommunityPassport } from "../../community-passport/Deployment/CommunityPassport";
import { deployCommunityPortal } from "../../community-portal/Deployment/CommunityPortal";
import { deployQuestBoard } from "../../quest-board/Deployment/QuestBoard";
import { deployQuestCheckerCreater } from "../../quest-checker-creater/Deployment/QuestCheckerCreater";
import { deployPrizePoap } from "./PrizePoap";

export async function deploy() {
  const prizePoap = await loadFixture(deployPrizePoap);
  const communityPortal = await loadFixture(deployCommunityPortal);
  const communityPassportCreater = await loadFixture(
    deployCommunityPassportCreater,
  );
  const communityPassport = await loadFixture(deployCommunityPassport);
  const questBoard = await loadFixture(deployQuestBoard);
  const questCheckerCreater = await loadFixture(deployQuestCheckerCreater);

  // PrizePoapの設定
  await (
    await prizePoap.contract.setCommunityPortal(
      communityPortal.contract.address,
    )
  ).wait();
  await (
    await prizePoap.contract.setQuestBoard(questBoard.contract.address)
  ).wait();

  // CommunityPortalの設定
  await (
    await communityPortal.contract.setPassportCreater(
      communityPassportCreater.contract.address,
    )
  ).wait();
  await (
    await communityPortal.contract.setQuestBoard(questBoard.contract.address)
  ).wait();

  // CommunityPassportCreaterの設定
  await (
    await communityPassportCreater.contract.setCommunityPassportBeacon(
      communityPassport.beacon.address,
    )
  ).wait();

  // QuestBoardの設定
  await (
    await questBoard.contract.setCommunityPortal(
      communityPortal.contract.address,
    )
  ).wait();
  await (
    await questBoard.contract.setQuestCheckerCreater(
      questCheckerCreater.contract.address,
    )
  ).wait();
  await (
    await questBoard.contract.setPrizePoap(prizePoap.contract.address)
  ).wait();

  return {
    communityPassport,
    communityPassportCreater,
    communityPortal,
    prizePoap,
    questBoard,
    questCheckerCreater,
  };
}
