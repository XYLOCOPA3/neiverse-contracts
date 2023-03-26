// --------------------------------------------------
// CommunityPassport
// --------------------------------------------------

export const COMMUNITY_PASSPORT_BEACON_ADDRESS =
  "0x8325060c2Ec703cA43A4fA649F5612355ee678ef";

// --------------------------------------------------
// CommunityPassportCreater
// --------------------------------------------------

export const COMMUNITY_PASSPORT_CREATER_ADDRESS =
  "0x4d18f0B122dEa961c46163e27fD7aC129d4Bd10d";

// --------------------------------------------------
// CommunityPortal
// --------------------------------------------------

export const COMMUNITY_PORTAL_PROXY_ADDRESS =
  "0xC10eAeDef5c4ed99190FC3864c0A917DAE171eb5";

export const COMMUNITY_INIT_DATA = {
  community1: {
    name: "FANBASE",
    baseURI: "ipfs://",
    firstURI: "bafkreifdnoixhvg5j3egyykl7ctcs5kshajlu6orwgty2wx5pb7ut33gqa",
    contractURI:
      "ipfs://bafkreigwebay3llbklvxfnlmjyr7bvx4rivlyygdrkvhbwbylepgfbp4ei",
    adminList: [
      "0x31F31693723c4397cb8A978A19A95B82c72f4212",
      "0x019281ce34F8b8739991713D5E09D0C290B53886",
    ],
  },
  community2: {
    name: "Transmit Streamers",
    baseURI: "ipfs://",
    firstURI: "bafkreidxgkj4q36assf7gox7afrlzkkrpu4xfxejzbjv5k5f7wnziwc5ji",
    contractURI:
      "ipfs://bafkreibxs7qvatg35kbve5stlerr3x46dbt2vuhvemkuieeanyygltjykq",
    adminList: [
      "0x31F31693723c4397cb8A978A19A95B82c72f4212",
      "0x019281ce34F8b8739991713D5E09D0C290B53886",
    ],
  },
};

// --------------------------------------------------
// Cube
// --------------------------------------------------

export const CUBE_PROXY_ADDRESS = "0xc1a0FF16f35923beF434367910FAd988498f6EFf";

// --------------------------------------------------
// PrizePoap
// --------------------------------------------------

export const PRIZE_POAP_PROXY_ADDRESS =
  "0x4F8f70a8bD85d74f318Db274f33a8be0B0A32b46";

export const PRIZE_POAP_BASE_URI = "ipfs://";

export const COMMUNITY_INIT_PRIZE = {
  community1: {
    prize1: {
      tokenURI: "bafkreibaadgoiqrouh5cnqfetzrt2pqunb2coi5wmivjhji64b3g6teqbm",
      communityId: 0,
      requiredExp: 100,
      requiredQuestId: 0,
      questRequired: false,
    },
    prize2: {
      tokenURI: "bafkreiduyh2mipn6recedsi55uuuzhqzjbzl2ev6w72aoeszrzaj32rgga",
      communityId: 0,
      requiredExp: 1600,
      requiredQuestId: 0,
      questRequired: false,
    },
    prize3: {
      tokenURI: "bafkreicvbh7exviejfa2ezrtwkhjctuuhpxmbkfhyksv7rntoebegr3vke",
      communityId: 0,
      requiredExp: 8100,
      requiredQuestId: 0,
      questRequired: false,
    },
    prize4: {
      tokenURI: "bafkreig34rncewz4dzcfayfvge55kik7d2anhfx4aye2kykvf2hb5bnwyy",
      communityId: 0,
      requiredExp: 0,
      requiredQuestId: 0,
      questRequired: true,
    },
  },
  community2: {
    prize1: {
      tokenURI: "bafkreieig75gjmqp44uuacyiok7km64p6tfig5on2ww2faf7pe5mivckjq",
      communityId: 1,
      requiredExp: 100,
      requiredQuestId: 0,
      questRequired: false,
    },
    prize2: {
      tokenURI: "bafkreicdywyr4t3rhmc4wzq4wlbk4j5x23qo27ygzukgy2ygvwnm2fvwpe",
      communityId: 1,
      requiredExp: 1600,
      requiredQuestId: 0,
      questRequired: false,
    },
    prize3: {
      tokenURI: "bafkreiekwdihvywqxdye3vyjnpxy27obwds276iq6nb3ioij2tvbgab7l4",
      communityId: 1,
      requiredExp: 8100,
      requiredQuestId: 0,
      questRequired: false,
    },
    prize4: {
      tokenURI: "bafkreiha7zcstwpofbi4rlyjqk2sx2g7g3pjtvbtubxphvtsg7mj4sdhbe",
      communityId: 1,
      requiredExp: 0,
      requiredQuestId: 0,
      questRequired: true,
    },
  },
};

// --------------------------------------------------
// QuestBoard
// --------------------------------------------------

export const QUEST_BOARD_PROXY_ADDRESS =
  "0x2deC1FdC941C66d2068884Ba2DaAe67Ed59B62F1";

export const ERC721_INTERFACE_ID = "0x80ac58cd";

