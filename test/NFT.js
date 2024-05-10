const { expect } = require('chai');

const {
  loadFixture,
} = require('@nomicfoundation/hardhat-toolbox/network-helpers');

describe('NFT contract', function () {
  async function deployTokenFixture() {
    // Get the Signers here.
    const [deployer, minter] = await ethers.getSigners();

    const NFT = await ethers.getContractFactory('NFT');
    const allowMintingOn = (Date.now() + 120000).toString().slice(0, 10); // 2min from now
    const nft = await NFT.deploy(
      'DDS Punks',
      'DDSP',
      ethers.parseEther('10'),
      25,
      allowMintingOn,
      'ipfs://QmQPEMsfd1tJnqYPbnTQCjoa8vczfsV1FmqZWgRdNQ7z3g/1.png'
    );

    await nft.waitForDeployment();

    return { nft, allowMintingOn, deployer };
  }

  describe('Deployment', function () {
    it('Should have the correct name', async function () {
      const { nft } = await loadFixture(deployTokenFixture);
      expect(await nft.name()).to.equal('DDS Punks');
    });

    it('Should have the correct symbol', async function () {
      const { nft } = await loadFixture(deployTokenFixture);
      expect(await nft.symbol()).to.equal('DDSP');
    });

    it('Should have the cost to mint', async function () {
      const { nft } = await loadFixture(deployTokenFixture);
      expect(await nft.cost()).to.equal(ethers.parseEther('10'));
    });

    it('Should have maximum total supply', async function () {
      const { nft } = await loadFixture(deployTokenFixture);
      expect(await nft.maxSupply()).to.equal(25);
    });

    it('Should have the correct allowed minting time', async function () {
      const { nft, allowMintingOn } = await loadFixture(deployTokenFixture);
      expect(await nft.allowMintingOn()).to.equal(allowMintingOn);
    });

    it('Should have the correct base URI', async function () {
      const { nft } = await loadFixture(deployTokenFixture);
      expect(await nft.baseURI()).to.equal(
        'ipfs://QmQPEMsfd1tJnqYPbnTQCjoa8vczfsV1FmqZWgRdNQ7z3g/1.png'
      );
    });

    it('Should have the correct owner', async function () {
      const { nft, deployer } = await loadFixture(deployTokenFixture);
      expect(await nft.owner()).to.equal(deployer.address);
    });
  });
});
