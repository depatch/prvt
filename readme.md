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
.
├── components.json
├── implementation-steps.md
├── next-env.d.ts
├── next.config.mjs
├── package.json
├── postcss.config.js
├── postcss.config.mjs
├── public
│   ├── abis
│   │   └── 7887.json
│   ├── next.svg
│   └── vercel.svg
├── readme.md
├── src
│   ├── app
│   │   ├── chat
│   │   │   └── page.tsx
│   │   ├── clubs
│   │   │   └── page.tsx
│   │   ├── complete-profile
│   │   │   └── page.tsx
│   │   ├── favicon.ico
│   │   ├── globals.css
│   │   ├── home
│   │   │   └── page.tsx
│   │   ├── layout.tsx
│   │   ├── messages
│   │   │   └── page.tsx
│   │   └── page.tsx
│   ├── components
│   │   ├── ActiveSession.tsx
│   │   ├── ClubActivities.tsx
│   │   ├── ClubChat.tsx
│   │   ├── ClubContent.tsx
│   │   ├── ClubCreatorAgent.tsx
│   │   ├── ClubEvents.tsx
│   │   ├── ClubFinderAgent.tsx
│   │   ├── ClubGovernance.tsx
│   │   ├── ClubPolls.tsx
│   │   ├── ClubSharing.tsx
│   │   ├── ConnectWalletButton.tsx
│   │   ├── Conversation.tsx
│   │   ├── CreateClubDialog.tsx
│   │   ├── CreateMessageDialog.tsx
│   │   ├── Footer.tsx
│   │   ├── GaladrielSpamRemover.tsx
│   │   ├── Header.tsx
│   │   ├── MessageInput.tsx
│   │   ├── MessageList.tsx
│   │   ├── NotificationCenter.tsx
│   │   ├── OnboardingTutorial.tsx
│   │   ├── PinnedMessages.tsx
│   │   ├── SportsBetting.tsx
│   │   ├── UserAchievements.tsx
│   │   ├── UserBadges.tsx
│   │   ├── VerifyButton.tsx
│   │   ├── XMTPSubscribeButton.tsx
│   │   ├── ZkNoidGame.tsx
│   │   └── ui
│   │       ├── avatar.tsx
│   │       ├── badge.tsx
│   │       ├── button.tsx
│   │       ├── checkbox.tsx
│   │       ├── dialog.tsx
│   │       ├── input.tsx
│   │       ├── progress.tsx
│   │       ├── textarea.tsx
│   │       └── toast.tsx
│   ├── contexts
│   │   └── MessageContext.tsx
│   ├── hooks
│   │   ├── useChiliz.ts
│   │   ├── useENS.ts
│   │   ├── useLitProtocol.ts
│   │   ├── useMina.ts
│   │   ├── useStackr.ts
│   │   ├── useWeb3Auth.ts
│   │   └── useXMTP.ts
│   ├── index.css
│   ├── lib
│   │   └── utils.ts
│   ├── pages
│   │   └── api
│   │       ├── serper-search.ts
│   │       └── xmtp
│   │           ├── subscribe.ts
│   │           └── subscriptions.ts
│   ├── prvt.code-workspace
│   ├── public
│   │   └── abis
│   │       └── Agent.json
│   ├── types
│   │   ├── floatingInbox.d.ts
│   │   └── index.d.ts
│   └── utils
│       └── nftFetcher.ts
├── tailwind.config.js
├── tailwind.config.ts
├── todos.md
├── tsconfig.json
└── yarn.lock
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
