// SPDX-License-Identifier: MIT
pragma solidity ^0.8.14;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/// @custom:security-contact dev@daoscape.one
contract DAOScape is ERC721, ERC721URIStorage, ERC721Enumerable, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    address DSGold;

    constructor(address _DSGold) ERC721("DAOScapers", "DSCAPER") {
        _tokenIdCounter.increment();

        DSGold = _DSGold;
    }

    function _baseURI() internal pure override returns (string memory) {
        return
            "https://bafybeihfvy2hmcnvpax6anx3tgx53qie4nj32eqtuehsu2g5c5hx3ukxc4.ipfs.nftstorage.link/";
    }

    ////////////////////////////////////////////////////
    /////////////////////MINTING////////////////////////
    ////////////////////////////////////////////////////
    function safeMint(address to, string memory uri) public payable {
        require(msg.value == 1 ether, "Need to pay 1 ONE");
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        //semi-random with block.difficulty
        uint256 randomId = (uint256(block.difficulty + block.timestamp) % 598) +
            1;
        string memory newURIEnd = string.concat(
            Strings.toString(randomId),
            ".png"
        );
        _setTokenURI(tokenId, newURIEnd);
    }

    ////////////////////////////////////////////////////
    ////////////////////GAME LOGIC//////////////////////
    ////////////////////////////////////////////////////

    enum Status {
        IDLE,
        QUESTING,
        ARENA,
        WIDLERNESS
    }

    struct Scaper {
        uint256 tokenId;
        uint256 arrayid;
        address owner;
        Status status;
    }

    mapping(uint256 => Scaper) public tokenIdToScaper;

    Scaper[] ScapersArray;

    mapping(address => mapping(uint256 => uint256))
        public addressToTimelockToTokenId;

    function beginQuest(uint256 _tokenId) public {
        tokenIdToScaper[_tokenId].status = Status.QUESTING;
        require(balanceOf(msg.sender) >= 1, "Can't Quest with your last NFT");
        safeTransferFrom(msg.sender, address(this), _tokenId);
        addressToTimelockToTokenId[msg.sender][_tokenId] = block.timestamp + 60;
    }

    function randomQuestReward() public view returns (uint256) {
        //semi-random with block.difficulty
        uint256 reward = ((uint256(block.difficulty + block.timestamp) % 10) +
            1) * 1000000000000000000;
        return reward;
    }

    function endQuest() public {
        uint256 tokenId = 0;
        for (uint256 i = 1; i <= totalSupply(); i++) {
            if (addressToTimelockToTokenId[msg.sender][i] > 0) tokenId = i;
        }
        require(tokenId != 0, "You dont have anyone questing.");
        require(
            block.timestamp >= addressToTimelockToTokenId[msg.sender][tokenId],
            "Quest still active!"
        );
        //clear timestamp
        addressToTimelockToTokenId[msg.sender][tokenId] = 0;
        //send random ERC20 DSGOLD reward
        IERC20(DSGold).transfer(msg.sender, randomQuestReward());
        //send ERC721 DSCAPER
        this.approve(msg.sender, tokenId);
        this.safeTransferFrom(address(this), msg.sender, tokenId);
    }

    function getTimeStamp() public view returns (uint256) {
        return block.timestamp;
    }

    /////////////////////////////////////////////////////
    ////////////////////TREASURY/////////////////////////
    ////////////////////////////////////////////////////
    function getBalance() public view returns (uint) {
        return address(this).balance;
    }

    function withdrawAllTokens() public onlyOwner {
        payable(msg.sender).transfer(getBalance());
    }

    function deposit(uint _amount) public payable {
        // Set the minimum amount to 1 token
        uint _minAmount = 1 * (10**18);
        require(_amount >= _minAmount, "Amount less than minimum amount");
        IERC20(DSGold).transferFrom(msg.sender, address(this), _amount);
    }

    function getDSGoldBalance() public view onlyOwner returns (uint) {
        return IERC20(DSGold).balanceOf(address(this));
    }

    // The following functions are overrides required by Solidity.

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function _burn(uint256 tokenId)
        internal
        override(ERC721, ERC721URIStorage)
    {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function onERC721Received(
        address,
        address,
        uint256,
        bytes calldata
    ) external pure returns (bytes4) {
        return IERC721Receiver.onERC721Received.selector;
    }
}
