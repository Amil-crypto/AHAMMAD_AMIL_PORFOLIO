# Personal engineering portfolio

A responsive multi-page portfolio built with HTML, CSS, and JavaScript. No build step or runtime dependencies. Includes dark/light themes, keyboard focus styles, reduced-motion support, original CSS/SVG project illustrations, and mobile layouts.

## Files

- `index.html`: home page
- `work.html`: selected projects
- `about.html`: biography, education, and skills
- `journey.html`: experience and learning goals
- `contact.html`: contact and social links
- `styles.css`: responsive design, both themes, animation, and print styles
- `profile.js`: personal details, resume path, and project URLs
- `script.js`: profile rendering, link validation, theme persistence, and scroll reveals
- `favicon.svg`: code-inspired favicon

## Personalize before publishing

1. Edit `profile.js` with your name, initials, college, graduation year, email, GitHub, LinkedIn, and each project's repository/demo URLs. Use full HTTPS URLs. Missing links display a clear coming-soon state, with no broken or fake destinations.
2. Put your real resume at `resume.pdf` in this folder and set `resume: "./resume.pdf"`. This enables both download buttons. No resume was invented or included.
3. Your name, initials, graduation year, email, and GitHub are already configured. When changing your name later, update `index.html` too, including the title and Open Graph tags. This ensures previews and pages without JavaScript show your real name. Adjust the meta descriptions to your preference.
4. Set `siteUrl` to the deployed HTTPS URL. For search engines and social crawlers that do not run JavaScript, also add a static canonical link and `og:url` meta tag to the HTML head using that URL. Add an `og:image` with an absolute URL if you create a social preview image.
5. Review project copy against what is implemented. The SIH card describes the submission's target capabilities; the journey section explicitly labels STEP preparation and GSoC as goals. There are no invented employers, awards, user counts, latency figures, or accuracy scores. The PhishGuard illustration is a labeled concept preview, not a real result.
6. Add verified outcomes directly to the relevant project card: for example, evaluation dataset and held-out F1 score, simulation error against a reference circuit, or measured fleet coordination results. Include methodology/context with every number.

## Run locally

Open `index.html` directly, or serve this folder:

```sh
python -m http.server 8080
```

Then open `http://localhost:8080`. Fonts load from Google Fonts; system sans-serif fallbacks work offline. All artwork is local CSS/SVG.

## Deploy

### GitHub Pages

Commit these files to a GitHub repository. In **Settings → Pages**, select **Deploy from a branch**, choose your branch, and use the root folder. Relative asset and resume paths also work for project sites hosted under `/repository-name/`.

### Vercel

Import the repository, select **Other** as the framework, leave the build command empty, and use the repository root as the output directory. No environment variables are required.

## Review checklist

- Replace personal placeholders and connect real contact/project links.
- Add and test the resume PDF download.
- Review the page at mobile and desktop widths in both themes.
- Tab through navigation, theme toggle, and links.
- Check with reduced motion enabled and confirm links use the intended destinations.
- Update static SEO tags and the canonical URL before sharing with recruiters.

No contact form or tracking is included. The email button opens the visitor's mail app once an email is configured.
