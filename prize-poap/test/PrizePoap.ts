import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("PrizePoap", function () {
  async function addressFixture() {
    const [deployer] = await ethers.getSigners();
    return { deployer };
  }

  async function deployFixture() {
    // const { deployer } = await loadFixture(addressFixture);
    const PrizePoap = await ethers.getContractFactory("PrizePoap");
    const communityPortal = ethers.constants.AddressZero;
    const questBoard = ethers.constants.AddressZero;
    const baseURI = "ipfs://";
    const prizePoap = await PrizePoap.deploy(
      communityPortal,
      questBoard,
      baseURI
    );
    await prizePoap.deployed();
    return { prizePoap };
  }

  describe("デプロイ", function () {
    it("デプロイできるか", async function () {
      const { prizePoap } = await loadFixture(deployFixture);
      expect(prizePoap.address).to.not.equal(
        ethers.constants.AddressZero,
        "0アドレス"
      );
    });
  });
});
