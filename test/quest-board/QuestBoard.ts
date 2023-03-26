import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { deploy } from "./Deployment/Deployment";

describe("QuestBoard", function () {
  async function init() {
    const { questBoard } = await loadFixture(deploy);

    return { questBoard };
  }

  describe("デプロイ", function () {
    it("デプロイできるか", async function () {
      const { questBoard } = await loadFixture(init);

      expect(questBoard.contract.address).to.not.equal(
        ethers.constants.AddressZero,
        "0アドレス",
      );
    });
  });
});
