import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { deploy } from "./Deployment/Deployment";

describe("QuestCheckerCreater", function () {
  async function init() {
    const { questCheckerCreater } = await loadFixture(deploy);

    return { questCheckerCreater };
  }

  describe("デプロイ", function () {
    it("デプロイできるか", async function () {
      const { questCheckerCreater } = await loadFixture(init);
      expect(questCheckerCreater.contract.address).to.not.equal(
        ethers.constants.AddressZero,
        "0アドレス",
      );
    });
  });
});
