/* global BigInt */
import { useEffect, useState } from 'react';
import Navigation from './components/Navigation';
import Countdown from 'react-countdown';
import { ethers } from 'ethers';
import Info from './components/Info';
import Data from './components/Data';
import Mint from './components/Mint';

import NFT_ABI from './abis/NFT.json';
import preview from './preview.png';

import config from './config.json';
import Loading from './components/Loading';

function App() {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [accountBalance, setAccountBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [revealTime, setRevealTime] = useState(0);
  const [maxSupply, setMaxSupply] = useState(0);
  const [totalSupply, setTotalSupply] = useState(0);
  const [cost, setCost] = useState(0);
  const [paused, setPaused] = useState(false);
  const [whitelisted, setWhitelisted] = useState(false);

  // Random component
  const Completionist = () => <span>You are good to go!</span>;

  // Renderer callback with condition
  const renderer = ({ hours, minutes, seconds, completed }) => {
    if (completed) {
      // Render a completed state
      return <Completionist />;
    } else {
      // Render a countdown
      return (
        <span>
          {hours}:{minutes}:{seconds}
        </span>
      );
    }
  };

  const loadBlockchainData = async () => {
    const tempProvider = new ethers.BrowserProvider(window.ethereum);
    setProvider(tempProvider);

    const { chainId } = await tempProvider.getNetwork();

    if (chainId && config[chainId]) {
      const tempContract = new ethers.Contract(
        config[chainId].nft.address,
        NFT_ABI,
        tempProvider
      );

      setContract(tempContract);

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
      const tempAccount = ethers.getAddress(accounts[0]);
      setAccount(tempAccount);

      // Fetch account balance
      const tempAccountBalance = await tempContract.balanceOf(tempAccount);
      setAccountBalance(tempAccountBalance);

      // Fetch countdown
      const allowMintingOn = await tempContract.allowMintingOn();
      console.log(
        "allowMintingOn.toString() + '000'",
        parseInt(allowMintingOn.toString() + '000')
      );
      // setRevealTime(allowMintingOn.toString() + '000');
      setRevealTime(Date.now() + 5000);
      const maxSupply = await tempContract.maxSupply();
      // Fetch max supply
      setMaxSupply(BigInt(maxSupply.toString()));

      const totalSupply = await tempContract.totalSupply();
      // Fetch total supply
      setTotalSupply(BigInt(totalSupply.toString()));

      // Fetch cost
      setCost(await tempContract.cost());

      const paused = await tempContract.paused();
      setPaused(paused);

      const isWhitelisted = await tempContract.whitelisted(tempAccount);
      setWhitelisted(isWhitelisted);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    if (isLoading) {
      try {
        loadBlockchainData();
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    }
  }, [isLoading]);

  return (
    <div className="container mx-auto px-4">
      <Navigation />

      <h1 className="my-4 text-center mb-4 text-4xl font-extrabold leading-none tracking-tight text-teal-600 md:text-5xl lg:text-6xl dark:text-white">
        DApp Punks
      </h1>

      {isLoading ? (
        <Loading />
      ) : (
        <div className="px-2">
          <div className="flex -mx-2">
            <div className="w-1/2 px-2">
              <div className="text-center">
                {accountBalance > 0 ? (
                  <img
                    src={`https://gateway.pinata.cloud/ipfs/QmQPEMsfd1tJnqYPbnTQCjoa8vczfsV1FmqZWgRdNQ7z3g/${accountBalance.toString()}.png`}
                    alt="OpenPunk"
                    width="400px"
                    height="400px"
                    className="mx-auto"
                  />
                ) : (
                  <img src={preview} alt="Preview" className="mx-auto" />
                )}
              </div>
            </div>
            <div className="w-1/2 px-2">
              <div className="text-center mb-4 text-4xl font-bold text-teal-700">
                <Countdown
                  date={Date.now() + 5000}
                  renderer={renderer}
                  className="text-teal-700"
                />
              </div>
              <Data
                maxSupply={maxSupply}
                totalSupply={totalSupply}
                cost={cost}
                balance={accountBalance}
              />
              <Mint
                provider={provider}
                contract={contract}
                cost={cost}
                setIsLoading={setIsLoading}
                paused={paused}
                whitelisted={whitelisted}
              />
            </div>
          </div>
        </div>
      )}

      <hr className="my-4 border-teal-500" />
      {account && <Info account={account} accountBalance={accountBalance} />}
    </div>
  );
}

export default App;
