import { ethers } from "hardhat";
import { CommunityPassportCreater } from "../../../typechain-types";

export async function deployCommunityPassportCreater() {
  const communityPassportBeaconAddress = ethers.constants.AddressZero;

  const CommunityPassportCreater = await ethers.getContractFactory(
    "CommunityPassportCreater",
  );
  const communityPassportCreater = await CommunityPassportCreater.deploy(
    communityPassportBeaconAddress,
  );
  await communityPassportCreater.deployed();

  const args: CommunityPassportCreaterArgs = {
    contract: communityPassportCreater,
  };
  return args;
}

export type CommunityPassportCreaterArgs = {
  contract: CommunityPassportCreater;
};
