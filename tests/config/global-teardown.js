// Global teardown for Playwright E2E tests

async function globalTeardown(config) {
  console.log('🧹 Starting global teardown for Wiertla CNC E2E tests...');
  
  // Clean up any test data or temporary files
  // This is where you would clean up:
  // - Test databases
  // - Temporary files
  // - Mock data
  // - Browser profiles
  
  console.log('✅ Global teardown completed successfully!');
}

module.exports = globalTeardown;