export const COMMUNITY_INIT_QUEST = {
  community1: {
    quest1: {
      title: "パスポートを手に入れてみよう！",
      questURI:
        "ipfs://bafkreifo2amfjr6v2rqcrflengjdmteykc7mi6mx4wo2gjac4pyiojthoe",
      communityId: 0,
      obtainableExp: 100,
      obtainablePrizeId: 3,
      prizeObtainable: true,
      interfaceId: ERC721_INTERFACE_ID,
      target: "",
    },
    quest2: {
      title: "Transmit Streamersを応援しよう！",
      questURI:
        "ipfs://bafkreifyc7nntnufequtdhhwcuabz7gmzxasmfvelokbqqbnas2mbvcyxm",
      communityId: 0,
      obtainableExp: 200,
      obtainablePrizeId: 0,
      prizeObtainable: false,
      interfaceId: ERC721_INTERFACE_ID,
      target: "",
    },
    quest3: {
      title: "Twitterを連携しよう！",
      questURI:
        "ipfs://bafkreictzuz2ryjfg2e2rbtmr2vas6qk5n36ey4uo36l5wzqwqneueiysy",
      communityId: 0,
      obtainableExp: 200,
      obtainablePrizeId: 0,
      prizeObtainable: false,
      interfaceId: ERC721_INTERFACE_ID,
      target: "0x34d2741f92Dd815FcABe06D8d8b48CeaB4884bf6",
    },
    quest4: {
      title: "XXXをRTしよう！",
      questURI:
        "ipfs://bafkreifjjctxi5xcx6veaqpmkqlvz5y572qv2xkbfaoribsoylf7w4ytam",
      communityId: 0,
      obtainableExp: 300,
      obtainablePrizeId: 0,
      prizeObtainable: false,
      interfaceId: ERC721_INTERFACE_ID,
      target: "0x23C8ABEdf8783E6EA1ff631e54E04f5F01d4A527",
    },
    quest5: {
      title: "クエストを3つクリアしよう！",
      questURI:
        "ipfs://bafkreigepnljnr5d56lwht5wrpc2awcriyje7crlwmdasfprnvk3xatngi",
      communityId: 0,
      obtainableExp: 300,
      obtainablePrizeId: 0,
      prizeObtainable: false,
      interfaceId: ERC721_INTERFACE_ID,
      target: "0x018702B50b0548972643B132Da2957012F571870",
    },
  },
  community2: {
    quest1: {
      title: "パスポートを取得しよう！",
      questURI:
        "ipfs://bafkreialf2ss3djt7rwbisgxqtvgs6hvfhci7iu2g5isbzkuokpotgpquu",
      communityId: 1,
      obtainableExp: 100,
      obtainablePrizeId: 7,
      prizeObtainable: true,
      interfaceId: ERC721_INTERFACE_ID,
      target: "",
    },
    quest2: {
      title: "Twitterをフォローしよう！",
      questURI:
        "ipfs://bafkreiftvbrbjiinkcd3iioh7fdcfuvysl72vyckjoxnnqz6yasnjq5kwu",
      communityId: 1,
      obtainableExp: 200,
      obtainablePrizeId: 0,
      prizeObtainable: false,
      interfaceId: ERC721_INTERFACE_ID,
      target: "0x2f387D22ee7ddC1E9bfC2A5C3E4B07030823934B",
    },
    quest3: {
      title: "Youtubeを登録しよう！",
      questURI:
        "ipfs://bafkreiajf7memizuky3piiky4pr7zrkf7o5ea22nlmgyvvyw7nczkmrmy4",
      communityId: 1,
      obtainableExp: 200,
      obtainablePrizeId: 0,
      prizeObtainable: false,
      interfaceId: ERC721_INTERFACE_ID,
      target: "0x1928968Ffc0106116E464f7bFbB0F130e2e439db",
    },
    quest4: {
      title: "XXXをRTしよう！",
      questURI:
        "ipfs://bafkreihpq4qxzymv7zu6km3xgeflsunsham34tttm6ce3hfkh6e47ku74e",
      communityId: 1,
      obtainableExp: 300,
      obtainablePrizeId: 0,
      prizeObtainable: false,
      interfaceId: ERC721_INTERFACE_ID,
      target: "0x23C8ABEdf8783E6EA1ff631e54E04f5F01d4A527",
    },
    quest5: {
      title: "Transmit Streamers NFTを手に入れよう！",
      questURI:
        "ipfs://bafkreigivrniuuzcpmgvtz7bnokesndjbmumwlkrv7xwfsllukajhbxzli",
      communityId: 1,
      obtainableExp: 500,
      obtainablePrizeId: 0,
      prizeObtainable: false,
      interfaceId: ERC721_INTERFACE_ID,
      target: "0x4360a98e2d3cD2feA456b6aFa281827D571650ea",
    },
  },
};

// --------------------------------------------------
// QuestChecker
// --------------------------------------------------

export const QUEST_CHECKER_ERC721_ADDRESS =
  "0xC21b61b70a3Dc249454270DCF4eC8F2E9A737F78";
export const TARGET_ERC721_ADDRESS =
  "0x4360a98e2d3cD2feA456b6aFa281827D571650ea";

// --------------------------------------------------
// QuestCheckerCreater
// --------------------------------------------------

export const QUEST_CHECKER_CREATER_ADDRESS =
  "0xC21b61b70a3Dc249454270DCF4eC8F2E9A737F78";

// --------------------------------------------------
// QuestPoap
// --------------------------------------------------

export const QUEST_POAP_NAME = "Transmit Streamers";
export const QUEST_POAP_EXTERNAL_LINK =
  "https://neiverse-demo.azurewebsites.net/";
