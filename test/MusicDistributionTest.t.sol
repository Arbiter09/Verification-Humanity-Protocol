// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/MusicDistribution.sol";
import "../src/MockIVC.sol";

contract MusicDistributionTest is Test {
    MusicDistribution musicDist;
    MockIVC mockIVC;

    // Test addresses for a verified and an unverified artist.
    address verifiedArtist = address(1);
    address unverifiedArtist = address(2);
    address artist = address(3);

    /// @notice setUp is called before each test function.
    function setUp() public {
        // Deploy the MockIVC contract.
        mockIVC = new MockIVC();

        // Mark the verifiedArtist as verified.
        mockIVC.setVerified(verifiedArtist, true);

        // Deploy the MusicDistribution contract using the mock IVC address.
        musicDist = new MusicDistribution(address(this));
    }

    /// @notice Test that a verified artist can successfully register.
    function testRegisterVerifiedArtist() public {
        // Simulate a call from the verified artist.
        vm.prank(verifiedArtist);
        musicDist.registerArtist();

        // Check that the verified artist is now registered.
        bool isRegistered = musicDist.registeredArtists(verifiedArtist);
        assertTrue(isRegistered, "Verified artist should be registered");
    }

    /// @notice Test that an unverified artist registration is reverted.
    function testRegisterUnverifiedArtist() public {
        // Simulate a call from an unverified artist.
        vm.prank(unverifiedArtist);

        // Expect a revert with the appropriate error message.
        vm.expectRevert("Artist not verified on Humanity Protocol");
        musicDist.registerArtist();
    }

    function testIssueCredential() public {
        musicDist.markCredentialIssued(artist, "music_rights");
        bool hasCredential = musicDist.hasCredential(artist, "music_rights");
        assertTrue(hasCredential, "Artist should have music_rights credential");
    }
}
