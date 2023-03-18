import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("QuestCheckerCreater", function () {
  async function addressFixture() {
    const [deployer] = await ethers.getSigners();
    return { deployer };
  }

  async function deployFixture() {
    // const { deployer } = await loadFixture(addressFixture);
    const QuestCheckerCreater = await ethers.getContractFactory(
      "QuestCheckerCreater"
    );
    const questCheckerCreater = await QuestCheckerCreater.deploy();
    await questCheckerCreater.deployed();
    return { questCheckerCreater };
  }

  async function createQuestCheckerFixture() {
    const { deployer } = await loadFixture(addressFixture);
    const { questCheckerCreater } = await loadFixture(deployFixture);
    const questCheckerCreaterTx = await questCheckerCreater.createQuestChecker(
      "0x80ac58cd",
      deployer.address
    );
    const questCheckerCreaterReceipt = await questCheckerCreaterTx.wait();
    return { questCheckerCreaterReceipt };
  }

  describe("デプロイ", function () {
    it("デプロイできるか", async function () {
      const { questCheckerCreater } = await loadFixture(deployFixture);
      expect(questCheckerCreater.address).to.not.equal(
        ethers.constants.AddressZero,
        "0アドレス"
      );
    });
  });

  // describe("メソット: createQuestChecker", function () {
  //   it("ERC721を認識できるか", async function () {
  //     const { questCheckerCreaterReceipt } = await loadFixture(
  //       createQuestCheckerFixture
  //     );
  //     console.log(questCheckerCreaterReceipt.logs);
  //     console.log(questCheckerCreaterReceipt.events);
  //     console.log(new ethers.utils.Interface(abiRouter));
  //     expect(questCheckerCreater.address).to.not.equal(
  //       ethers.constants.AddressZero,
  //       "0アドレス"
  //     );
  //   });
  // });
});
