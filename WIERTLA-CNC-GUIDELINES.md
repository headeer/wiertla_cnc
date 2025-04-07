# Wiertla CNC Project Guidelines

## Project Overview
Wiertla CNC is a Shopify-based e-commerce platform specializing in CNC tools and equipment. The project follows a component-based architecture with a focus on maintainability, performance, and user experience.

## Directory Structure
```
wiertla-cnc/
├── assets/          # Static assets (CSS, JS, images)
├── components/      # Reusable UI components
├── layout/          # Theme layout templates
├── locales/         # Translation files
├── sections/        # Page sections
├── snippets/        # Reusable code snippets
└── templates/       # Page templates
```

## Coding Standards

### 1. CSS Architecture
- Follow BEM (Block Element Modifier) methodology
- Use the `wiertla-` prefix for all custom classes
- Organize styles by component/section
- Mobile-first approach with media queries
- Use CSS custom properties for theming

Example:
```css
.wiertla-component__element--modifier {
  /* styles */
}

@media screen and (max-width: 768px) {
  .wiertla-component__element--modifier {
    /* mobile styles */
  }
}
```

### 2. JavaScript Guidelines
- Use vanilla JavaScript or jQuery as specified
- Wrap DOM manipulation in `DOMContentLoaded` event
- Use meaningful variable and function names
- Comment complex logic
- Handle errors gracefully

Example:
```javascript
document.addEventListener('DOMContentLoaded', function() {
  // DOM manipulation code
});
```

### 3. Liquid Template Standards
- Use semantic HTML5 elements
- Maintain consistent indentation
- Use meaningful variable names
- Comment complex logic
- Follow Shopify's Liquid best practices

### 4. Component Development
- Each component should be self-contained
- Use consistent naming conventions
- Document component props and usage
- Include mobile responsiveness
- Follow accessibility guidelines

## Best Practices

### 1. Mobile Responsiveness
- Always test on multiple devices
- Use mobile-first media queries
- Maintain consistent spacing
- Ensure touch targets are adequate
- Test performance on mobile networks

### 2. Performance Optimization
- Minimize CSS and JavaScript
- Optimize images
- Use lazy loading where appropriate
- Minimize DOM manipulation
- Cache static assets

### 3. Accessibility
- Use semantic HTML
- Include ARIA labels
- Ensure keyboard navigation
- Maintain color contrast
- Test with screen readers

### 4. Code Organization
- Keep files focused and small
- Use consistent file naming
- Group related functionality
- Document complex logic
- Follow DRY principles

## Common Components

### 1. Mobile Preview Modal
```css
.wiertla-categories__mobile-preview-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
}
```

### 2. Status Filters
```css
.wiertla-categories__status-filters--mobile {
  display: flex;
  gap: 10px;
  margin: 0 0 20px 0;
  padding: 0 20px;
}
```

### 3. Table Layout
```css
.wiertla-categories__table {
  width: 100% !important;
  max-width: 100% !important;
  table-layout: fixed !important;
}
```

## Modification Guidelines

### 1. Adding New Features
1. Create new component in appropriate directory
2. Follow existing naming conventions
3. Include mobile responsiveness
4. Document component usage
5. Test across devices

### 2. Modifying Existing Features
1. Review existing code thoroughly
2. Maintain existing class names
3. Preserve mobile functionality
4. Test all affected components
5. Update documentation

### 3. Bug Fixes
1. Identify root cause
2. Make minimal necessary changes
3. Test across devices
4. Document the fix
5. Update relevant tests

## Testing Checklist
- [ ] Test on desktop browsers
- [ ] Test on mobile devices
- [ ] Verify responsive behavior
- [ ] Check accessibility
- [ ] Validate performance
- [ ] Review code quality
- [ ] Update documentation

## Common Issues and Solutions

### 1. Mobile Layout Issues
- Use flexbox for layouts
- Set explicit widths where needed
- Test on multiple devices
- Use appropriate media queries

### 2. Performance Issues
- Optimize images
- Minimize DOM updates
- Use efficient selectors
- Cache static assets
- Lazy load content

### 3. Cross-browser Compatibility
- Use vendor prefixes
- Test in multiple browsers
- Use feature detection
- Follow web standards
- Document browser-specific fixes

## Version Control
- Use meaningful commit messages
- Create feature branches
- Review code before merging
- Keep commits focused
- Document breaking changes

## Deployment
1. Test in development
2. Review changes
3. Deploy to staging
4. Verify functionality
5. Deploy to production
6. Monitor for issues

## Support and Maintenance
- Document known issues
- Keep dependencies updated
- Monitor performance
- Regular security audits
- Backup data regularly

## Contact
For technical support or questions, contact the development team. 