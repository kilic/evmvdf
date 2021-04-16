import { ethers } from 'hardhat';
import { randE, to256Bytes, to512Bytes, exp, find_q, mulE, newE, RSA_MODULUS, toBytes } from './rsa';
import { Test } from '../typechain/Test';

import { expect, use } from 'chai';
import { solidity } from 'ethereum-waffle';
import { randPrime } from './vdf';

use(solidity);

const n_iter = 10;

describe('Arithmetic', function () {
  let C: Test;

  beforeEach(async function () {
    const factory = await ethers.getContractFactory('Test');
    C = (await factory.deploy()) as Test;
  });

  it('vaildate group element', async function () {
    for (let i = 0; i < n_iter; i++) {
      let res = await C.testValidateGroupElement(to256Bytes(RSA_MODULUS));
      expect(res).false;
      res = await C.testValidateGroupElement(to256Bytes(RSA_MODULUS.add(1)));
      expect(res).false;
      let a = randE();
      res = await C.testValidateGroupElement(to256Bytes(a));
      expect(res).true;
    }
  });

  it('bytes equal', async function () {
    let a = randE(256);
    let b = randE(256);
    let res = await C.testEqualNumber(to256Bytes(a), to256Bytes(b));
    expect(res).false;
    a = randE(63);
    res = await C.testEqualNumber(toBytes(a, 63), toBytes(a, 63));
    expect(res).false;
    res = await C.testEqualNumber('0x', '0x');
    expect(res).false;
    a = randE(64);
    res = await C.testEqualNumber(toBytes(a, 64), toBytes(a, 64 + 32));
    expect(res).false;
    a = randE(256);
    res = await C.testEqualNumber(toBytes(a, 256), toBytes(a, 256));
    expect(res).true;
    a = randE(1024);
    res = await C.testEqualNumber(toBytes(a, 1024), toBytes(a, 1024));
    expect(res).true;
  });

  it('exp', async function () {
    for (let i = 0; i < n_iter; i++) {
      const base = randE(256);
      const e = randE(32);
      const res0 = exp(base, e);
      const res1 = await C.testModExp(to256Bytes(base), e);
      expect(res0).eq(res1);
    }
  });

  it('exp256', async function () {
    for (let i = 0; i < n_iter; i++) {
      const base = randE(32);
      const e = randE(32);
      const modulus = randE(32);
      const res0 = exp(base, e, modulus);
      const res1 = await C.testModExp256(base, e, modulus);
      expect(res0).eq(res1);
    }
  });

  it('mul2048', async function () {
    for (let i = 0; i < 1; i++) {
      const a = randE(256);
      const b = randE(256);
      const res0 = a.mul(b);
      const res1 = await C.testMul2048(to256Bytes(a), to256Bytes(b));
      expect(res0).eq(res1);
    }
  });

  it('add2048to4096', async function () {
    for (let i = 0; i < n_iter; i++) {
      const a = randE(512);
      const b = randE(256);
      const res0 = a.add(b);
      const res1 = await C.testAdd2048to4096(to512Bytes(a), to256Bytes(b));
      expect(res0).eq(res1);
    }
  });

  it('mul mod equal', async function () {
    for (let i = 0; i < n_iter; i++) {
      let a = randE(256);
      let b = randE(256);
      let q = randE(256);
      let y = randE(256);
      let res = await C.testMulModEqual(to256Bytes(a), to256Bytes(b), to256Bytes(y), to256Bytes(q));
      expect(res).false;

      a = randE(256);
      b = randE(256);
      q = find_q(a, b);
      y = mulE(a, b);
      res = await C.testMulModEqual(to256Bytes(a), to256Bytes(b), to256Bytes(y), to256Bytes(q));
      expect(res).true;

      a = RSA_MODULUS;
      b = randE(256);
      q = b;
      y = newE(0);
      res = await C.testMulModEqual(to256Bytes(a), to256Bytes(b), to256Bytes(y), to256Bytes(q));
      expect(res).true;
      let _q = q.sub(1);
      res = await C.testMulModEqual(to256Bytes(a), to256Bytes(b), to256Bytes(y), to256Bytes(_q));
      expect(res).false;
      let _y = y.add(1);
      res = await C.testMulModEqual(to256Bytes(a), to256Bytes(b), to256Bytes(_y), to256Bytes(q));
      expect(res).false;

      a = newE(0);
      b = randE(256);
      q = newE(0);
      y = newE(0);
      res = await C.testMulModEqual(to512Bytes(a), to512Bytes(b), to512Bytes(y), to512Bytes(q));
      expect(res).true;
      _y = y.add(1);
      res = await C.testMulModEqual(to256Bytes(a), to256Bytes(b), to256Bytes(_y), to256Bytes(q));
      expect(res).false;
    }
  });

  it('cost: bytes equal', async function () {
    let a = randE(512);
    let cost = await C.callStatic.gasCostEqualNumber(to512Bytes(a), to512Bytes(a));
    console.log('cost bytes equal:', cost.toString());
  });
  it('cost: exp', async function () {
    const base = randE(256);
    const e = randE(32);
    const cost = await C.callStatic.gasCostModExp(to256Bytes(base), e);
    console.log('cost exp:', cost.toString());
  });
  it('cost: exp 256', async function () {
    const base = randE(32);
    const e = randE(32);
    const modulus = randE(32);
    const cost = await C.callStatic.gasCostModExp256(base, e, modulus);
    console.log('cost exp:', cost.toString());
  });
  it('cost: mul2048', async function () {
    const a = randE(256);
    const b = randE(256);
    const cost = await C.callStatic.gasCostMul2048(to256Bytes(a), to256Bytes(b));
    console.log('cost mul2048:', cost.toString());
  });
  it('cost: add2048to4096', async function () {
    const a = randE(512);
    const b = randE(256);
    const cost = await C.callStatic.gasCostAdd2048to4096(to512Bytes(a), to256Bytes(b));
    console.log('cost add2048to4096:', cost.toString());
  });
  it('cost: mul mod equal', async function () {
    const a = randE(256);
    const b = randE(256);
    const q = find_q(a, b);
    const y = mulE(a, b);
    const cost = await C.callStatic.gasCostMulModEqual(to256Bytes(a), to256Bytes(b), to256Bytes(y), to256Bytes(q));
    console.log('cost mul mod equal:', cost.toString());
  });
  it('cost: primality test', async function () {
    const n = randPrime();
    const cost = await C.callStatic.gasCostMillerRabinPrimalityTest(n);
    console.log('cost primality test:', cost.toString());
  });
});
