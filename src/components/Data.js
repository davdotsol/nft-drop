/* global BigInt */

import { ethers } from 'ethers';

const Data = ({ maxSupply, totalSupply, cost, balance }) => {
  const maxSupplyBigInt = BigInt(maxSupply.toString());
  const totalSupplyBigInt = BigInt(totalSupply.toString());
  const availableToMint = (maxSupplyBigInt - totalSupplyBigInt).toString();
  return (
    <div className="text-center p-4 bg-teal-100 rounded-lg shadow-md">
      <p className="mb-2">
        <strong className="text-teal-700">Available to Mint:</strong>
        <span className="text-teal-900 ml-1">{availableToMint}</span>
      </p>
      <p className="mb-2">
        <strong className="text-teal-700">Cost to Mint:</strong>
        <span className="text-teal-900 ml-1">
          {ethers.formatUnits(cost.toString(), 'ether')} ETH
        </span>
      </p>
      <p>
        <strong className="text-teal-700">You own:</strong>
        <span className="text-teal-900 ml-1">{balance.toString()} ETH</span>
      </p>
    </div>
  );
};

export default Data;
