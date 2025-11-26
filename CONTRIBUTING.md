# Contributing to eslint-plugin-fsd

Thank you for your interest in contributing to eslint-plugin-fsd!

## Development Setup

1. Fork and clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Run tests:
   ```bash
   npm test
   ```

4. Run linter:
   ```bash
   npm run lint
   ```

## Creating a New Rule

1. Create a new file in `lib/rules/` with your rule implementation
2. Add the rule to `lib/rules/index.js`
3. Create tests in `tests/lib/rules/`
4. Add documentation in `docs/rules/`
5. Update the README.md with the new rule

## Rule Structure

```javascript
module.exports = {
  meta: {
    type: 'problem', // 'problem', 'suggestion', or 'layout'
    docs: {
      description: 'Rule description',
      category: 'Best Practices',
      recommended: true,
    },
    fixable: null, // or 'code' or 'whitespace'
    schema: [], // Add rule options schema
  },
  create(context) {
    return {
      // Implementation
    };
  },
};
```

## Testing

We use Mocha for testing. Test files should be placed in `tests/lib/rules/` and follow this structure:

```javascript
const RuleTester = require('eslint').RuleTester;
const rule = require('../../../lib/rules/your-rule');

const ruleTester = new RuleTester();

ruleTester.run('your-rule', rule, {
  valid: [
    // Valid test cases
  ],
  invalid: [
    // Invalid test cases
  ],
});
```

## Pull Request Process

1. Update documentation for any new features or changes
2. Ensure all tests pass
3. Ensure code follows the project's coding standards
4. Update CHANGELOG.md with your changes
5. Submit a pull request with a clear description of the changes

## Code of Conduct

Please note we have a Code of Conduct, please follow it in all your interactions with the project.
