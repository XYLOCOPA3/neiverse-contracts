import { ethers } from "hardhat";
import { calcMaxGas } from "../../utils/gas-estimation";
import { CUBE_PROXY_ADDRESS, PRIZE_POAP_PROXY_ADDRESS } from "../const";

async function main() {
  console.log("---------------------------------------------");
  console.log("--- Start Cube Init -------------------------");
  console.log("---------------------------------------------");
  console.log("");

  console.log("--- Init ------------------------------------");

  console.log("Init...");

  const [deployer] = await ethers.getSigners();
  console.log("Initialize contracts with account: ", deployer.address);

  const Cube = await ethers.getContractFactory("Cube");
  const cube = Cube.attach(CUBE_PROXY_ADDRESS);

  console.log("Set PrizePoapProxy address...");
  await (
    await cube.setPrizePoap(PRIZE_POAP_PROXY_ADDRESS, await calcMaxGas(false))
  ).wait();
  console.log("Set PrizePoapProxy address:", PRIZE_POAP_PROXY_ADDRESS);

  console.log("Completed init");

  console.log("");
  console.log("---------------------------------------------");
  console.log("--- End Cube Init ---------------------------");
  console.log("---------------------------------------------");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
