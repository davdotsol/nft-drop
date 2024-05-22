// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.24;

import "./ERC721Enumerable.sol";
import "./Ownable.sol";

contract NFT is ERC721Enumerable, Ownable {
    using Strings for uint256;

    uint256 public cost;
    uint256 public maxSupply;
    uint256 public allowMintingOn;
    uint256 public maxMintAmount;
    string public baseURI;
    bool public paused;
    mapping(address => bool) public whitelisted;

    event Mint(uint256 amount, address indexed minter);
    event Withdraw(uint256 amount, address indexed owner);
    event CostUpdated(uint256 newCost);
    event BaseURIUpdated(string newBaseURI);
    event AllowMintingOnUpdated(uint256 newAllowMintingOn);
    event Paused(bool isPaused);
    event Whitelisted(address indexed user, bool isWhitelisted);

    constructor(
        string memory _name,
        string memory _symbol,
        uint256 _cost,
        uint256 _maxSupply,
        uint256 _maxMintAmount,
        uint256 _allowMintingOn,
        string memory _baseURI
    ) ERC721(_name, _symbol) {
        require(_cost > 0, "Cost must be greater than zero");
        require(_maxSupply > 0, "Max supply must be greater than zero");
        require(
            _maxMintAmount > 0,
            "Max mint amount must be greater than zero"
        );

        cost = _cost;
        maxSupply = _maxSupply;
        maxMintAmount = _maxMintAmount;
        allowMintingOn = _allowMintingOn;
        baseURI = _baseURI;
        paused = false;
    }

    function mint(uint256 _mintAmount) public payable {
        require(!paused, "Minting is paused");
        // require(whitelisted[msg.sender], "You are not whitelisted");
        require(_mintAmount > 0, "Mint amount must be greater than zero");
        require(
            _mintAmount <= maxMintAmount,
            "Mint amount exceeds max mint limit"
        );
        require(
            block.timestamp >= allowMintingOn,
            "Minting is not allowed yet"
        );
        require(msg.value >= cost * _mintAmount, "Insufficient funds");
        uint256 supply = totalSupply();
        require(supply + _mintAmount <= maxSupply, "Max supply exceeded");

        for (uint256 i = 1; i <= _mintAmount; i++) {
            _safeMint(msg.sender, supply + i);
        }

        emit Mint(_mintAmount, msg.sender);
    }

    function tokenURI(
        uint256 _tokenId
    ) public view virtual override returns (string memory) {
        require(_exists(_tokenId), "Token does not exist");
        return string(abi.encodePacked(baseURI, _tokenId.toString(), ".json"));
    }

    function walletOfOwner(
        address _owner
    ) public view returns (uint256[] memory) {
        uint256 ownerTokenCount = balanceOf(_owner);
        uint256[] memory tokenIds = new uint256[](ownerTokenCount);
        for (uint256 i = 0; i < ownerTokenCount; i++) {
            tokenIds[i] = tokenOfOwnerByIndex(_owner, i);
        }
        return tokenIds;
    }

    // Owner functions
    function setCost(uint256 _cost) public onlyOwner {
        require(_cost > 0, "Cost must be greater than zero");
        cost = _cost;
        emit CostUpdated(_cost);
    }

    function setBaseURI(string memory _baseURI) public onlyOwner {
        baseURI = _baseURI;
        emit BaseURIUpdated(_baseURI);
    }

    function setAllowMintingOn(uint256 _allowMintingOn) public onlyOwner {
        allowMintingOn = _allowMintingOn;
        emit AllowMintingOnUpdated(_allowMintingOn);
    }

    function pauseMinting() public onlyOwner {
        paused = true;
        emit Paused(true);
    }

    function resumeMinting() public onlyOwner {
        paused = false;
        emit Paused(false);
    }

    function addWhitelist(address _user) public onlyOwner {
        whitelisted[_user] = true;
        emit Whitelisted(_user, true);
    }

    function removeWhitelist(address _user) public onlyOwner {
        whitelisted[_user] = false;
        emit Whitelisted(_user, false);
    }

    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;

        require(balance > 0, "No funds to withdraw");

        (bool success, ) = payable(msg.sender).call{value: balance}("");
        require(success, "Withdrawal failed");

        emit Withdraw(balance, msg.sender);
    }
}
