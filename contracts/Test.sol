//SPDX-License-Identifier: Unlicense
pragma solidity 0.7.3;

import { VerifyVDF } from "./VerifyVDF.sol";

contract Test is VerifyVDF {
  function testValidateGroupElement(bytes memory e) external pure returns (bool) {
    return validateGroupElement(e);
  }

  function testEqualNumber(bytes memory a, bytes memory b) external pure returns (bool) {
    return equalNumber(a, b);
  }

  function testHashToPrime(
    bytes memory g,
    bytes memory y,
    uint256 nonce,
    bytes memory dst
  ) external pure returns (uint256) {
    return hashToPrime(g, y, nonce, dst);
  }

  // solhint-disable-next-line
  function gasCostVerify(
    bytes memory g,
    bytes memory pi,
    bytes memory y,
    bytes memory q,
    bytes memory dst,
    uint256 nonce,
    uint256 delay
  ) external returns (uint256) {
    uint256 operationGasCost = gasleft();
    verify(g, pi, y, q, dst, nonce, delay);
    return operationGasCost - gasleft();
  }

  function gasCostMillerRabinPrimalityTest(uint256 n) external view returns (uint256) {
    uint256 operationGasCost = gasleft();
    require(millerRabinPrimalityTest(n), "run it with a prime");
    return operationGasCost - gasleft();
  }

  // solhint-disable-next-line
  function gasCostEqualNumber(bytes memory a, bytes memory b) external returns (uint256) {
    uint256 operationGasCost = gasleft();
    equalNumber(a, b);
    return operationGasCost - gasleft();
  }

  function testMulModEqual(
    bytes memory a,
    bytes memory b,
    bytes memory y,
    bytes memory q
  ) external view returns (bool) {
    return mulModEqual(a, b, y, q);
  }

  // solhint-disable-next-line
  function gasCostMulModEqual(
    bytes memory a,
    bytes memory b,
    bytes memory y,
    bytes memory q
  ) external returns (uint256) {
    uint256 operationGasCost = gasleft();
    mulModEqual(a, b, y, q);
    return operationGasCost - gasleft();
  }

  function testAdd2048to4096(bytes memory a, bytes memory b) external pure returns (bytes memory) {
    add2048to4096(a, b);
    return a;
  }

  // solhint-disable-next-line
  function gasCostAdd2048to4096(bytes memory a, bytes memory b) external returns (uint256) {
    uint256 operationGasCost = gasleft();
    add2048to4096(a, b);
    return operationGasCost - gasleft();
  }

  function testMul2048(bytes memory a, bytes memory b) external pure returns (bytes memory) {
    return mul2048(a, b);
  }

  // solhint-disable-next-line
  function gasCostMul2048(bytes memory a, bytes memory b) external returns (uint256) {
    uint256 operationGasCost = gasleft();
    mul2048(a, b);
    return operationGasCost - gasleft();
  }

  function testModExp(bytes memory base, uint256 exponent) external view returns (bytes memory) {
    return modexp(base, exponent);
  }

  // solhint-disable-next-line
  function gasCostModExp(bytes memory base, uint256 exponent) external returns (uint256) {
    uint256 operationGasCost = gasleft();
    modexp(base, exponent);
    return operationGasCost - gasleft();
  }

  function testModExp256(
    uint256 base,
    uint256 exponent,
    uint256 modulus
  ) external view returns (uint256) {
    return modexp(base, exponent, modulus);
  }

  // solhint-disable-next-line
  function gasCostModExp256(
    uint256 base,
    uint256 exponent,
    uint256 modulus
  ) external returns (uint256) {
    uint256 operationGasCost = gasleft();
    modexp(base, exponent, modulus);
    return operationGasCost - gasleft();
  }
}
