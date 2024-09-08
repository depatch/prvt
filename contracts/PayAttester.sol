// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { IERC20 } from "@openzeppelin/contracts/interfaces/IERC20.sol";
import { ISPHook } from "@ethsign/sign-protocol-evm/src/interfaces/ISPHook.sol";

contract PayAttestorFee {

    function _payAttester(address payable attester) public payable {
        require(msg.value == 0.001 ether, "Incorrect payment amount");

        // Forward resolver fees (ETH) to the attester
        (bool success, ) = attester.call{ value: 0.001 ether }("");
        require(success, "Payment to attester failed");
        }
    }

// @dev This contract implements the actual schema hook.
contract PayAttester is ISPHook, PayAttestorFee {
    function didReceiveAttestation(
        address attester,
        uint64, // schemaId
        uint64, // attestationId
        bytes calldata // extraData
    )
        external
        payable
    {
        _payAttester(payable(attester));
    }

    function didReceiveAttestation(
        address attester,
        uint64, // schemaId
        uint64, // attestationId
        IERC20, // resolverFeeERC20Token
        uint256, // resolverFeeERC20Amount
        bytes calldata // extraData
    )
        external
        view
    {

    }

    function didReceiveRevocation(
        address attester,
        uint64, // schemaId
        uint64, // attestationId
        bytes calldata // extraData
    )
        external
        payable
    {

    }

    function didReceiveRevocation(
        address attester,
        uint64, // schemaId
        uint64, // attestationId
        IERC20, // resolverFeeERC20Token
        uint256, // resolverFeeERC20Amount
        bytes calldata // extraData
    )
        external
        view
    {
    }
}