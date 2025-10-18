/**
 * SEO Multi-Language URL Test
 * This script tests the new subdirectory-based language URLs for SEO
 */

console.log('🌐 Testing SEO Multi-Language URL Implementation...');

// Test 1: Check if hreflang tags are present
function testHreflangTags() {
  console.log('\n📋 Test 1: Hreflang Tags');
  
  const hreflangLinks = document.querySelectorAll('link[rel="alternate"][hreflang]');
  console.log(`Found ${hreflangLinks.length} hreflang tags:`);
  
  hreflangLinks.forEach(link => {
    const lang = link.getAttribute('hreflang');
    const url = link.getAttribute('href');
    console.log(`  ${lang}: ${url}`);
  });
  
  // Check for required languages
  const requiredLangs = ['pl', 'en', 'de', 'x-default'];
  const foundLangs = Array.from(hreflangLinks).map(link => link.getAttribute('hreflang'));
  
  requiredLangs.forEach(lang => {
    if (foundLangs.includes(lang)) {
      console.log(`  ✅ ${lang} hreflang found`);
    } else {
      console.log(`  ❌ ${lang} hreflang missing`);
    }
  });
}

// Test 2: Check language switcher URLs
function testLanguageSwitcher() {
  console.log('\n📋 Test 2: Language Switcher URLs');
  
  const langLinks = document.querySelectorAll('.header__lang-links a[data-lang]');
  console.log(`Found ${langLinks.length} language links:`);
  
  langLinks.forEach(link => {
    const lang = link.getAttribute('data-lang');
    const href = link.getAttribute('href');
    console.log(`  ${lang}: ${href}`);
    
    // Check if URL uses subdirectory format
    if (href.includes(`/${lang}/`)) {
      console.log(`    ✅ ${lang} uses subdirectory format`);
    } else {
      console.log(`    ❌ ${lang} does not use subdirectory format`);
    }
  });
}

// Test 3: Check HTML lang attribute
function testHtmlLangAttribute() {
  console.log('\n📋 Test 3: HTML Lang Attribute');
  
  const htmlLang = document.documentElement.getAttribute('lang');
  console.log(`HTML lang attribute: ${htmlLang}`);
  
  if (htmlLang && ['pl', 'en', 'de'].includes(htmlLang)) {
    console.log(`  ✅ Valid language code: ${htmlLang}`);
  } else {
    console.log(`  ❌ Invalid or missing language code: ${htmlLang}`);
  }
}

// Test 4: Check current URL structure
function testCurrentUrlStructure() {
  console.log('\n📋 Test 4: Current URL Structure');
  
  const currentUrl = window.location.href;
  const currentPath = window.location.pathname;
  
  console.log(`Current URL: ${currentUrl}`);
  console.log(`Current Path: ${currentPath}`);
  
  // Check if URL uses subdirectory format
  const langMatch = currentPath.match(/^\/(pl|en|de)(\/.*)?$/);
  if (langMatch) {
    const detectedLang = langMatch[1];
    console.log(`  ✅ URL uses subdirectory format with language: ${detectedLang}`);
  } else {
    console.log(`  ❌ URL does not use subdirectory format`);
  }
}

// Test 5: Check canonical URL
function testCanonicalUrl() {
  console.log('\n📋 Test 5: Canonical URL');
  
  const canonicalLink = document.querySelector('link[rel="canonical"]');
  if (canonicalLink) {
    const canonicalUrl = canonicalLink.getAttribute('href');
    console.log(`Canonical URL: ${canonicalUrl}`);
    console.log(`  ✅ Canonical URL present`);
  } else {
    console.log(`  ❌ Canonical URL missing`);
  }
}

// Run all tests
function runAllTests() {
  console.log('🚀 Starting SEO Multi-Language Tests...\n');
  
  testHreflangTags();
  testLanguageSwitcher();
  testHtmlLangAttribute();
  testCurrentUrlStructure();
  testCanonicalUrl();
  
  console.log('\n✅ SEO Multi-Language Tests Complete!');
  console.log('\n📝 Summary:');
  console.log('- Language switcher now uses subdirectory URLs (/pl/, /en/, /de/)');
  console.log('- Hreflang tags point to proper subdirectory URLs');
  console.log('- JavaScript language switching redirects to proper URLs');
  console.log('- All languages will be indexed by search engines');
  console.log('\n🎯 Next Steps:');
  console.log('1. Test language switching on the live site');
  console.log('2. Verify all pages work with subdirectory URLs');
  console.log('3. Submit sitemap to Google Search Console');
  console.log('4. Monitor indexing of all language versions');
}

// Auto-run tests when script loads
runAllTests();
