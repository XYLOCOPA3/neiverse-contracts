import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("QuestBoard", function () {
  async function addressFixture() {
    const [deployer] = await ethers.getSigners();
    return { deployer };
  }

  async function deployFixture() {
    // const { deployer } = await loadFixture(addressFixture);
    const QuestBoard = await ethers.getContractFactory("QuestBoard");
    const communityPotalAddress = ethers.constants.AddressZero;
    const questCheckerCreaterAddress = ethers.constants.AddressZero;
    const prizePoap = ethers.constants.AddressZero;
    const questBoard = await QuestBoard.deploy(
      communityPotalAddress,
      questCheckerCreaterAddress,
      prizePoap
    );
    await questBoard.deployed();
    return { questBoard };
  }

  describe("デプロイ", function () {
    it("デプロイできるか", async function () {
      const { questBoard } = await loadFixture(deployFixture);
      expect(questBoard.address).to.not.equal(
        ethers.constants.AddressZero,
        "0アドレス"
      );
    });
  });
});
