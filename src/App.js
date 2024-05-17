import { useEffect, useState } from 'react';
import Navigation from './components/Navigation';
import { ethers } from 'ethers';
import Info from './components/Info';

import NFT_ABI from './abis/NFT.json';

import config from './config.json';
import Loading from './components/Loading';

function App() {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [accountBalance, setAccountBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [revealTime, setRevealTime] = useState(0);
  const [maxSupply, setMaxSupply] = useState(0);
  const [totalSupply, setTotalSupply] = useState(0);
  const [cost, setCost] = useState(0);

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

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
      const tempAccount = ethers.getAddress(accounts[0]);
      setAccount(tempAccount);

      // Fetch account balance
      const tempAccountBalance = ethers.formatUnits(
        await tempContract.balanceOf(tempAccount),
        18
      );
      setAccountBalance(tempAccountBalance);

      // Fetch countdown
      const allowMintingOn = await tempContract.allowMintingOn();
      setRevealTime(allowMintingOn.toString() + '000');

      // Fetch max supply
      setMaxSupply(await tempContract.maxSupply());

      // Fetch total supply
      setTotalSupply(await tempContract.totalSupply());

      // Fetch cost
      setCost(await tempContract.cost());
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

      <h1 className="my-4 text-center">DApp Punks</h1>

      {isLoading ? (
        <Loading />
      ) : (
        <div class="px-2">
          <div class="flex -mx-2">
            <div class="w-1/2 px-2">
              <div class="bg-gray-400 h-12"></div>
            </div>
            <div class="w-1/2 px-2">
              <div class="bg-gray-500 h-12"></div>
            </div>
          </div>
        </div>
      )}

      <hr />
      {account && <Info account={account} accountBalance={accountBalance} />}
    </div>
  );
}

export default App;
