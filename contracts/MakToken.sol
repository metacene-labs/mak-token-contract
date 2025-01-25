// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import {ERC20Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import {Ownable2StepUpgradeable} from "@openzeppelin/contracts-upgradeable/access/Ownable2StepUpgradeable.sol";
import {PausableUpgradeable} from "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";

contract MakToken is
    ERC20Upgradeable,
    Ownable2StepUpgradeable,
    PausableUpgradeable
{
    mapping(address => bool) public operators;
    mapping(address => bool) public transferBlacklist;
    mapping(address => bool) public receiveBlacklist;

    event Mint(address indexed _account, uint256 _amount);
    event Burn(address indexed _account, uint256 _amount);

    event AddTransferBlacklist(address addr);
    event RemoveTransferBlacklist(address addr);
    event AddReceiveBlacklist(address addr);
    event RemoveReceiveBlacklist(address addr);
    event AddOperator(address addr);
    event RemoveOperator(address addr);

    modifier onlyOperator() {
        require(operators[msg.sender], "Only operator can call this function");
        _;
    }

    function initialize(
        string memory _name,
        string memory _symbol
    ) public initializer {
        __ERC20_init(_name, _symbol);
        __Ownable_init();
        __Pausable_init();
    }

    function mint(address _to, uint256 _amount) external onlyOwner {
        _mint(_to, _amount);
        emit Mint(_to, _amount);
    }

    function burn(address _from, uint256 _amount) external onlyOwner {
        _burn(_from, _amount);
        emit Burn(_from, _amount);
    }

    function _transfer(
        address from,
        address to,
        uint256 value
    ) internal override whenNotPaused {
        require(!transferBlacklist[from], "from in blacklist");
        require(!receiveBlacklist[to], "to in blacklist");
        super._transfer(from, to, value);
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function addTransferBlacklist(address addr) external onlyOperator {
        transferBlacklist[addr] = true;
        emit AddTransferBlacklist(addr);
    }

    function removeTransferBlacklist(address addr) external onlyOperator {
        delete transferBlacklist[addr];
        emit RemoveTransferBlacklist(addr);
    }

    function addReceiveBlacklist(address addr) external onlyOperator {
        receiveBlacklist[addr] = true;
        emit AddReceiveBlacklist(addr);
    }

    function removeReceiveBlacklist(address addr) external onlyOperator {
        delete receiveBlacklist[addr];
        emit RemoveReceiveBlacklist(addr);
    }

    function addOperatorRole(address to) external onlyOwner {
        operators[to] = true;
        emit AddOperator(to);
    }

    function removeOperatorRole(address to) external onlyOwner {
        operators[to] = false;
        emit RemoveOperator(to);
    }
}
