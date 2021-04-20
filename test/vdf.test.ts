import { ethers } from 'hardhat';
import { randE, to256Bytes, toBytes } from './rsa';
import { Test } from '../typechain/Test';

import { expect, use } from 'chai';
import { solidity } from 'ethereum-waffle';
import { evaluate } from './vdf';

use(solidity);

describe('VDF', function () {
  let C: Test;

  beforeEach(async function () {
    const factory = await ethers.getContractFactory('Test');
    C = (await factory.deploy()) as Test;
  });

  it('hash', async function () {
    const g = toBytes(randE(256), 256);
    const y = toBytes(randE(256), 256);
    const nonce = 1;
    const dst = '0x';
    const res0 = ethers.utils.solidityKeccak256(['bytes', 'bytes', 'bytes', 'uint256'], [dst, g, y, nonce]);
    const res1 = await C.testHashToPrime(g, y, nonce, dst);
    expect(res0).eq(res1);
  });

  it('verify vdf', async function () {
    const g = randE();
    const t = 4;
    const proof = evaluate(g, t);

    const res = await C.verify(
      to256Bytes(g),
      to256Bytes(proof.pi),
      to256Bytes(proof.y),
      to256Bytes(proof.q),
      '0x',
      proof.challenge.nonce,
      t
    );
    expect(res).true;

    const cost = await C.callStatic.gasCostVerify(
      to256Bytes(g),
      to256Bytes(proof.pi),
      to256Bytes(proof.y),
      to256Bytes(proof.q),
      '0x',
      proof.challenge.nonce,
      t
    );
    console.log('cost verify:', cost.toString());

    const tx = await C.gasCostVerify(
      to256Bytes(g),
      to256Bytes(proof.pi),
      to256Bytes(proof.y),
      to256Bytes(proof.q),
      '0x',
      proof.challenge.nonce,
      t
    );
    const receipt = await tx.wait();

    console.log('cost verify with base and calldata:', receipt.gasUsed.toString());
  });
});
