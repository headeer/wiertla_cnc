# Wiertla CNC Shopify Theme

This repository contains the Shopify theme for Wiertla CNC.

## Local Development Setup

### Prerequisites

- [Shopify CLI](https://shopify.dev/themes/tools/cli/installation)
- [Node.js](https://nodejs.org/) (v14 or later)
- A Shopify store with development access

### Step 1: Generate a Theme Access Password

1. Log in to your Shopify admin at https://1v1e1w-nc.myshopify.com/admin
2. Go to **Apps > Theme Access** (or search for "Theme Access" in the admin search)
3. Click **Create password**
4. Give it a name (e.g., "Local Development")
5. Select the themes you want to access
6. Click **Create password**
7. Copy the generated password (it will start with "shptka_")

### Step 2: Update Configuration

Update the `config.yml` file with your store information:

```yml
development:
  password: shptka_your_password_here  # Replace with your Theme Access password
  theme_id: "123456789"  # Optional: Replace with your theme ID if you want to edit an existing theme
  store: 1v1e1w-nc.myshopify.com
```

**Important Notes:**
- The password must be a Theme Access password (starts with "shptka_"), NOT your store admin password
- The theme_id is optional - if omitted, a new development theme will be created

### Step 3: Running Locally

To start the local development server:

```bash
npm run dev
```

Or directly with:

```bash
shopify theme dev
```

This will:
1. Connect to your Shopify store
2. Serve your theme locally
3. Watch for changes and automatically update the preview

### Other Commands

- `npm run pull`: Pull the latest theme from your Shopify store
- `npm run push`: Push your local changes to your Shopify store
- `npm run check`: Run theme check to validate your theme

## Folder Structure

- `assets/`: Theme assets (CSS, JavaScript, images)
- `config/`: Theme configuration files
- `layout/`: Theme layout templates
- `locales/`: Translation files
- `sections/`: Theme sections
- `snippets/`: Reusable code snippets
- `templates/`: Page templates 