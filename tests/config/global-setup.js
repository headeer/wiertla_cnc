// Global setup for Playwright E2E tests

async function globalSetup(config) {
  console.log('🚀 Starting global setup for Wiertla CNC E2E tests...');
  
  // Set up test environment variables
  process.env.NODE_ENV = 'test';
  process.env.PLAYWRIGHT_TEST = 'true';
  
  // Wait for the development server to be ready
  const baseURL = config.projects[0].use.baseURL || 'http://localhost:3000';
  console.log(`⏳ Waiting for development server at ${baseURL}...`);
  
  // Simple health check
  const maxRetries = 30;
  const retryDelay = 2000;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(baseURL);
      if (response.ok) {
        console.log('✅ Development server is ready!');
        break;
      }
    } catch (error) {
      if (i === maxRetries - 1) {
        console.error('❌ Development server failed to start:', error.message);
        throw error;
      }
      console.log(`⏳ Attempt ${i + 1}/${maxRetries} - waiting for server...`);
      await new Promise(resolve => setTimeout(resolve, retryDelay));
    }
  }
  
  console.log('🎯 Global setup completed successfully!');
}

module.exports = globalSetup;
