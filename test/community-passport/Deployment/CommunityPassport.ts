import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { ethers, upgrades } from "hardhat";
import type { Contract } from "ethers";
import {
  CommunityPassport,
  CommunityPassportProxy,
} from "../../../typechain-types";
import { getWalletAddress } from "../../utils/WalletAddress";

export async function deployCommunityPassport() {
  const { admin1, admin2 } = await loadFixture(getWalletAddress);

  // ビーコンをデプロイ
  const CommunityPassport = await ethers.getContractFactory(
    "CommunityPassport",
  );
  const communityPassportBeacon = await upgrades.deployBeacon(
    CommunityPassport,
  );
  await communityPassportBeacon.deployed();

  // プロキシーをデプロイ
  const CommunityPassportProxy = await ethers.getContractFactory(
    "CommunityPassportProxy",
  );
  const args1: CommunityPassportInitArgs = {
    name: "name1",
    symbol: "symbol1",
    baseURI: "baseURI1",
    firstURI: "firstURI1",
    contractURI: "contractURI1",
    communityId: 0,
    adminList: [admin1.address, admin2.address],
  };
  const data1 = CommunityPassport.interface.encodeFunctionData("initialize", [
    args1.name,
    args1.symbol,
    args1.baseURI,
    args1.firstURI,
    args1.contractURI,
    args1.communityId,
    args1.adminList,
  ]);
  const communityPassportProxy1 = await CommunityPassportProxy.deploy(
    communityPassportBeacon.address,
    data1,
  );
  await communityPassportProxy1.deployed();
  const args2: CommunityPassportInitArgs = {
    name: "name2",
    symbol: "symbol2",
    baseURI: "baseURI2",
    firstURI: "firstURI2",
    contractURI: "contractURI2",
    communityId: 1,
    adminList: [admin1.address, admin2.address],
  };
  const data2 = CommunityPassport.interface.encodeFunctionData("initialize", [
    args2.name,
    args2.symbol,
    args2.baseURI,
    args2.firstURI,
    args2.contractURI,
    args2.communityId,
    args2.adminList,
  ]);
  const communityPassportProxy2 = await CommunityPassportProxy.deploy(
    communityPassportBeacon.address,
    data2,
  );
  await communityPassportProxy2.deployed();

  // プロキシーにコミュニティパスポートをアタッチ
  const communityPassport1 = CommunityPassport.attach(
    communityPassportProxy1.address,
  );
  const communityPassport2 = CommunityPassport.attach(
    communityPassportProxy2.address,
  );

  const args: CommunityPassportArgs = {
    beacon: communityPassportBeacon,
    proxy1: communityPassportProxy1,
    proxy2: communityPassportProxy2,
    contract1: communityPassport1,
    contract2: communityPassport2,
    args1: args1,
    args2: args2,
  };

  return args;
}

export type CommunityPassportArgs = {
  beacon: Contract;
  proxy1: CommunityPassportProxy;
  proxy2: CommunityPassportProxy;
  contract1: CommunityPassport;
  contract2: CommunityPassport;
  args1: CommunityPassportInitArgs;
  args2: CommunityPassportInitArgs;
};

export type CommunityPassportInitArgs = {
  name: string;
  symbol: string;
  baseURI: string;
  firstURI: string;
  contractURI: string;
  communityId: number;
  adminList: string[];
};
