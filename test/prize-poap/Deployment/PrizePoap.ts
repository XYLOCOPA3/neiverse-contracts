import { ethers, upgrades } from "hardhat";
import type { Contract } from "ethers";
import { PrizePoap } from "../../../typechain-types";

export async function deployPrizePoap() {
  const communityPortalAddress = ethers.constants.AddressZero;
  const questBoardAddress = ethers.constants.AddressZero;

  const PrizePoap = await ethers.getContractFactory("PrizePoap");
  const baseURI = "ipfs://";
  const prizePoapProxy = await upgrades.deployProxy(
    PrizePoap,
    [communityPortalAddress, questBoardAddress, baseURI],
    {
      kind: "uups",
      initializer: "initialize",
    },
  );
  await prizePoapProxy.deployed();

  const prizePoap = PrizePoap.attach(prizePoapProxy.address);

  const args: PrizePoapArgs = {
    contract: prizePoap,
    proxy: prizePoapProxy,
  };

  return args;
}

export type PrizePoapArgs = {
  contract: PrizePoap;
  proxy: Contract;
};
