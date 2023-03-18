import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("QuestPoap", function () {
  async function addressFixture() {
    const [deployer] = await ethers.getSigners();
    return { deployer };
  }

  async function deployFixture() {
    // const { deployer } = await loadFixture(addressFixture);
    const QuestPoap = await ethers.getContractFactory("QuestPoap");
    const questPoap = await QuestPoap.deploy("QUEST");
    await questPoap.deployed();
    return { questPoap };
  }

  describe("デプロイ", function () {
    it("デプロイできるか", async function () {
      const { questPoap } = await loadFixture(deployFixture);
      expect(questPoap.address).to.not.equal(
        ethers.constants.AddressZero,
        "0アドレス"
      );
    });
  });
});
