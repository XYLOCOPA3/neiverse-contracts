import { ethers, upgrades } from "hardhat";
import type { Contract } from "ethers";
import { CommunityPortal } from "../../../typechain-types";

export async function deployCommunityPortal() {
  const communityPassportCreaterAddress = ethers.constants.AddressZero;
  const questBoardAddress = ethers.constants.AddressZero;

  const CommunityPortal = await ethers.getContractFactory("CommunityPortal");
  const communityPortalProxy = await upgrades.deployProxy(
    CommunityPortal,
    [communityPassportCreaterAddress, questBoardAddress],
    {
      kind: "uups",
      initializer: "initialize",
    },
  );
  await communityPortalProxy.deployed();

  const communityPortal = CommunityPortal.attach(communityPortalProxy.address);

  const args: CommunityPassportCreaterArgs = {
    contract: communityPortal,
    proxy: communityPortalProxy,
  };
  return args;
}

export type CommunityPassportCreaterArgs = {
  contract: CommunityPortal;
  proxy: Contract;
};
