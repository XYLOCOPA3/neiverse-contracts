import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { deploy } from "./Deployment/Deployment";

describe("QuestPoap", function () {
  async function init() {
    const { questPoap } = await loadFixture(deploy);

    return { questPoap };
  }

  describe("デプロイ", function () {
    it("デプロイできるか", async function () {
      const { questPoap } = await loadFixture(init);

      expect(questPoap.contract.address).to.not.equal(
        ethers.constants.AddressZero,
        "0アドレス",
      );
    });
  });
});
