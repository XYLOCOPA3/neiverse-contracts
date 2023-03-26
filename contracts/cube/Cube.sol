// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

import {ICube} from "./ICube.sol";
import {IPrizePoap} from "../prize-poap/IPrizePoap.sol";

/// @title Cube
/// @author keit (@keitEngineer)
/// @notice This is a contract to manage Cube.
contract Cube is ICube, Initializable, OwnableUpgradeable, UUPSUpgradeable {
  // --------------------------------------------------------------------------------
  // State
  // --------------------------------------------------------------------------------

  uint256 private constant MAX_POSITION = 10;

  uint256 private constant MAX_ROTATION = 360;

  IPrizePoap public prizePoap;

  mapping(address => ICube.CubeObj[MAX_POSITION][MAX_POSITION]) private _cubes;

  mapping(address => mapping(uint256 => uint256)) private _usedPrizeNum;

  // --------------------------------------------------------------------------------
  // Modifier
  // --------------------------------------------------------------------------------

  modifier checkCubeObj(ICube.CubeObj memory cubeObj) {
    require(
      cubeObj.positionX < MAX_POSITION &&
        cubeObj.positionY < MAX_POSITION &&
        cubeObj.positionZ < MAX_POSITION,
      "checkCubeObj: Out of range positionXYZ"
    );
    require(
      cubeObj.rotationX <= MAX_ROTATION &&
        cubeObj.rotationY <= MAX_ROTATION &&
        cubeObj.rotationZ <= MAX_ROTATION,
      "checkCubeObj: Out of range rotationXYZ"
    );
    _;
  }

  // --------------------------------------------------------------------------------
  // Initialize
  // --------------------------------------------------------------------------------

  /// @dev コンストラクタ
  /// @custom:oz-upgrades-unsafe-allow constructor
  constructor() {
    _disableInitializers();
  }

  /// @dev 初期化
  /// @param prizePoapAddress_ PrizePoapのアドレス
  function initialize(address prizePoapAddress_) public initializer {
    __Ownable_init();
    __UUPSUpgradeable_init();
    prizePoap = IPrizePoap(prizePoapAddress_);
  }

  // --------------------------------------------------------------------------------
  // Getter
  // --------------------------------------------------------------------------------

  /// @dev 箱庭情報の取得
  /// @param userAddress_ ユーザーアドレス
  /// @return cube 箱庭情報
  function getCube(
    address userAddress_
  )
    external
    view
    returns (ICube.CubeObj[MAX_POSITION][MAX_POSITION] memory cube)
  {
    cube = _cubes[userAddress_];
  }

  /// @dev 箱庭obj情報の取得
  /// @param userAddress_ ユーザーアドレス
  /// @param x_ x座標
  /// @param z_ z座標
  /// @return cubeObj 箱庭obj情報
  function getCubeObj(
    address userAddress_,
    uint256 x_,
    uint256 z_
  ) external view returns (ICube.CubeObj memory cubeObj) {
    cubeObj = _cubes[userAddress_][z_][x_];
  }

  // --------------------------------------------------------------------------------
  // Setter
  // --------------------------------------------------------------------------------

  /// @dev PrizePoapのアドレスを設定
  /// @param newState_ PrizePoapのアドレス
  function setPrizePoap(address newState_) external onlyOwner {
    prizePoap = IPrizePoap(newState_);
  }

  // --------------------------------------------------------------------------------
  // Main Logic
  // --------------------------------------------------------------------------------

  /// @dev 箱庭obj情報の設定
  /// @param cubeObj_ 箱庭obj情報
  function setCubeObj(
    ICube.CubeObj memory cubeObj_
  ) public checkCubeObj(cubeObj_) {
    uint256 x = cubeObj_.positionX;
    uint256 z = cubeObj_.positionZ;
    uint32 prizeId = cubeObj_.prizeId;
    uint32 updatedPrizeId = _cubes[msg.sender][z][x].prizeId;

    // delete
    if (!cubeObj_.set) {
      require(_cubes[msg.sender][z][x].set, "setCubeObj: Not yet set.");
      _usedPrizeNum[msg.sender][updatedPrizeId]--;
      delete _cubes[msg.sender][z][x];
      return;
    }

    // update
    require(
      prizePoap.balanceOf(msg.sender, prizeId) -
        _usedPrizeNum[msg.sender][prizeId] >
        0,
      "lack of prizeNum"
    );
    if (_cubes[msg.sender][z][x].set)
      _usedPrizeNum[msg.sender][updatedPrizeId]--;
    _usedPrizeNum[msg.sender][prizeId]++;
    _cubes[msg.sender][z][x] = cubeObj_;
  }

  /// @dev 箱庭obj情報の一括設定
  /// @param cubeObjList_ 箱庭obj情報リスト
  function setBatchCubeObj(ICube.CubeObj[] memory cubeObjList_) external {
    for (uint256 i; i < cubeObjList_.length; i++) {
      setCubeObj(cubeObjList_[i]);
    }
  }

  // --------------------------------------------------------------------------------
  // Internal
  // --------------------------------------------------------------------------------

  /// @dev アップグレードの許可
  /// @param newImplementation 新しい実装アドレス
  function _authorizeUpgrade(
    address newImplementation
  ) internal override onlyOwner {}
}
