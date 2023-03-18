import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("CommunityPortal", function () {
  async function addressFixture() {
    const [deployer, creater, notCreater, fan] = await ethers.getSigners();
    return {
      deployer,
      creater,
      notCreater,
      fan,
    };
  }

  async function deployFixture() {
    const { deployer } = await loadFixture(addressFixture);
    const CommunityPortal = await ethers.getContractFactory("CommunityPortal");
    const passportCreater = ethers.constants.AddressZero;
    const questBoard = ethers.constants.AddressZero;
    const communityPortal = await CommunityPortal.deploy(
      passportCreater,
      questBoard
    );
    await communityPortal.deployed();
    return {
      communityPortal,
      deployer,
    };
  }

  //   async function createCommunityFixture() {
  //     const { creater, notCreater } = await loadFixture(addressFixture);
  //     const { communityPortal: communities } = await loadFixture(deployFixture);
  //     const createCommunityTx = await communities.createCommunity(
  //       creater.address,
  //       "communityURI",
  //       "name",
  //       "contractURI"
  //     );
  //     await createCommunityTx.wait();
  //     const community = await communities.allCommunities(0);
  //     const Passport = await ethers.getContractFactory("Passport");
  //     const passport = Passport.attach(community.passport);

  //     return {
  //       communities,
  //       community,
  //       passport,
  //       creater,
  //       notCreater,
  //       createCommunityTx,
  //     };
  //   }

  //   async function setExpFixture() {
  //     const { fan } = await loadFixture(addressFixture);
  //     const { communities, passport } = await loadFixture(createCommunityFixture);
  //     const safeMintTx = await passport.connect(fan).safeMint();
  //     await safeMintTx.wait();
  //     const setExpTx = await communities.setExp(0, fan.address, 100);
  //     await setExpTx.wait();
  //     const tokenId = await passport.hashMsgSender(fan.address);

  //     return {
  //       passport,
  //       tokenId,
  //     };
  //   }

  //   async function setCommunityURIFixture() {
  //     const { fan } = await loadFixture(addressFixture);
  //     const { communities } = await loadFixture(createCommunityFixture);
  //     const communityId = 0;
  //     const setCommunityURITx = await communities.setCommunityURI(
  //       communityId,
  //       "newCommunityURI"
  //     );
  //     await setCommunityURITx.wait();
  //     const community = await communities.allCommunities(communityId);
  //     return {
  //       community,
  //       setCommunityURITx,
  //       communities,
  //       communityId,
  //       fan,
  //     };
  //   }

  //   async function communitySupplyFixture() {
  //     const { communities } = await loadFixture(createCommunityFixture);
  //     return {
  //       communities,
  //     };
  //   }

  describe("デプロイ", function () {
    it("デプロイできたか", async function () {
      const { communityPortal: communities } = await loadFixture(deployFixture);
      expect(communities.address).to.not.equal(
        ethers.constants.AddressZero,
        "0アドレス"
      );
    });

    //     it("デプロイしたアドレスがownerにセットされているか", async function () {
    //       const { communityPortal: communities, deployer } = await loadFixture(
    //         deployFixture
    //       );
    //       expect(await communities.owner()).to.equal(deployer.address, "オーナー");
    //     });
  });

  //   describe("メソッド: createCommunity", function () {
  //     it("コミュニティを作成できたか", async function () {
  //       const { community, creater } = await loadFixture(createCommunityFixture);
  //       expect(community.passport).to.not.equal(
  //         ethers.constants.AddressZero,
  //         "passport"
  //       );
  //       expect(community.isClose).to.equal(false, "isClose");
  //       expect(community.creater).to.equal(creater.address, "creater");
  //       expect(community.communityURI).to.equal("communityURI", "communityURI");
  //     });

  //     it("パスポートを作成できたか", async function () {
  //       const { communities, passport, creater, notCreater } = await loadFixture(
  //         createCommunityFixture
  //       );
  //       expect(await passport.name()).to.equal("name Passport", "name");
  //       expect(await passport.symbol()).to.equal("name SBT", "symbol");
  //       expect(await passport.communityId()).to.equal(0, "communityId");
  //       expect(await passport.contractURI()).to.equal(
  //         "contractURI",
  //         "contractURI"
  //       );
  //       expect(await passport.ownerCheck(communities.address)).to.equal(
  //         true,
  //         "Communitiesコントラクト"
  //       );
  //       expect(await passport.ownerCheck(creater.address)).to.equal(
  //         true,
  //         "creater"
  //       );
  //       expect(await passport.ownerCheck(notCreater.address)).to.equal(
  //         false,
  //         "notCreater"
  //       );
  //     });

  //     it("Createイベントを正しく発行できているか", async function () {
  //       const { communities, community, passport, creater, createCommunityTx } =
  //         await loadFixture(createCommunityFixture);
  //       await expect(createCommunityTx)
  //         .to.emit(communities, "Create")
  //         .withArgs(
  //           communities.address,
  //           creater.address,
  //           0,
  //           passport.address,
  //           community.communityURI
  //         );
  //     });

  //     it("オーナー以外は実行できないか", async function () {
  //       const { communities, creater } = await loadFixture(
  //         createCommunityFixture
  //       );
  //       await expect(
  //         communities
  //           .connect(creater)
  //           .createCommunity(
  //             creater.address,
  //             "communityURI",
  //             "name",
  //             "contructURI"
  //           )
  //       ).to.be.revertedWith("Ownable: caller is not the owner");
  //     });
  //   });

  //   describe("メソッド: setExp", function () {
  //     it("経験値をセットできたか", async function () {
  //       const { passport, tokenId } = await loadFixture(setExpFixture);
  //       expect(await passport.exp(tokenId)).to.equal(100, "exp");
  //     });
  //   });

  //   describe("メソッド: setCommunityURI", function () {
  //     it("communityURIをセットできたか", async function () {
  //       const { community } = await loadFixture(setCommunityURIFixture);
  //       expect(community.communityURI).to.equal(
  //         "newCommunityURI",
  //         "communityURI"
  //       );
  //     });

  //     it("SetCommunityURIイベントを正しく発行できているか", async function () {
  //       const { community, setCommunityURITx, communities } = await loadFixture(
  //         setCommunityURIFixture
  //       );
  //       await expect(setCommunityURITx)
  //         .to.emit(communities, "SetCommunityURI")
  //         .withArgs(0, "communityURI", community.communityURI);
  //     });

  //     it("オーナー以外は実行できないか", async function () {
  //       const { communities, communityId, fan } = await loadFixture(
  //         setCommunityURIFixture
  //       );
  //       await expect(
  //         communities.connect(fan).setCommunityURI(communityId, "newCommunityURI")
  //       ).to.be.revertedWith("Ownable: caller is not the owner");
  //     });
  //   });

  //   describe("メソッド: communitySupplyFixture", function () {
  //     it("communityURIをセットできたか", async function () {
  //       const { communities } = await loadFixture(communitySupplyFixture);
  //       expect(await communities.communitySupply()).to.equal(
  //         1,
  //         "communitySupply"
  //       );
  //     });
  //   });
});
