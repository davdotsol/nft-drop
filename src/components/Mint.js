import { useState } from 'react';
import Loading from './Loading';
import { ethers } from 'ethers';

const Mint = ({
  provider,
  contract,
  cost,
  setIsLoading,
  paused,
  whitelisted,
}) => {
  const [isWaiting, setIsWaiting] = useState(false);
  const [mintAmount, setMintAmount] = useState(1);

  const mintHandler = async (e) => {
    e.preventDefault();
    setIsWaiting(true);

    try {
      const signer = await provider.getSigner();
      const totalCostInWei = ethers.parseEther(
        (ethers.formatUnits(cost.toString(), 'ether') * mintAmount).toString()
      );
      const tx = await contract
        .connect(signer)
        .mint(mintAmount, { value: totalCostInWei });
      await tx.wait();
    } catch (error) {
      window.alert('User rejected or transaction reverted');
      console.error(error);
    }
    setIsLoading(true);
  };
  return (
    <div className="text-center mt-4">
      {isWaiting ? (
        <Loading />
      ) : (
        <form onSubmit={mintHandler} className="inline-block">
          <input
            type="number"
            value={mintAmount}
            onChange={(e) => setMintAmount(e.target.value)}
            min="1"
            className="mb-2 p-2 border border-gray-300 rounded"
          />
          <button
            type="submit"
            className="bg-teal-500 text-white py-2 px-4 rounded hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-400"
            disabled={paused /*|| !whitelisted*/}
          >
            Mint
          </button>
          {paused && (
            <p className="text-red-500 mt-2">Minting is currently paused.</p>
          )}
          {!whitelisted && (
            <p className="text-red-500 mt-2">You are not whitelisted.</p>
          )}
        </form>
      )}
    </div>
  );
};

export default Mint;
