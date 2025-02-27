// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IVC} from "./interfaces/IVC.sol";

contract MusicDistribution {
    IVC private vcContract;

    // Mapping to track registered artists
    mapping(address => bool) public registeredArtists;

    // Mapping to track issued credentials (credential type as bytes32 => user => bool)
    mapping(address => mapping(bytes32 => bool)) public issuedCredentials;

    // Events (emit credentialType as bytes32)
    event ArtistRegistered(address indexed artist);
    event CredentialIssued(address indexed artist, bytes32 credentialType);

    constructor(address _vcContractAddress) {
        vcContract = IVC(_vcContractAddress);
    }

    // Modifier that ensures the caller is a verified human on Humanity Protocol
    modifier onlyVerifiedHuman() {
        require(vcContract.isVerified(msg.sender), "Artist not verified on Humanity Protocol");
        _;
    }

    // Modifier that ensures the caller has a specific credential (passed in as bytes32)
    modifier onlyVerifiedWithCredential(bytes32 credentialType) {
        require(vcContract.isVerified(msg.sender), "Artist not verified on Humanity Protocol");
        require(issuedCredentials[msg.sender][credentialType], "Required credential not issued");
        _;
    }

    /**
     * @notice Register an artist on the platform.
     * @dev The artist must have the "music_rights" credential to register.
     */
    function registerArtist() external onlyVerifiedWithCredential(keccak256("music_rights")) {
        require(!registeredArtists[msg.sender], "Artist already registered");
        registeredArtists[msg.sender] = true;
        emit ArtistRegistered(msg.sender);
    }

    /**
     * @notice Mark a specific credential as issued for an artist.
     */
    function markCredentialIssued(address artist, bytes32 credentialType) external {
        require(!issuedCredentials[artist][credentialType], "Credential already issued");
        issuedCredentials[artist][credentialType] = true;
        emit CredentialIssued(artist, credentialType);
    }

    /**
     * @notice Check if an artist has a specific credential.
     */
    function hasCredential(address artist, bytes32 credentialType) external view returns (bool) {
        return issuedCredentials[artist][credentialType];
    }
}
