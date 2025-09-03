# EHC Gym

A Turborepo for the EHC Gym application with Convex backend.

## Prerequisites

Before getting started, make sure you have the following installed and configured:

- **Node.js v20 or higher** - [Download here](https://nodejs.org/)
- **pnpm** - Install globally with `npm install -g pnpm`
- **Convex account** - [Create an account](https://convex.dev/) to manage your backend database and functions

## Getting Started

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd ehc-gym
pnpm install
```

### 2. Initialize Convex Backend

Navigate to the backend package and set up Convex:

```bash
cd packages/backend
pnpm dev:setup
```

This will:
- Configure your Convex deployment
- Set up authentication with your Convex account
- Generate the necessary configuration files

### 3. Start Development

After Convex is configured, you can start the backend in development mode:

```bash
# From packages/backend directory
pnpm dev
```

Or from the root directory:

```bash
# Start all packages
pnpm dev

# Start specific package
pnpm dev --filter=@ehc-gym/backend
```

## Project Structure

```
ehc-gym/
├── packages/
│   └── backend/                 # Convex backend package
│       ├── src/
│       │   └── convex/         # Convex functions and schema
│       │       ├── _generated/ # Auto-generated Convex files
│       │       ├── schema.ts   # Database schema definitions
│       │       ├── tasks.ts    # Task-related functions
│       │       └── README.md   # Convex functions documentation
│       ├── package.json        # Backend dependencies and scripts
│       ├── tsconfig.json       # TypeScript configuration
│       ├── convex.json         # Convex configuration
│       └── .env.local         # Local environment variables
├── apps/                       # Frontend applications (to be added)
├── packages/                   # Shared packages
├── README.md                   # This file
└── package.json               # Root package configuration
```

## What's inside?

This Turborepo includes the following packages/apps:

### Apps and Packages

- `@ehc-gym/backend`: Convex backend with database schema and API functions
- Additional frontend apps and shared packages will be added here

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Utilities

This Turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [Convex](https://convex.dev/) for backend database and real-time functions
- [pnpm](https://pnpm.io/) for fast, disk space efficient package management

### Development Commands

```bash
# Start all packages in development mode
pnpm dev

# Start specific package
pnpm dev --filter=@ehc-gym/backend

# Build all packages
pnpm build

# Build specific package
pnpm build --filter=@ehc-gym/backend
```

### Backend (Convex) Commands

```bash
cd packages/backend

# Start development server
pnpm dev

# Initial setup with configuration
pnpm dev:setup
```

## Environment Setup

### Backend Setup

The backend requires a Convex deployment. After running `pnpm dev:setup` in the backend directory, you'll have:

- A `.env.local` file with your Convex deployment URL
- Connection to your Convex dashboard for database management
- Real-time function deployment and testing

### Frontend Setup

For any frontend applications that need to connect to Convex, create a `.env.local` file in the frontend package directory with:

```bash
CONVEX_URL=https://your-own-url.convex.cloud
```

This allows your frontend applications to connect to the Convex backend and use real-time database functions.

## Useful Links

Learn more about the technologies used:

- [Turborepo Documentation](https://turborepo.com/docs)
- [Convex Documentation](https://docs.convex.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [pnpm Documentation](https://pnpm.io/motivation)
