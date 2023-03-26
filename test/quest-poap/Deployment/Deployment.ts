import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { deployQuestPoap } from "./QuestPoap";

export async function deploy() {
  const questPoap = await loadFixture(deployQuestPoap);

  return {
    questPoap,
  };
}
