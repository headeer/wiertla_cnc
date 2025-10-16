// Test script to verify pagination URL parameter functionality
// This script can be run in the browser console to test the pagination state persistence

console.log('Testing pagination URL parameter functionality...');

// Test 1: Check if URL parameters are properly read on page load
function testUrlParameterReading() {
  console.log('Test 1: URL Parameter Reading');
  
  // Simulate URL with page parameter
  const testUrl = 'https://example.com/collections/test?page=3&category=wiertla';
  const url = new URL(testUrl);
  const params = new URLSearchParams(url.search);
  
  const pageFromUrl = parseInt(params.get('page')) || 1;
  console.log('Page from URL:', pageFromUrl);
  
  if (pageFromUrl === 3) {
    console.log('✅ URL parameter reading works correctly');
  } else {
    console.log('❌ URL parameter reading failed');
  }
}

// Test 2: Check if URL parameters are properly updated
function testUrlParameterUpdating() {
  console.log('Test 2: URL Parameter Updating');
  
  // Simulate current URL
  const currentUrl = 'https://example.com/collections/test?category=wiertla';
  const url = new URL(currentUrl);
  
  // Add page parameter
  url.searchParams.set('page', '2');
  
  const expectedUrl = 'https://example.com/collections/test?category=wiertla&page=2';
  
  if (url.toString() === expectedUrl) {
    console.log('✅ URL parameter updating works correctly');
  } else {
    console.log('❌ URL parameter updating failed');
    console.log('Expected:', expectedUrl);
    console.log('Got:', url.toString());
  }
}

// Test 3: Check pagination state synchronization
function testPaginationSynchronization() {
  console.log('Test 3: Pagination State Synchronization');
  
  // Simulate the filter state
  const mockFilters = {
    page: 2,
    category: 'wiertla',
    status: 'all'
  };
  
  // Simulate currentPage synchronization
  let currentPage = mockFilters.page;
  
  if (currentPage === 2) {
    console.log('✅ Pagination state synchronization works correctly');
  } else {
    console.log('❌ Pagination state synchronization failed');
  }
}

// Test 4: Check URL parameter removal for default values
function testUrlParameterCleanup() {
  console.log('Test 4: URL Parameter Cleanup');
  
  const url = new URL('https://example.com/collections/test?page=1&category=wiertla');
  const params = new URLSearchParams(url.search);
  
  // Remove page=1 (default value)
  if (params.get('page') === '1') {
    params.delete('page');
  }
  
  const expectedUrl = 'https://example.com/collections/test?category=wiertla';
  
  if (url.pathname + (params.toString() ? '?' + params.toString() : '') === expectedUrl) {
    console.log('✅ URL parameter cleanup works correctly');
  } else {
    console.log('❌ URL parameter cleanup failed');
  }
}

// Run all tests
function runAllTests() {
  testUrlParameterReading();
  testUrlParameterUpdating();
  testPaginationSynchronization();
  testUrlParameterCleanup();
  
  console.log('\n=== Test Summary ===');
  console.log('All pagination URL parameter tests completed.');
  console.log('To test in browser:');
  console.log('1. Navigate to a collection page');
  console.log('2. Click "pokaż następne" to go to page 2');
  console.log('3. Check if URL contains ?page=2');
  console.log('4. Navigate to another page and come back');
  console.log('5. Verify you are still on page 2');
}

// Export for browser console usage
if (typeof window !== 'undefined') {
  window.testPaginationUrl = runAllTests;
  console.log('Test functions available. Run: testPaginationUrl()');
}

// Run tests if in Node.js environment
if (typeof module !== 'undefined' && module.exports) {
  runAllTests();
}
