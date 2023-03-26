import { ethers } from "hardhat";
import { QuestPoap } from "../../../typechain-types";

export async function deployQuestPoap() {
  const questPoapArgs: QuestPoapInitArgs = {
    name: "QUEST",
    externalLink: "https://quest.neiverse.org",
  };

  const QuestPoap = await ethers.getContractFactory("QuestPoap");
  const questPoap = await QuestPoap.deploy(
    questPoapArgs.name,
    questPoapArgs.externalLink,
  );
  await questPoap.deployed();

  const args: QuestPoapArgs = {
    contract: questPoap,
    args: questPoapArgs,
  };
  return args;
}

export type QuestPoapArgs = {
  contract: QuestPoap;
  args: QuestPoapInitArgs;
};

export type QuestPoapInitArgs = {
  name: string;
  externalLink: string;
};
