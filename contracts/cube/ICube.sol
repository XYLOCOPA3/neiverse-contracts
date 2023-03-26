// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

/// @title ICube
/// @author keit (@keitEngineer)
/// @notice This is an interface to manage Cube.
interface ICube {
  // --------------------------------------------------------------------------------
  // State
  // --------------------------------------------------------------------------------

  struct CubeObj {
    uint32 prizeId;
    uint16 positionX;
    uint16 positionY;
    uint16 positionZ;
    uint16 rotationX;
    uint16 rotationY;
    uint16 rotationZ;
    bool set;
  }

  // --------------------------------------------------------------------------------
  // Getter
  // --------------------------------------------------------------------------------

  /// @dev 箱庭情報の取得
  /// @param userAddress_ ユーザーアドレス
  /// @return cube 箱庭情報
  function getCube(
    address userAddress_
  ) external view returns (CubeObj[10][10] memory cube);

  /// @dev 箱庭obj情報の取得
  /// @param userAddress_ ユーザーアドレス
  /// @param x_ x座標
  /// @param z_ z座標
  /// @return cubeObj 箱庭obj情報
  function getCubeObj(
    address userAddress_,
    uint256 x_,
    uint256 z_
  ) external view returns (ICube.CubeObj memory cubeObj);

  // --------------------------------------------------------------------------------
  // Setter
  // --------------------------------------------------------------------------------

  /// @dev PrizePoapのアドレスを設定
  /// @param newState_ PrizePoapのアドレス
  function setPrizePoap(address newState_) external;

  // --------------------------------------------------------------------------------
  // Main Logic
  // --------------------------------------------------------------------------------

  /// @dev 箱庭obj情報の設定
  /// @param cubeObj_ 箱庭obj情報
  function setCubeObj(CubeObj memory cubeObj_) external;

  /// @dev 箱庭obj情報の一括設定
  /// @param cubeObjList_ 箱庭obj情報リスト
  function setBatchCubeObj(CubeObj[] memory cubeObjList_) external;
}
