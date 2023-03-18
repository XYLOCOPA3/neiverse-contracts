import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("CommunityPassportCreater", function () {
  async function addressFixture() {
    const [deployer, creater, notCreater, fan] = await ethers.getSigners();
    return {
      deployer,
      creater,
      notCreater,
      fan,
    };
  }

  async function deployFixture() {
    const { deployer, creater, notCreater } = await loadFixture(addressFixture);
    const CommunityPassportCreater = await ethers.getContractFactory(
      "CommunityPassportCreater"
    );
    const communityPassportCreater = await CommunityPassportCreater.deploy();
    await communityPassportCreater.deployed();
    return {
      communityPassportCreater,
      deployer,
      creater,
      notCreater,
    };
  }

  describe("デプロイ", function () {
    it("デプロイできたか", async function () {
      const { communityPassportCreater } = await loadFixture(deployFixture);
      expect(communityPassportCreater.address).to.not.equal(
        ethers.constants.AddressZero,
        "0アドレス"
      );
    });
  });
});
