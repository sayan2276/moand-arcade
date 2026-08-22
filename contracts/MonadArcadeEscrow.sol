// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title MonadArcadeEscrow
 * @dev Hardened Escrow contract for Monad Arcade rewards.
 * Players claim validated reward balances using backend relayer signed vouchers.
 */
contract MonadArcadeEscrow {
    address public adminRelayer;
    address public owner;
    
    // Nonce tracking per user address to prevent signature replay attacks
    mapping(address => mapping(uint256 => bool)) public usedNonces;
    
    // User cumulative claimed rewards balance ledger
    mapping(address => uint256) public totalClaimed;

    event RewardClaimed(
        address indexed user,
        uint256 amount,
        uint256 indexed nonce,
        uint256 timestamp
    );
    event AdminRelayerUpdated(address indexed oldRelayer, address indexed newRelayer);
    event FundsWithdrawn(address indexed owner, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "MonadArcade: Only Owner");
        _;
    }

    constructor(address _adminRelayer) {
        require(_adminRelayer != address(0), "MonadArcade: Invalid relayer address");
        owner = msg.sender;
        adminRelayer = _adminRelayer;
    }

    // Allow contract to receive native MON for rewards treasury
    receive() external payable {}
    fallback() external payable {}

    /**
     * @dev Verify cryptographic voucher signed by backend relayer
     */
    function verifyVoucher(
        address user,
        uint256 amount,
        uint256 nonce,
        bytes memory signature
    ) public view returns (bool) {
        bytes32 messageHash = keccak256(
            abi.encodePacked(user, amount, nonce, address(this))
        );
        bytes32 ethSignedMessageHash = keccak256(
            abi.encodePacked("\x19Ethereum Signed Message:\n32", messageHash)
        );

        address recovered = recoverSigner(ethSignedMessageHash, signature);
        return recovered != address(0) && recovered == adminRelayer;
    }

    /**
     * @dev Claim native MON rewards using signed voucher
     */
    function claim(
        uint256 amount,
        uint256 nonce,
        bytes memory signature
    ) external {
        require(amount > 0 && amount <= 1000000, "MonadArcade: Invalid reward amount");
        require(!usedNonces[msg.sender][nonce], "MonadArcade: Nonce already claimed");
        require(verifyVoucher(msg.sender, amount, nonce, signature), "MonadArcade: Invalid backend signature");

        uint256 rewardValue = amount * 1000000000000000; // 0.001 MON per point
        require(address(this).balance >= rewardValue, "MonadArcade: Insufficient contract balance");

        // Mark nonce used before state change / transfer
        usedNonces[msg.sender][nonce] = true;
        totalClaimed[msg.sender] += amount;

        (bool success, ) = payable(msg.sender).call{value: rewardValue}("");
        require(success, "MonadArcade: Transfer failed");

        emit RewardClaimed(msg.sender, amount, nonce, block.timestamp);
    }

    /**
     * @dev Owner emergency/treasury withdrawal function
     */
    function withdraw(uint256 amount) external onlyOwner {
        require(amount <= address(this).balance, "MonadArcade: Insufficient balance");
        (bool success, ) = payable(owner).call{value: amount}("");
        require(success, "MonadArcade: Withdrawal failed");
        emit FundsWithdrawn(owner, amount);
    }

    function withdrawAll() external onlyOwner {
        uint256 bal = address(this).balance;
        require(bal > 0, "MonadArcade: Zero balance");
        (bool success, ) = payable(owner).call{value: bal}("");
        require(success, "MonadArcade: Withdrawal failed");
        emit FundsWithdrawn(owner, bal);
    }

    function updateRelayer(address _newRelayer) external onlyOwner {
        require(_newRelayer != address(0), "MonadArcade: Invalid address");
        emit AdminRelayerUpdated(adminRelayer, _newRelayer);
        adminRelayer = _newRelayer;
    }

    function recoverSigner(bytes32 _ethSignedMessageHash, bytes memory _sig) internal pure returns (address) {
        (bytes32 r, bytes32 s, uint8 v) = splitSignature(_sig);
        return ecrecover(_ethSignedMessageHash, v, r, s);
    }

    function splitSignature(bytes memory sig) internal pure returns (bytes32 r, bytes32 s, uint8 v) {
        require(sig.length == 65, "MonadArcade: Malformed signature");
        assembly {
            r := mload(add(sig, 32))
            s := mload(add(sig, 64))
            v := byte(0, mload(add(sig, 96)))
        }
        // EIP-2 signature malleability protection
        require(uint256(s) <= 0x7FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF5D576E7357A4501DDFE92F46681B20A0, "MonadArcade: Invalid s value");
    }
}
