import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { getWalletAddress } from "../utils/WalletAddress";
import { deploy } from "./Deployment/Deployment";

describe("CommunityPassportCreater", function () {
  async function init() {
    const { communityPassport, communityPassportCreater } = await loadFixture(
      deploy,
    );

    // コントラクトのイベントを監視する
    const filter = communityPassportCreater.contract.filters.CreatedPassport();

    // イベントを監視して、イベントが発生したときに処理を行う
    const eventPromise = new Promise((resolve, reject) => {
      communityPassportCreater.contract.on(
        filter,
        (publisher, beacon, data, passportAddr) => {
          resolve(passportAddr);
        },
      );
    });

    // コミュニティパスポートを作成する
    const tx = await communityPassportCreater.contract.createCommunityPassport(
      communityPassport.args1.name,
      communityPassport.args1.symbol,
      communityPassport.args1.baseURI,
      communityPassport.args1.firstURI,
      communityPassport.args1.contractURI,
      communityPassport.args1.communityId,
      communityPassport.args1.adminList,
    );

    // イベントが発生するまで待機する
    const passportAddr = (await eventPromise) as string;

    // イベントの監視を解除する
    communityPassportCreater.contract.removeAllListeners(filter);

    // 作成したコミュニティパスポートのコントラクトを取得する
    const CommunityPassport = await ethers.getContractFactory(
      "CommunityPassport",
    );
    const newCommunityPassportContract = CommunityPassport.attach(passportAddr);

    return {
      communityPassportCreater,
      communityPassport,
      newCommunityPassportContract,
      tx,
    };
  }

  describe("デプロイ", function () {
    it("正常系: デプロイできるか", async function () {
      const { communityPassportCreater } = await loadFixture(init);
      expect(communityPassportCreater.contract.address).to.not.equal(
        ethers.constants.AddressZero,
        "0アドレス",
      );
    });
  });

  describe("メソッド: createCommunityPassport", function () {
    it("正常系: パスポートを作成できているか", async function () {
      const { admin1 } = await loadFixture(getWalletAddress);
      const { newCommunityPassportContract, communityPassport } =
        await loadFixture(init);

      expect(await newCommunityPassportContract.name()).to.equal(
        communityPassport.args1.name,
        "name",
      );
      expect(await newCommunityPassportContract.symbol()).to.equal(
        communityPassport.args1.symbol,
        "symbol",
      );
      expect(await newCommunityPassportContract.baseURI()).to.equal(
        communityPassport.args1.baseURI,
        "baseURI",
      );
      expect(await newCommunityPassportContract.firstURI()).to.equal(
        communityPassport.args1.firstURI,
        "firstURI",
      );
      expect(await newCommunityPassportContract.contractURI()).to.equal(
        communityPassport.args1.contractURI,
        "contractURI",
      );
      expect(await newCommunityPassportContract.communityId()).to.equal(
        communityPassport.args1.communityId,
        "communityId",
      );
      expect(
        await newCommunityPassportContract.isAdmin(admin1.address),
      ).to.equal(true, "admin1");
    });

    it("正常系: 所有者を変更できているか", async function () {
      const { deployer } = await loadFixture(getWalletAddress);
      const { newCommunityPassportContract } = await loadFixture(init);

      expect(await newCommunityPassportContract.owner()).to.equal(
        deployer.address,
        "owner",
      );
    });

    it("正常系: `CreatedPassport` イベントを正しく出力できるか", async function () {
      const { deployer } = await loadFixture(getWalletAddress);
      const { communityPassportCreater, communityPassport, tx } =
        await loadFixture(init);

      const CommunityPassport = await ethers.getContractFactory(
        "CommunityPassport",
      );
      const data = CommunityPassport.interface.encodeFunctionData(
        "initialize",
        [
          communityPassport.args1.name,
          communityPassport.args1.symbol,
          communityPassport.args1.baseURI,
          communityPassport.args1.firstURI,
          communityPassport.args1.contractURI,
          communityPassport.args1.communityId,
          communityPassport.args1.adminList,
        ],
      );

      await expect(tx)
        .to.emit(communityPassportCreater.contract, "CreatedPassport")
        .withArgs(
          deployer.address,
          communityPassport.beacon.address,
          data,
          anyValue,
        );
    });
  });
});
