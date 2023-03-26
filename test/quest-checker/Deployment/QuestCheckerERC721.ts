import { ethers } from "hardhat";
import { QuestCheckerERC721 } from "../../../typechain-types";

export async function deployQuestCheckerERC721() {
  const erc721 = ethers.constants.AddressZero;
  const questBoard = ethers.constants.AddressZero;

  const QuestCheckerERC721 = await ethers.getContractFactory(
    "QuestCheckerERC721",
  );
  const questCheckerERC721 = await QuestCheckerERC721.deploy(
    erc721,
    questBoard,
  );
  await questCheckerERC721.deployed();

  const args: QuestCheckerERC721Args = {
    contract: questCheckerERC721,
  };

  return args;
}

export type QuestCheckerERC721Args = {
  contract: QuestCheckerERC721;
};
