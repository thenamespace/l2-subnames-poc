// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

error InvalidSignature(address extractedVerifier);
error InsufficientFunds(uint256 required, uint256 supplied);
error NameRegistrationNotFound();

error ZeroAddressNotAllowed();
error NodeAlreadyTaken(bytes32);
error NotAuthorized();
