import { ethers, upgrades } from "hardhat";
import type { Contract } from "ethers";
import { QuestBoard } from "../../../typechain-types";

export async function deployQuestBoard() {
  const communityPortalAddress = ethers.constants.AddressZero;
  const questCheckerCreaterAddress = ethers.constants.AddressZero;
  const prozePoapAddress = ethers.constants.AddressZero;

  const QuestBoard = await ethers.getContractFactory("QuestBoard");
  const questBoardProxy = await upgrades.deployProxy(
    QuestBoard,
    [communityPortalAddress, questCheckerCreaterAddress, prozePoapAddress],
    {
      kind: "uups",
      initializer: "initialize",
    },
  );
  await questBoardProxy.deployed();

  const questBoard = QuestBoard.attach(questBoardProxy.address);

  const args: QuestBoardArgs = {
    contract: questBoard,
    proxy: questBoardProxy,
  };

  return args;
}

export type QuestBoardArgs = {
  contract: QuestBoard;
  proxy: Contract;
};
