import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { deployCommunityPassport } from "./CommunityPassport";

export async function deploy() {
  const communityPassport = await loadFixture(deployCommunityPassport);

  return {
    communityPassport,
  };
}
