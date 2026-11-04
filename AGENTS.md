# Maintaining this portal

- The canonical challenge list is `public/data/<year>/works.json`. Do not hand-edit generated `docs/<year>-plan.md` or duplicate project data in HTML/TSX.
- Put common presentation data in `public/data/site.json`; registered years and default year in `public/data/years.json`.
- After changing data, run `npm run plan`, `npm test`, `npm run build`.
- The ChatGPT planning Page is a derived snapshot of this data. When this session updates the plan, change JSON first, regenerate Markdown, then update the corresponding daily Page blocks from that generated content. Do not claim unattended sync. Keep private schedules, family details and internal planning context out of public JSON.
- Preserve third-party data/image licenses and source attribution. MIT applies to original portal code; see CREDITS.md.
- Use the repository-local Git identity configured by the user. Do not add AI co-author or assistant attribution.
