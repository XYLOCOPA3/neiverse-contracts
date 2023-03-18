import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { keccak256 } from "@ethersproject/keccak256";

describe("CommunityPassport", function () {
  async function addressFixture() {
    const [deployer, user] = await ethers.getSigners();
    return {
      deployer,
      user,
    };
  }

  async function deployFixture() {
    const { deployer } = await loadFixture(addressFixture);
    const CommunityPassport = await ethers.getContractFactory(
      "CommunityPassport"
    );
    const communityPassport = await CommunityPassport.deploy(
      "name",
      "symbol",
      "baseURI",
      "contractURI",
      0
    );
    await communityPassport.deployed();
    return {
      communityPassport,
      deployer,
    };
  }

  // async function setExpFixture() {
  //   const { deployer, fan, notCreater } = await loadFixture(addressFixture);
  //   const { communityPassport } = await loadFixture(safeMintFixture);
  //   const setExpTx = await communityPassport.setExp(fan.address, 100);
  //   await setExpTx.wait();
  //   const tokenId = await communityPassport.hashMsgSender(fan.address);
  //   return {
  //     communityPassport,
  //     setExpTx,
  //     tokenId,
  //     deployer,
  //     fan,
  //     notCreater,
  //   };
  // }

  async function setBaseURIFixture() {
    const { deployer, user } = await loadFixture(addressFixture);
    const { communityPassport } = await loadFixture(deployFixture);
    const newBaseURI = "newBaseURI";
    const setBaseURITx = await communityPassport.setBaseURI(newBaseURI);
    await setBaseURITx.wait();
    return {
      communityPassport,
      user,
      setBaseURITx,
      newBaseURI,
      deployer,
    };
  }

  async function setContractURIFixture() {
    const { deployer, user } = await loadFixture(addressFixture);
    const { communityPassport } = await loadFixture(deployFixture);
    const newContractURI = "newContractURI";
    const setContractURITx = await communityPassport.setContractURI(
      newContractURI
    );
    await setContractURITx.wait();
    return {
      communityPassport,
      user,
      setContractURITx,
      newContractURI,
      deployer,
    };
  }

  async function hashMsgSenderFixture() {
    const { user } = await loadFixture(addressFixture);
    const { communityPassport } = await loadFixture(deployFixture);
    const hashedFanAddress = await communityPassport.hashMsgSender(
      user.address
    );
    return {
      hashedFanAddress,
      user,
    };
  }

  async function tokenURIFixture() {
    const { user } = await loadFixture(addressFixture);
    const { communityPassport } = await loadFixture(safeMintFixture);
    const tokenId = await communityPassport.hashMsgSender(user.address);
    const tokenURI = await communityPassport.tokenURI(tokenId);
    return {
      communityPassport,
      tokenURI,
    };
  }

  async function getTokenURIFromAddressFixture() {
    const { user } = await loadFixture(addressFixture);
    const { communityPassport } = await loadFixture(safeMintFixture);
    const tokenURI = await communityPassport.getTokenURIFromAddress(
      user.address
    );
    return {
      communityPassport,
      tokenURI,
    };
  }

  async function safeMintFixture() {
    const { user } = await loadFixture(addressFixture);
    const { communityPassport } = await loadFixture(deployFixture);
    const safeMintTx = await communityPassport.connect(user).safeMint();
    await safeMintTx.wait();
    const tokenId = await communityPassport.hashMsgSender(user.address);
    return {
      communityPassport,
      user,
      tokenId,
    };
  }

  async function burnFixture() {
    const { user } = await loadFixture(addressFixture);
    const { communityPassport } = await loadFixture(safeMintFixture);
    const burnTx = await communityPassport.connect(user).burn();
    await burnTx.wait();
    const tokenId = await communityPassport.hashMsgSender(user.address);
    return {
      communityPassport,
      tokenId,
    };
  }

  describe("デプロイ", function () {
    it("デプロイできたか", async function () {
      const { communityPassport } = await loadFixture(deployFixture);
      expect(communityPassport.address).to.not.equal(
        ethers.constants.AddressZero,
        "0アドレス"
      );
    });

    it("baseURIが正しくセットされているか", async function () {
      const { communityPassport } = await loadFixture(deployFixture);
      expect(await communityPassport.baseURI()).to.equal("baseURI", "baseURI");
    });

    it("contractURIが正しくセットされているか", async function () {
      const { communityPassport } = await loadFixture(deployFixture);
      expect(await communityPassport.contractURI()).to.equal(
        "contractURI",
        "contractURI"
      );
    });

    it("communityIdが正しくセットされているか", async function () {
      const { communityPassport } = await loadFixture(deployFixture);
      expect(await communityPassport.communityId()).to.equal(0, "communityId");
    });

    it("ownerが正しくセットされているか", async function () {
      const { communityPassport, deployer } = await loadFixture(deployFixture);
      expect(await communityPassport.owner()).to.equal(
        deployer.address,
        "deployer"
      );
    });
  });

  // describe("メソッド: setExp", function () {
  //   it("経験値をセットできたか", async function () {
  //     const { communityPassport, tokenId } = await loadFixture(setExpFixture);
  //     expect((await communityPassport.getPassport(tokenId)).exp).to.equal(
  //       100,
  //       "exp"
  //     );
  //   });

  //   it("一度バーンしても再度ミントすると以前のメタデータを引き継げるか", async function () {
  //     const { communityPassport, fan, tokenId } = await loadFixture(
  //       setExpFixture
  //     );
  //     const burnTx = await communityPassport.connect(fan).burn();
  //     await burnTx.wait();
  //     const safeMintTx = await communityPassport.connect(fan).safeMint();
  //     await safeMintTx.wait();
  //     expect((await communityPassport.getPassport(tokenId)).exp).to.equal(
  //       100,
  //       "exp"
  //     );
  //   });

  //   it("SetExpイベントを正しく発行できているか", async function () {
  //     const { communityPassport, setExpTx, tokenId, deployer, fan } =
  //       await loadFixture(setExpFixture);
  //     await expect(setExpTx)
  //       .to.emit(communityPassport, "SetExp")
  //       .withArgs(deployer.address, fan.address, tokenId, 0, 100);
  //   });

  //   it("オーナー以外は実行できないか", async function () {
  //     const { communityPassport, fan } = await loadFixture(setExpFixture);
  //     await expect(
  //       communityPassport.connect(fan).setExp(fan.address, 10000)
  //     ).to.be.revertedWith("Ownable: caller is not the owner");
  //   });

  //   it("存在しないトークンに対しては実行できないか", async function () {
  //     const { communityPassport, notCreater } = await loadFixture(
  //       setExpFixture
  //     );
  //     await expect(
  //       communityPassport.setExp(notCreater.address, 10000)
  //     ).to.be.revertedWith("This token doesn't exist");
  //   });
  // });

  describe("メソッド: setBaseURI", function () {
    it("baseURIをセットできたか", async function () {
      const { communityPassport, newBaseURI } = await loadFixture(
        setBaseURIFixture
      );
      expect(await communityPassport.baseURI()).to.equal(newBaseURI, "baseURI");
    });

    it("オーナー以外は実行できないか", async function () {
      const { communityPassport, user } = await loadFixture(setBaseURIFixture);
      await expect(
        communityPassport.connect(user).setBaseURI("newBaseURI")
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("SetBaseURIイベントを正しく発行できているか", async function () {
      const { communityPassport, setBaseURITx, deployer, newBaseURI } =
        await loadFixture(setBaseURIFixture);
      await expect(setBaseURITx)
        .to.emit(communityPassport, "SetBaseURI")
        .withArgs(deployer.address, "baseURI", newBaseURI);
    });
  });

  describe("メソッド: setContractURI", function () {
    it("contractURIをセットできたか", async function () {
      const { communityPassport, newContractURI } = await loadFixture(
        setContractURIFixture
      );
      expect(await communityPassport.contractURI()).to.equal(
        newContractURI,
        "contractURI"
      );
    });

    it("オーナー以外は実行できないか", async function () {
      const { communityPassport, user } = await loadFixture(
        setContractURIFixture
      );
      await expect(
        communityPassport.connect(user).setContractURI("newContractURI")
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("SetContractURIイベントを正しく発行できているか", async function () {
      const { communityPassport, setContractURITx, deployer, newContractURI } =
        await loadFixture(setContractURIFixture);
      await expect(setContractURITx)
        .to.emit(communityPassport, "SetContractURI")
        .withArgs(deployer.address, "contractURI", newContractURI);
    });
  });

  describe("メソッド: hashMsgSender", function () {
    it("addressをhash値に変換できたか", async function () {
      const { hashedFanAddress, user } = await loadFixture(
        hashMsgSenderFixture
      );
      expect(hashedFanAddress).to.equal(
        BigInt(keccak256(user.address)),
        "hashedFanAddress"
      );
    });
  });

  describe("メソッド: tokenURI", function () {
    it("tokenURIを正しく取得できたか", async function () {
      const { communityPassport, tokenURI } = await loadFixture(
        tokenURIFixture
      );
      const baseURI = await communityPassport.baseURI();
      expect(tokenURI).to.equal(`${baseURI}`, "tokenURI");
    });

    it("存在しないトークンに対しては実行できないか", async function () {
      const { communityPassport } = await loadFixture(tokenURIFixture);
      await expect(communityPassport.tokenURI(0)).to.be.revertedWith(
        "ERC721: invalid token ID"
      );
    });
  });

  describe("メソッド: getTokenURIFromAddress", function () {
    it("tokenURIをaddressから正しく取得できたか", async function () {
      const { communityPassport, tokenURI } = await loadFixture(
        getTokenURIFromAddressFixture
      );
      const baseURI = await communityPassport.baseURI();
      expect(tokenURI).to.equal(`${baseURI}`, "tokenURI");
    });
  });

  describe("メソッド: safeMint", function () {
    it("ミントできたか", async function () {
      const { communityPassport, user, tokenId } = await loadFixture(
        safeMintFixture
      );
      expect(await communityPassport.ownerOf(tokenId)).to.equal(
        user.address,
        "ownerOf"
      );
      expect(await communityPassport.totalSupply()).to.equal(1, "tokenSupply");
    });
  });

  describe("メソッド: burn", function () {
    it("バーンできたか", async function () {
      const { communityPassport, tokenId } = await loadFixture(burnFixture);
      await expect(communityPassport.ownerOf(tokenId)).to.be.revertedWith(
        "ERC721: invalid token ID"
      );
      expect(await communityPassport.totalSupply()).to.equal(0, "tokenSupply");
    });
  });
});
