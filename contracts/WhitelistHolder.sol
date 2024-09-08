// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { IERC20 } from "@openzeppelin/contracts/interfaces/IERC20.sol";
import { ISPHook } from "@ethsign/sign-protocol-evm/src/interfaces/ISPHook.sol";
import { IERC721 } from "@openzeppelin/contracts/interfaces/IERC721.sol";

contract WhitelistMananger is Ownable {
    mapping(address attester => bool allowed) public whitelist;

    error UnauthorizedAttester();

    constructor() Ownable(_msgSender()) { }

    function setWhitelist(address attester, bool allowed) external onlyOwner {
        whitelist[attester] = allowed;
    }

    function _checkAttesterWhitelistStatus(address attester) internal view {
        require(whitelist[attester], UnauthorizedAttester());
    }

    function _checkNFTOwnership(address nftContract, uint256 tokenId, address owner) internal view {
        IERC721 nft = IERC721(nftContract);
        require(nft.ownerOf(tokenId) == owner, "Unauthorized NFT owner");
    }
}

// @dev This contract implements the actual schema hook.
contract WhitelistHook is ISPHook, WhitelistMananger {
    function didReceiveAttestation(
        address attester,
        uint64 schemaId,
        uint64 attestationId,
        IERC20 resolverFeeERC20Token,
        uint256 resolverFeeERC20Amount,
        bytes calldata extraData // This is where you receive the extra data
    )
        external
        payable // This function is marked as payable
    {
        _checkAttesterWhitelistStatus(attester);
        // Decode the address from extraData
        (address nftOwner, address nftContract, uint256 tokenId) = abi.decode(extraData, (address, address, uint256));
        // Check NFT ownership
        _checkNFTOwnership(nftContract, tokenId, nftOwner);
    }
}