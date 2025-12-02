# Development Setup

## Prerequisites

- Node.js >= 14.0.0
- pnpm >= 8.0.0

## Installation

1. Install pnpm (if not already installed):

```bash
npm install -g pnpm
# or
curl -fsSL https://get.pnpm.io/install.sh | sh -
```

2. Install dependencies:

```bash
pnpm install
```

3. This will automatically:
   - Install all dependencies
   - Setup husky git hooks
   - Configure pre-commit hooks

## Git Hooks

### Pre-commit Hook

Automatically runs before each commit:

1. **Run tests** - Ensures all tests pass
2. **Lint staged files** - Fix ESLint errors on staged files
3. **Format code** - Format staged files with Prettier

### Manual Hook Setup

If hooks don't work automatically, run:

```bash
pnpm prepare
chmod +x .husky/pre-commit
```

## Available Scripts

```bash
# Run tests
pnpm test

# Run linter
pnpm lint

# Format code
pnpm format

# Check formatting
pnpm format:check

# Version bump (patch)
pnpm version:patch
```

## First Time Setup

After cloning the repository:

```bash
# 1. Install dependencies
pnpm install

# 2. Verify everything works
pnpm test
pnpm lint

# 3. Make changes and commit
git add .
git commit -m "your message"
# Pre-commit hook will run automatically!
```

## Troubleshooting

### Husky hooks not running

```bash
# Reinstall husky
rm -rf .husky
pnpm prepare
```

### Tests failing

```bash
# Clear node_modules and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
pnpm test
```

