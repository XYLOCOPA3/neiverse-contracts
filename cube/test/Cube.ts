import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Cube", function () {
  async function addressFixture() {
    const [deployer] = await ethers.getSigners();
    return { deployer };
  }

  async function deployFixture() {
    // const { deployer } = await loadFixture(addressFixture);
    const Cube = await ethers.getContractFactory("Cube");
    const prizePoap = ethers.constants.AddressZero;
    const cube = await Cube.deploy(prizePoap);
    await cube.deployed();
    return { cube };
  }

  describe("デプロイ", function () {
    it("デプロイできるか", async function () {
      const { cube } = await loadFixture(deployFixture);
      expect(cube.address).to.not.equal(
        ethers.constants.AddressZero,
        "0アドレス"
      );
    });
  });
});
