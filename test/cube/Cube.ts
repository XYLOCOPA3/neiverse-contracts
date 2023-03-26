import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { deploy } from "./Deployment/Deployment";

describe("Cube", function () {
  async function init() {
    const { cube } = await loadFixture(deploy);

    return { cube };
  }

  describe("デプロイ", function () {
    it("デプロイできるか", async function () {
      const { cube } = await loadFixture(init);

      expect(cube.contract.address).to.not.equal(
        ethers.constants.AddressZero,
        "0アドレス",
      );
    });
  });
});
