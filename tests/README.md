# Wiertla CNC Testing Suite

This directory contains all tests for the Wiertla CNC e-commerce platform.

## Directory Structure

```
tests/
├── unit/                 # Unit tests (70% of tests)
│   ├── filtering/       # Product filtering logic tests
│   ├── translations/    # Translation system tests
│   ├── urlParams/       # URL parameter handling tests
│   └── utils/          # Utility function tests
├── integration/         # Integration tests (20% of tests)
│   ├── components/     # Component integration tests
│   ├── filters/        # Filter interaction tests
│   └── table/          # Table rendering tests
├── e2e/                # End-to-end tests (10% of tests)
│   ├── user-journeys/  # Critical user journey tests
│   ├── product-flow/   # Product discovery and details
│   └── customer-flow/  # Customer account management
├── visual/             # Visual regression tests
├── performance/        # Performance tests
├── accessibility/      # Accessibility tests
├── fixtures/           # Test data and mocks
├── helpers/            # Test utilities and helpers
└── config/             # Test configuration files
```

## Running Tests

```bash
# Run all tests
npm test

# Run specific test suites
npm run test:unit
npm run test:integration
npm run test:e2e
npm run test:visual
npm run test:performance
npm run test:a11y

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Test Coverage Goals

- **Unit Tests**: 90%+ coverage
- **Integration Tests**: 80%+ coverage
- **E2E Tests**: 100% critical paths
- **Accessibility**: 0 violations
- **Performance**: 90+ Lighthouse scores
