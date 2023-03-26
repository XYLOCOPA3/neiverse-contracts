import { ethers, upgrades } from "hardhat";
import type { Contract } from "ethers";
import { Cube } from "../../../typechain-types";

export async function deployCube() {
  const prizePoapAddress = ethers.constants.AddressZero;

  const Cube = await ethers.getContractFactory("Cube");
  const cubeProxy = await upgrades.deployProxy(Cube, [prizePoapAddress], {
    kind: "uups",
    initializer: "initialize",
  });
  await cubeProxy.deployed();

  const cube = Cube.attach(cubeProxy.address);

  const args: CubeArgs = {
    contract: cube,
    proxy: cubeProxy,
  };
  return args;
}

export type CubeArgs = {
  contract: Cube;
  proxy: Contract;
};
