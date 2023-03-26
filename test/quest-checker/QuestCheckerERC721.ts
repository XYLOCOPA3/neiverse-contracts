import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { deploy } from "./Deployment/Deployment";

describe("QuestCheckerERC721", function () {
  async function init() {
    const { questCheckerERC721 } = await loadFixture(deploy);

    return { questCheckerERC721 };
  }

  describe("デプロイ", function () {
    it("デプロイできるか", async function () {
      const { questCheckerERC721 } = await loadFixture(init);

      expect(questCheckerERC721.contract.address).to.not.equal(
        ethers.constants.AddressZero,
        "0アドレス",
      );
    });
  });
});
