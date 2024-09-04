# PRVT Chat App

PRVT Chat App is a secure, blockchain-integrated communication platform that offers features like club creation, NFT integration, and decentralized messaging.

## Features

- User Registration and Onboarding with Web3Auth
- Club Creation and Management
- Club Discovery and Joining
- Secure In-Club Communication
- NFT and POAP Integration
- Decentralized Messaging with XMTP
- Spam Removal with Galadriel
- KYC Verification with Kinto
- Point System with Stackr Micro-rollup
- zkNoid Game Integration
- Sports Betting with Chiliz Blockchain

## Getting Started

1. Clone the repository
2. Install dependencies:

```bash
yarn
```

3. Run the development server:

```bash
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Planned Project Delivery Structure

```
src/
├── components/
│   ├── auth/
│   │   ├── Web3AuthButton.tsx
│   │   ├── WalletConnectButton.tsx
│   │   └── KYCVerification.tsx
│   ├── profile/
│   │   ├── ProfileCreation.tsx
│   │   ├── NFTSelector.tsx
│   │   └── ENSBadge.tsx
│   ├── club/
│   │   ├── ClubCreator.tsx
│   │   ├── ClubFinder.tsx
│   │   ├── MembershipRequirements.tsx
│   │   └── ClubActivities.tsx
│   ├── chat/
│   │   ├── ChatWindow.tsx
│   │   ├── MessageInput.tsx
│   │   └── GaladrielSpamRemover.tsx
│   └── games/
│       ├── ZkNoidGame.tsx
│       └── SportsBetting.tsx
├── pages/
│   ├── index.tsx
│   ├── auth.tsx
│   ├── onboarding.tsx
│   ├── profile.tsx
│   ├── clubs/
│   │   ├── create.tsx
│   │   ├── discover.tsx
│   │   └── [clubId].tsx
│   └── games/
│       ├── zknoid.tsx
│       └── sports-betting.tsx
├── hooks/
│   ├── useWeb3Auth.ts
│   ├── useWalletConnect.ts
│   ├── useNFTs.ts
│   ├── useENS.ts
│   ├── useKYC.ts
│   ├── useClub.ts
│   └── useXMTP.ts
├── services/
│   ├── web3AuthService.ts
│   ├── walletConnectService.ts
│   ├── kintoService.ts
│   ├── signProtocolService.ts
│   ├── galadrielService.ts
│   ├── xmtpService.ts
│   ├── litProtocolService.ts
│   ├── stackrService.ts
│   └── chilizService.ts
├── utils/
│   ├── accountAbstraction.ts
│   ├── nftGating.ts
│   └── pointSystem.ts
├── styles/
│   └── globals.css
└── types/
    ├── user.ts
    ├── club.ts
    ├── message.ts
    └── game.ts
```

## Core Flows

1. User Registration and Onboarding
2. Club Creation and Management
3. Club Discovery and Joining
4. Essential In-Club Communication
5. Standalone dApp Flows (zkNoid game, sports betting)

For detailed implementation steps, refer to the `implementation-steps.md` file in the project root.

## Technologies Used

- Next.js
- Web3Auth
- XMTP
- Lit Protocol
- Galadriel
- Sign Protocol
- Stackr
- Chiliz Blockchain
- Kinto
- ZkNoid

<!-- ## Contributing

We welcome contributions to the PRVT Chat App! Please read our [contributing guidelines](CONTRIBUTING.md) for more details.

## License

This project is licensed under the MIT License - see the `LICENSE.md` file for details. -->
