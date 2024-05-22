import { useState } from 'react';
import Loading from './Loading';

const Mint = ({
  provider,
  contract,
  cost,
  setIsLoading,
  paused,
  whitelisted,
}) => {
  const [isWaiting, setIsWaiting] = useState(false);
  const mintHandler = async (e) => {
    e.preventDefault();
    setIsWaiting(true);

    try {
      console.log('cost', cost.toString());
      const signer = await provider.getSigner();
      const tx = await contract.connect(signer).mint(1, { value: cost });
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
          <button
            type="submit"
            className="bg-teal-500 text-white py-2 px-4 rounded hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-400"
            disabled={paused || !whitelisted}
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
