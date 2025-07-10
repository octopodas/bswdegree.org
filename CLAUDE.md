# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a multi-page static website that provides an interactive guide to the Bachelor of Social Work (BSW) degree. The site is built entirely with Astro as a static site generator, designed to help prospective students explore career paths, academic requirements, and financial considerations for social work education.

## Architecture

**Technology Stack:**
- Astro static site generator
- HTML5 with semantic structure
- Vanilla JavaScript (ES6+) for interactivity
- Tailwind CSS (optimized and bundled by Astro)
- Chart.js for data visualization
- Build process generates optimized static files

**Key Design Patterns:**
- Multi-page application with standard navigation
- Astro components for shared layouts and functionality
- Modular data structure in `appData` object on each page
- Shared header/footer/navigation across all pages via Astro layouts
- Page-specific JavaScript for interactive features

## File Structure

```
/
├── src/                           # Astro source files
│   ├── pages/                     # Astro pages
│   │   ├── index.astro           # Home page
│   │   ├── is-it-for-me.astro    # Self-discovery page
│   │   ├── the-degree.astro      # Academic curriculum page
│   │   ├── career-and-salary.astro # Career paths and salary data
│   │   └── next-steps.astro      # Program selection and licensure
│   └── layouts/                   # Shared Astro layouts
├── dist/                          # Astro-generated static files
│   ├── index.html                # Built home page
│   ├── is-it-for-me/index.html   # Built self-discovery page
│   ├── the-degree/index.html     # Built academic curriculum page
│   ├── career-and-salary/index.html # Built career paths page
│   └── next-steps/index.html     # Built program selection page
├── astro.config.mjs              # Astro configuration
├── package.json                  # Dependencies and scripts
└── CLAUDE.md                     # This file
```

## Development Commands

This project uses Astro as a static site generator:

- **Development**: `npm run dev` - Start development server with hot reload
- **Build**: `npm run build` - Generate static files in `dist/` directory
- **Preview**: `npm run preview` - Preview built site locally
- **Testing**: Manual testing across different browsers and screen sizes
- **Deployment**: Host the generated `dist/` directory on any web server

## Content Structure

The application is organized into separate pages:

1. **Home (`/`)** - Key statistics and value proposition with animated counters
2. **Is It For Me (`/is-it-for-me/`)** - Personality traits, pros/cons toggle, ethics
3. **The Degree (`/the-degree/`)** - Curriculum, degree comparison tabs, fieldwork
4. **Career & Salary (`/career-and-salary/`)** - Specialization salary chart, ROI analysis
5. **Next Steps (`/next-steps/`)** - Program selection, filterable licensure table

## Interactive Features

**Data Visualizations:**
- Animated counters for key statistics (Home section)
- Horizontal bar chart for salary comparison (Chart.js)
- Filterable state licensure table
- Tabbed degree comparison interface
- Toggle between pros/cons lists

**Navigation:**
- Multi-page navigation with active state management
- Responsive mobile menu on all pages
- Consistent header/footer across all pages
- Standard browser navigation support

## Data Management

Content is stored in page-specific `appData` objects within each page's script tag:
- **Home**: No dynamic data (static content with counters)
- **Is It For Me**: `pros`/`cons` arrays for career advantages/disadvantages
- **The Degree**: `degreeComparisons` object for related degree comparison
- **Career & Salary**: `salaryData` object for specialization salary information
- **Next Steps**: `licensureData` array for state-by-state licensure requirements

## Performance Considerations

- Astro generates optimized static HTML with minimal JavaScript
- Page-specific JavaScript loads only required functionality
- Chart.js initialization on Career & Salary page load
- Counter animations trigger immediately on Home page load
- CSS and JavaScript are automatically optimized and bundled during build
- Minimal external dependencies are bundled efficiently
- No lazy loading needed due to separate pages

## Responsive Design

- Mobile-first approach with Tailwind CSS
- Breakpoint-specific layouts (sm, md, lg)
- Touch-friendly mobile navigation
- Scalable chart containers

## Key Code Patterns

**Page Navigation:**
Navigation is handled through standard anchor links with active state management:
```javascript
// Each page sets its own nav active state in the HTML
<a href="/is-it-for-me/" class="nav-link active">Is It For Me?</a>
```

**Data Rendering:**
```javascript
// Template literal patterns for dynamic content
prosConsContent.innerHTML = data.map(item => `
    <div class="...">
        <h4>${item.title}</h4>
        <p>${item.desc}</p>
    </div>
`).join('');
```

## Accessibility Features

- Semantic HTML structure
- ARIA labels and roles
- Screen reader friendly navigation
- Keyboard navigation support
- Focus management for interactive elements

## SEO Optimization

The site includes comprehensive SEO optimization:

**Meta Tags:**
- Unique title and description for each page
- Open Graph and Twitter Card metadata
- Canonical URLs to prevent duplicate content
- Keywords targeting social work education terms
- Theme colors and app metadata

**Structured Data:**
- Schema.org markup for WebSite, WebPage, and EducationalOrganization
- Occupation and salary data structured markup
- BreadcrumbList navigation for better site structure
- EducationalOccupationalCredential markup for BSW degree

**SEO Files:**
- `/sitemap.xml` - XML sitemap for search engine crawling
- `/robots.txt` - Crawler guidance and sitemap location

**SEO Best Practices:**
- Semantic HTML structure with proper heading hierarchy
- Alt text for images (when added)
- Fast loading with minimal dependencies
- Mobile-responsive design
- HTTPS-ready canonical URLs

## Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES6+ features used (arrow functions, template literals, const/let)
- No polyfills included - assumes modern browser support