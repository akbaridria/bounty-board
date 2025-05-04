# 🏆 BountyBoard

A decentralized bounty creation and fulfillment platform built on blockchain technology.

> **Quick Links:**  
> 📝 [Smart Contract Repository](https://github.com/akbaridria/bounty-board-contract)  
> 🔄 [dApp Worker Service](https://github.com/akbaridria/bounty-board-server)

## 📖 Overview

BountyBoard is a mini dApp that enables users to create and participate in bounties in a fully decentralized way. Bounty creators can post tasks, and hunters can submit solutions to earn rewards. All bounty content is stored on IPFS while settlements happen on-chain, ensuring transparency and immutability.

## 🪜 Sequence Diagram

sequenceDiagram
    actor Creator
    actor Hunter
    participant BountyBoard
    participant IPFS
    participant Blockchain

    %% Bounty Creation
    Creator->>IPFS: Store bounty details
    IPFS-->>Creator: Return CID
    Creator->>BountyBoard: createBounty(cid, deadlines, prizes, type)
    BountyBoard->>Blockchain: Lock funds (prizes + fee)
    Blockchain-->>BountyBoard: Confirm transaction
    BountyBoard-->>Creator: Bounty created successfully

    %% Submission
    Hunter->>IPFS: Store submission details
    IPFS-->>Hunter: Return CID
    Hunter->>BountyBoard: createSubmission(bountyId, cid)
    BountyBoard->>Blockchain: Record submission
    Blockchain-->>BountyBoard: Confirm transaction
    BountyBoard-->>Hunter: Submission recorded successfully

    %% Winner Selection
    Creator->>BountyBoard: selectWinners(bountyId, winners)
    BountyBoard->>Blockchain: Transfer prizes to winners
    Blockchain-->>BountyBoard: Confirm transfers
    BountyBoard-->>Creator: Winners selected, prizes distributed

## ✨ Features

- **Two Bounty Types:**
  - **Editable Bounties**: Can be modified after creation (prize amount, deadline, etc.)
  - **Non-Editable Bounties**: Immutable after creation for maximum transparency
  
- **Automated Prize Distribution:**
  - Auto-payout when a winner is selected
  - Fair distribution of prize among all participants if no winner is selected after the review deadline
  
- **Multiple Prize Options:**
  - Support for native LYX tokens (✅)
  - Support for LSP7 tokens (soon)
  - Support for LSP8 tokens (soon)