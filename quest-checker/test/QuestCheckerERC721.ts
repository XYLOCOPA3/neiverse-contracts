import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("QuestCheckerERC721", function () {
  async function addressFixture() {
    const [deployer] = await ethers.getSigners();
    return { deployer };
  }

  async function deployFixture() {
    // const { deployer } = await loadFixture(addressFixture);
    const QuestCheckerERC721 = await ethers.getContractFactory(
      "QuestCheckerERC721"
    );
    const erc721 = ethers.constants.AddressZero;
    const questBoard = ethers.constants.AddressZero;
    const questCheckerERC721 = await QuestCheckerERC721.deploy(
      erc721,
      questBoard
    );
    await questCheckerERC721.deployed();
    return { questCheckerERC721 };
  }

  describe("デプロイ", function () {
    it("デプロイできるか", async function () {
      const { questCheckerERC721 } = await loadFixture(deployFixture);
      expect(questCheckerERC721.address).to.not.equal(
        ethers.constants.AddressZero,
        "0アドレス"
      );
    });
  });
});
