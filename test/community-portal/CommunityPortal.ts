import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { deploy } from "./Deployment/Deployment";

describe("CommunityPortal", function () {
  async function init() {
    const { communityPortal } = await loadFixture(deploy);

    return {
      communityPortal,
    };
  }

  describe("デプロイ", function () {
    it("デプロイできたか", async function () {
      const { communityPortal } = await loadFixture(init);

      expect(communityPortal.contract.address).to.not.equal(
        ethers.constants.AddressZero,
        "0アドレス",
      );
    });
  });
});
