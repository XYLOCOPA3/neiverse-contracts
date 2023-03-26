import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { deployCommunityPassport } from "../../community-passport/Deployment/CommunityPassport";
import { deployCommunityPassportCreater } from "./CommunityPassportCreater";

export async function deploy() {
  const communityPassport = await loadFixture(deployCommunityPassport);
  const communityPassportCreater = await loadFixture(
    deployCommunityPassportCreater,
  );

  // CommunityPassportCreaterの設定
  await (
    await communityPassportCreater.contract.setCommunityPassportBeacon(
      communityPassport.beacon.address,
    )
  ).wait();

  return {
    communityPassport,
    communityPassportCreater,
  };
}
