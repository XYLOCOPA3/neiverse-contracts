import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import { getWalletAddress } from "../utils/WalletAddress";
import { deploy } from "./Deployment/Deployment";

describe("CommunityPassport", function () {
  async function init() {
    const { user1, user2, user3 } = await loadFixture(getWalletAddress);
    const { communityPassport } = await loadFixture(deploy);

    // ユーザーがコミュニティパスポートを発行
    await (await communityPassport.contract1.connect(user1).mint()).wait();
    await (await communityPassport.contract1.connect(user3).mint()).wait();
    await (await communityPassport.contract2.connect(user2).mint()).wait();
    await (await communityPassport.contract2.connect(user3).mint()).wait();

    return {
      communityPassport,
    };
  }

  describe("デプロイ", function () {
    it("正常系: 初期値が正しくセットされているか", async function () {
      const { deployer, admin1, admin2 } = await loadFixture(getWalletAddress);
      const { communityPassport } = await loadFixture(init);

      expect(await communityPassport.contract1.name()).to.equal(
        communityPassport.args1.name,
        "name",
      );
      expect(await communityPassport.contract1.symbol()).to.equal(
        communityPassport.args1.symbol,
        "symbol",
      );
      expect(await communityPassport.contract1.baseURI()).to.equal(
        communityPassport.args1.baseURI,
        "baseURI",
      );
      expect(await communityPassport.contract1.firstURI()).to.equal(
        communityPassport.args1.firstURI,
        "firstURI",
      );
      expect(await communityPassport.contract1.contractURI()).to.equal(
        communityPassport.args1.contractURI,
        "contractURI",
      );
      expect(await communityPassport.contract1.communityId()).to.equal(
        communityPassport.args1.communityId,
        "communityId",
      );
      expect(
        await communityPassport.contract1.isAdmin(admin1.address),
      ).to.equal(true, "admin1");
      expect(
        await communityPassport.contract1.isAdmin(admin2.address),
      ).to.equal(true, "admin2");
      expect(
        await communityPassport.contract1.isAdmin(deployer.address),
      ).to.equal(false, "deployer");
    });
  });

  describe("アップグレード", function () {
    it("正常系: アップグレードできるか", async function () {
      const { communityPassport } = await loadFixture(init);

      const CommunityPassportV2 = await ethers.getContractFactory(
        "CommunityPassportV2",
      );
      const communityPassportBeaconV2 = await upgrades.upgradeBeacon(
        communityPassport.beacon.address,
        CommunityPassportV2,
      );
      await communityPassportBeaconV2.deployed();
      const communityPassportV2 = CommunityPassportV2.attach(
        communityPassport.proxy1.address,
      );

      expect(await communityPassportV2.sayHello()).to.equal(
        "Hello, World!",
        "アップグレード",
      );
    });
  });

  describe("メソッド: getPassport", function () {
    it("正常系: パスポートを取得できるか", async function () {
      const { user1 } = await loadFixture(getWalletAddress);
      const { communityPassport } = await loadFixture(init);

      const passport = await communityPassport.contract1.getPassport(
        user1.address,
      );

      expect(passport.passportURI).to.equal("baseURI1firstURI1", "passportURI");
      expect(passport.user).to.equal(user1.address, "user");
      expect(passport.exp).to.equal(0, "exp");
    });
  });

  describe("メソッド: getPassportList", function () {
    it("正常系: パスポートリストを取得できるか", async function () {
      const { user3 } = await loadFixture(getWalletAddress);
      const { communityPassport } = await loadFixture(init);

      const page = 0;
      const pageSize = 100;
      const result = await communityPassport.contract1.getPassportList(
        page,
        pageSize,
      );
      const passportList = result[0];
      const length = result[1];
      const passport = passportList[1];

      expect(length).to.equal(2, "length");
      expect(passportList.length).to.equal(2, "length");
      expect(passport.passportURI).to.equal("baseURI1firstURI1", "passportURI");
      expect(passport.user).to.equal(user3.address, "user");
      expect(passport.exp).to.equal(0, "exp");
    });

    it("異常系: ページサイズが不正", async function () {
      const { communityPassport } = await loadFixture(init);

      const page = 0;
      const pageSize = 0;

      await expect(
        communityPassport.contract1.getPassportList(page, pageSize),
      ).to.be.revertedWith("page size must be positive");
    });
  });

  describe("メソッド: getUserList", function () {
    it("正常系: パスポート所有者リストを取得できるか", async function () {
      const { user3 } = await loadFixture(getWalletAddress);
      const { communityPassport } = await loadFixture(init);

      const page = 0;
      const pageSize = 100;
      const result = await communityPassport.contract1.getUserList(
        page,
        pageSize,
      );
      const userList = result[0];
      const length = result[1];
      const user = userList[1];

      expect(length).to.equal(2, "length");
      expect(userList.length).to.equal(2, "length");
      expect(user).to.equal(user3.address, "user");
    });

    it("異常系: ページサイズが不正", async function () {
      const { communityPassport } = await loadFixture(init);

      const page = 0;
      const pageSize = 0;

      await expect(
        communityPassport.contract1.getUserList(page, pageSize),
      ).to.be.revertedWith("page size must be positive");
    });
  });
});
