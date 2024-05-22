const { buildModule } = require('@nomicfoundation/hardhat-ignition/modules');
const { ethers } = require('hardhat');

const NAME = 'DAPP Punks';
const SYMBOL = 'DPP';
const COST = ethers.parseEther('0.001');
const MAX_SUPPLY = 25;
const NFT_MINT_DATE = '1716360645'; // (Date.now() + 6000).toString().slice(0, 10)
const IPFS_METADATA_URI =
  'ipfs://QmQPEMsfd1tJnqYPbnTQCjoa8vczfsV1FmqZWgRdNQ7z3g/';

module.exports = buildModule('NFTModule', (m) => {
  const name = m.getParameter('name', NAME);
  const symbol = m.getParameter('symbol', SYMBOL);
  const cost = m.getParameter('cost', COST);
  const max_supply = m.getParameter('max_supply', MAX_SUPPLY);
  const mint_date = m.getParameter('mint_date', NFT_MINT_DATE);
  const ipfs_uri = m.getParameter('ipfs_uri', IPFS_METADATA_URI);

  const nft = m.contract('NFT', [
    name,
    symbol,
    cost,
    max_supply,
    mint_date,
    ipfs_uri,
  ]);
  return { nft };
});
