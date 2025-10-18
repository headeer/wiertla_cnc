# 🌐 **Shopify Language Setup Guide**

## **📊 The Issue**

The 404 errors for `/en/` and `/de/` URLs occur because Shopify doesn't automatically create subdirectory URLs for languages. We need to configure Shopify's language system properly.

## **🔧 Solution Options**

### **Option 1: Use Shopify's Standard Language URLs (Recommended)**

Shopify uses these URL patterns for languages:
- **Default (Polish)**: `https://wiertlacnc.shop/`
- **English**: `https://wiertlacnc.shop/en/` (if configured)
- **German**: `https://wiertlacnc.shop/de/` (if configured)

### **Option 2: Use Language Domains**

- **Polish**: `https://wiertlacnc.shop/`
- **English**: `https://en.wiertlacnc.shop/`
- **German**: `https://de.wiertlacnc.shop/`

## **🛠️ Shopify Admin Configuration**

### **Step 1: Enable Multiple Languages**

1. Go to **Shopify Admin** → **Settings** → **Languages**
2. Make sure **Polish**, **English**, and **German** are all **Published**
3. Set **Polish** as the **Default language**

### **Step 2: Configure Language URLs**

1. In **Languages** settings, look for **URL structure** options
2. Choose **Subdirectory** format if available
3. Or configure **Language domains** if subdirectories aren't available

### **Step 3: Test Language Switching**

1. Go to your storefront
2. Click language switcher
3. Verify URLs work correctly

## **🔍 Current Implementation**

I've reverted the code to use Shopify's standard `?locale=` parameter approach:

```liquid
<!-- Language links now use ?locale parameter -->
<a href="{{ request.path }}?locale=pl">PL</a>
<a href="{{ request.path }}?locale=en">EN</a>
<a href="{{ request.path }}?locale=de">DE</a>
```

## **📈 SEO Considerations**

### **Current Approach (URL Parameters)**
- ✅ **Works immediately** with Shopify
- ✅ **All languages accessible**
- ⚠️ **Limited SEO benefit** (search engines may not index all versions)

### **Subdirectory Approach (If Available)**
- ✅ **Better SEO** (separate URLs for each language)
- ✅ **Proper indexing** by search engines
- ⚠️ **Requires Shopify configuration**

## **🚀 Next Steps**

1. **Check Shopify Admin** → **Settings** → **Languages**
2. **Verify all languages are published**
3. **Test language switching** on your site
4. **If subdirectories are available**, we can update the code to use them
5. **If not**, the current `?locale=` approach will work for functionality

## **🧪 Testing**

Test these URLs:
- `https://wiertlacnc.shop/?locale=pl` (Polish)
- `https://wiertlacnc.shop/?locale=en` (English)  
- `https://wiertlacnc.shop/?locale=de` (German)

All should work without 404 errors.

## **📞 Support**

If you need help configuring Shopify's language settings, check:
1. **Shopify Help Center** → **Languages and currencies**
2. **Shopify Community** for language setup guides
3. **Shopify Support** for advanced language configuration
