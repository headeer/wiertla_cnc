# 🧪 Wiertla CNC Testing Setup Guide

This guide will help you set up and run the comprehensive testing suite for the Wiertla CNC e-commerce platform.

## 📋 Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Git for version control
- Modern web browser (Chrome, Firefox, Safari)

## 🚀 Quick Start

### 1. Install Dependencies

```bash
# Install all testing dependencies
npm install

# Install Playwright browsers (for E2E tests)
npx playwright install
```

### 2. Run Tests

```bash
# Run all tests
npm test

# Run specific test suites
npm run test:unit          # Unit tests only
npm run test:integration   # Integration tests only
npm run test:e2e          # End-to-end tests only
npm run test:visual       # Visual regression tests
npm run test:performance  # Performance tests
npm run test:a11y         # Accessibility tests

# Run tests in watch mode (for development)
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

## 📁 Test Structure

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

## 🔧 Configuration Files

### Jest Configuration
- **File**: `package.json` (jest section)
- **Purpose**: Unit and integration test configuration
- **Key Settings**: Test environment, coverage thresholds, file patterns

### Playwright Configuration
- **File**: `playwright.config.js`
- **Purpose**: E2E test configuration
- **Key Settings**: Browser targets, timeouts, base URL

### GitHub Actions
- **File**: `.github/workflows/test.yml`
- **Purpose**: CI/CD pipeline configuration
- **Key Features**: Automated testing on push/PR, multiple test suites

## 🎯 Test Coverage Goals

- **Unit Tests**: 90%+ coverage
- **Integration Tests**: 80%+ coverage
- **E2E Tests**: 100% critical paths
- **Accessibility**: 0 violations
- **Performance**: 90+ Lighthouse scores

## 📊 Running Tests Locally

### Development Workflow

1. **Start Development Server**
   ```bash
   npm run dev
   ```

2. **Run Tests in Watch Mode**
   ```bash
   npm run test:watch
   ```

3. **Run Specific Test Files**
   ```bash
   # Run a specific test file
   npm test -- tests/unit/filtering/productFiltering.test.js
   
   # Run tests matching a pattern
   npm test -- --testNamePattern="filterByPrefix"
   ```

### E2E Testing

1. **Start Development Server**
   ```bash
   npm run dev
   ```

2. **Run E2E Tests**
   ```bash
   npm run test:e2e
   ```

3. **Run E2E Tests in UI Mode**
   ```bash
   npx playwright test --ui
   ```

4. **Run E2E Tests in Debug Mode**
   ```bash
   npx playwright test --debug
   ```

## 🐛 Debugging Tests

### Unit Tests
```bash
# Run tests with verbose output
npm test -- --verbose

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- tests/unit/filtering/productFiltering.test.js
```

### E2E Tests
```bash
# Run tests in headed mode (see browser)
npx playwright test --headed

# Run tests in debug mode
npx playwright test --debug

# Run specific test file
npx playwright test tests/e2e/user-journeys/product-discovery.spec.js
```

## 📈 Test Reports

### Coverage Reports
- **Location**: `coverage/` directory
- **Format**: HTML, LCOV, JSON
- **View**: Open `coverage/lcov-report/index.html` in browser

### E2E Test Reports
- **Location**: `playwright-report/` directory
- **Format**: HTML report with screenshots and videos
- **View**: Open `playwright-report/index.html` in browser

### Performance Reports
- **Location**: `.lighthouseci/` directory
- **Format**: JSON with performance metrics
- **View**: Check GitHub Actions artifacts

## 🔍 Writing New Tests

### Unit Tests
```javascript
// tests/unit/your-feature/yourFeature.test.js
import { createMockProduct } from '../../fixtures/productFactory.js';

describe('Your Feature', () => {
  test('should do something', () => {
    const product = createMockProduct({ sku: 'VW.123' });
    // Your test logic here
    expect(product.sku).toBe('VW.123');
  });
});
```

### E2E Tests
```javascript
// tests/e2e/your-feature/yourFeature.spec.js
import { test, expect } from '@playwright/test';

test.describe('Your Feature', () => {
  test('should work end-to-end', async ({ page }) => {
    await page.goto('/');
    // Your test logic here
    await expect(page.locator('h1')).toBeVisible();
  });
});
```

## 🚨 Troubleshooting

### Common Issues

1. **Tests failing due to missing dependencies**
   ```bash
   npm install
   npx playwright install
   ```

2. **E2E tests failing due to server not running**
   ```bash
   npm run dev
   # Wait for server to start, then run tests
   ```

3. **Coverage reports not generating**
   ```bash
   npm run test:coverage
   # Check if coverage/ directory is created
   ```

4. **Playwright browsers not installed**
   ```bash
   npx playwright install --with-deps
   ```

### Getting Help

- Check the test output for error messages
- Review the test configuration files
- Check the GitHub Actions logs for CI/CD issues
- Consult the Jest and Playwright documentation

## 📚 Additional Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Playwright Documentation](https://playwright.dev/docs/intro)
- [Testing Library Documentation](https://testing-library.com/docs/)
- [Lighthouse CI Documentation](https://github.com/GoogleChrome/lighthouse-ci)

## 🎉 Next Steps

1. **Run the initial test suite** to ensure everything is working
2. **Write tests for new features** as you develop them
3. **Maintain test coverage** above the defined thresholds
4. **Review test results** regularly to catch regressions early
5. **Update tests** when requirements change

Happy testing! 🚀
