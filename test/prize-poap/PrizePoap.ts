import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { deploy } from "./Deployment/Deployment";

describe("PrizePoap", function () {
  async function init() {
    const { prizePoap } = await loadFixture(deploy);

    return { prizePoap };
  }

  describe("デプロイ", function () {
    it("デプロイできるか", async function () {
      const { prizePoap } = await loadFixture(init);

      expect(prizePoap.contract.address).to.not.equal(
        ethers.constants.AddressZero,
        "0アドレス",
      );
    });
  });
});
