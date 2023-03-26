import { ethers } from "hardhat";
import { QuestCheckerCreater } from "../../../typechain-types";

export async function deployQuestCheckerCreater() {
  const QuestCheckerCreater = await ethers.getContractFactory(
    "QuestCheckerCreater",
  );
  const questCheckerCreater = await QuestCheckerCreater.deploy();
  await questCheckerCreater.deployed();

  const args: QuestCheckerCreaterArgs = {
    contract: questCheckerCreater,
  };

  return args;
}

export type QuestCheckerCreaterArgs = {
  contract: QuestCheckerCreater;
};
