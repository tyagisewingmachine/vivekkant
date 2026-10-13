# Vivek Kant website — update pack v1.5.0

This is an **update pack for the existing** `tyagisewingmachine/vivekkant` GitHub Pages repository, not a complete site repository. It keeps the existing premium portfolio and relies on the images already present in its `assets/` directory.

## Included changes
- The uploaded 3-second MP4 logo-reveal is used in the opening intro instead of the static intro logo.
- Intro video is muted and inline for mobile autoplay compatibility. It closes after playback, has a Skip Intro button, and has a timeout fallback.
- The new TSOL logo artwork replaces `assets/tsol-logo.png` and is fitted on a white logo card so its white background blends into the design.
- Existing portrait, Tyagi company logo, styles and the demo-only feedback form remain in place.
- No paid service or new third-party dependency has been added.

## Upload to the existing repository
Upload these files to the **same paths** in the existing repository, replacing files when prompted:
1. `index.html` → repository root
2. `script.js` → repository root
3. `assets/tsol-logo.png` → repository `assets/` folder (replace the existing TSOL logo)
4. `assets/vivek-intro.mp4` → repository `assets/` folder (new file)

Do not delete other files already in the repository. In GitHub, commit the changes to branch `main`; Pages should rebuild automatically. Give the page a moment to redeploy, then refresh the site. If the previous intro is cached in the current tab, open the page in a new tab to see the version 1.5 intro.

## Important
- The feedback form is still a **demo only**: it does not send or store messages.
- This update does not publish changes to GitHub by itself; it prepares the files for upload.
- Existing contact details and links have been left as they were in the current repository; confirm they are still approved for public display before launch.
