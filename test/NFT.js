const { expect } = require('chai');

const {
  loadFixture,
} = require('@nomicfoundation/hardhat-toolbox/network-helpers');
const { ethers } = require('hardhat');

describe('NFT contract', function () {
  async function deployFixture() {
    // Get the Signers here.
    const [deployer, minter] = await ethers.getSigners();

    const NFT = await ethers.getContractFactory('NFT');
    const allowMintingOn = Date.now().toString().slice(0, 10); // 2min from now
    const nft = await NFT.deploy(
      'DDS Punks',
      'DDSP',
      ethers.parseEther('10'),
      25,
      allowMintingOn,
      'ipfs://QmQPEMsfd1tJnqYPbnTQCjoa8vczfsV1FmqZWgRdNQ7z3g/'
    );

    await nft.waitForDeployment();

    return { nft, allowMintingOn, deployer, minter };
  }

  async function mintingFixture() {
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
      'ipfs://QmQPEMsfd1tJnqYPbnTQCjoa8vczfsV1FmqZWgRdNQ7z3g/'
    );

    await nft.waitForDeployment();

    return { nft, allowMintingOn, deployer, minter };
  }

  describe('Deployment', function () {
    it('Should have the correct name', async function () {
      const { nft } = await loadFixture(deployFixture);
      expect(await nft.name()).to.equal('DDS Punks');
    });

    it('Should have the correct symbol', async function () {
      const { nft } = await loadFixture(deployFixture);
      expect(await nft.symbol()).to.equal('DDSP');
    });

    it('Should have the cost to mint', async function () {
      const { nft } = await loadFixture(deployFixture);
      expect(await nft.cost()).to.equal(ethers.parseEther('10'));
    });

    it('Should have maximum total supply', async function () {
      const { nft } = await loadFixture(deployFixture);
      expect(await nft.maxSupply()).to.equal(25);
    });

    it('Should have the correct allowed minting time', async function () {
      const { nft, allowMintingOn } = await loadFixture(deployFixture);
      expect(await nft.allowMintingOn()).to.equal(allowMintingOn);
    });

    it('Should have the correct base URI', async function () {
      const { nft } = await loadFixture(deployFixture);
      expect(await nft.baseURI()).to.equal(
        'ipfs://QmQPEMsfd1tJnqYPbnTQCjoa8vczfsV1FmqZWgRdNQ7z3g/'
      );
    });

    it('Should have the correct owner', async function () {
      const { nft, deployer } = await loadFixture(deployFixture);
      expect(await nft.owner()).to.equal(deployer.address);
    });
  });

  describe('Minting', function () {
    it('Should update the total supply', async function () {
      const { nft, minter } = await loadFixture(deployFixture);
      const tx = await nft
        .connect(minter)
        .mint(1, { value: ethers.parseEther('10') });
      await tx.wait();
      expect(await nft.totalSupply()).to.equal(1);
    });

    it('Should update the contract ether balance', async function () {
      const { nft, minter } = await loadFixture(deployFixture);
      const tx = await nft
        .connect(minter)
        .mint(1, { value: ethers.parseEther('10') });
      await tx.wait();
      expect(await ethers.provider.getBalance(nft.target)).to.equal(
        ethers.parseEther('10')
      );
    });

    it('Should return the total number of tokens the minter owns', async function () {
      const { nft, minter } = await loadFixture(deployFixture);
      const tx = await nft
        .connect(minter)
        .mint(1, { value: ethers.parseEther('10') });
      await tx.wait();
      expect(await nft.balanceOf(minter.address)).to.equal(1);
    });

    it('Should return the address of the minter', async function () {
      const { nft, minter } = await loadFixture(deployFixture);
      const tx = await nft
        .connect(minter)
        .mint(1, { value: ethers.parseEther('10') });
      await tx.wait();
      expect(await nft.ownerOf(1)).to.equal(minter.address);
    });

    it('Should return the ipfs uri', async function () {
      const { nft, minter } = await loadFixture(deployFixture);
      const tx = await nft
        .connect(minter)
        .mint(1, { value: ethers.parseEther('10') });
      await tx.wait();
      expect(await nft.tokenURI(1)).to.equal(
        'ipfs://QmQPEMsfd1tJnqYPbnTQCjoa8vczfsV1FmqZWgRdNQ7z3g/1.json'
      );
    });

    it('Should emit Mint event', async function () {
      const { nft, minter } = await loadFixture(deployFixture);
      const tx = await nft
        .connect(minter)
        .mint(1, { value: ethers.parseEther('10') });
      await tx.wait();
      await expect(tx).to.emit(nft, 'Mint').withArgs(1, minter.address);
    });

    it('Should rejects insufficient payment', async function () {
      const { nft, minter } = await loadFixture(deployFixture);
      await expect(
        nft.connect(minter).mint(1, { value: ethers.parseEther('1') })
      ).to.be.reverted;
    });

    it('Should rejects minting before allowed time', async function () {
      const { nft, minter } = await loadFixture(mintingFixture);
      await expect(
        nft.connect(minter).mint(1, { value: ethers.parseEther('10') })
      ).to.be.reverted;
    });

    it('Should mint at least 1 NFT', async function () {
      const { nft, minter } = await loadFixture(deployFixture);
      await expect(
        nft.connect(minter).mint(0, { value: ethers.parseEther('10') })
      ).to.be.reverted;
    });

    it('Should not allow more NFTs to be minted than max amount', async function () {
      const { nft, minter } = await loadFixture(deployFixture);
      await expect(
        nft.connect(minter).mint(100, { value: ethers.parseEther('10') })
      ).to.be.reverted;
    });

    it('Should not return URI for invalid tokens', async function () {
      const { nft, minter } = await loadFixture(deployFixture);
      const tx = await nft
        .connect(minter)
        .mint(1, { value: ethers.parseEther('10') });
      await tx.wait();
      await expect(nft.tokenURI(2)).to.be.reverted;
    });
  });

  describe('Displaying NFTs', function () {
    it('Should returns all the NFTs for a given owner', async function () {
      const { nft, minter } = await loadFixture(deployFixture);
      const tx = await nft
        .connect(minter)
        .mint(3, { value: ethers.parseEther('30') });
      await tx.wait();
      const tokenIds = await nft.walletOfOwner(minter);
      expect(tokenIds.length).to.equal(3);
      expect(tokenIds[0].toString()).to.equal('1');
      expect(tokenIds[1].toString()).to.equal('2');
      expect(tokenIds[2].toString()).to.equal('3');
    });
  });
});
