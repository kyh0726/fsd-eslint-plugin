# eslint-plugin-fsd

ESLint plugin for Feature-Sliced Design architecture.

## Installation

```bash
npm install --save-dev eslint-plugin-fsd
# or
yarn add --dev eslint-plugin-fsd
```

## Usage

Add `fsd` to the plugins section of your `.eslintrc` configuration file:

```json
{
  "plugins": ["fsd"]
}
```

Then configure the rules you want to use under the rules section:

```json
{
  "rules": {
    "fsd/rule-name": "error"
  }
}
```

Or use the recommended configuration:

```json
{
  "extends": ["plugin:fsd/recommended"]
}
```

## Configurations

- `plugin:fsd/recommended` - Recommended rules for FSD architecture
- `plugin:fsd/all` - All available rules

## Rules

<!-- List of rules will be added here -->

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for details on how to contribute.

## License

MIT
