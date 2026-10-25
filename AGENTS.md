- Keep the supplied web-experience media as immutable CDN asset pointers under src/assets/web-experience, because the prototype binaries must remain exact without bloating the repository.
- Keep the supplied refreshed marketing phone screens under public/app-screens-v2 by category and reference their stable public URLs, because the supplied WebP files must remain exact and render in the local preview.
- Scope the supplied hero and scroll-story presentation to WebExperience.css and keep scroll state inside ScrollStory, because the rest of the public site and admin must remain unchanged.

- Keep web-refresh v2 media as immutable CDN pointer files in src/assets/web-experience-v2, resolved through the brand domain for local Vite preview, because its server does not proxy asset URLs.
- Share the supplied v2 media map in src/lib/web-experience-v2.ts and scope its homepage scenes to WebExperience.css, so page visuals stay consistent without changing auth or admin.
- Keep the four homepage feature scenes in one FeatureScrollStory with scroll-linked state and a static reduced-motion fallback, so navigation anchors and visual changes remain synchronized.
- Keep Web Experience v3 scroll behavior in the shared experience/useStickyScroll hook and phone rendering in experience/DevicePhone, because both sticky stories use the supplied damped movement and device presentation.
