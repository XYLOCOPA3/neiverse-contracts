import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { deployQuestCheckerCreater } from "./QuestCheckerCreater";

export async function deploy() {
  const questCheckerCreater = await loadFixture(deployQuestCheckerCreater);

  return {
    questCheckerCreater,
  };
}
