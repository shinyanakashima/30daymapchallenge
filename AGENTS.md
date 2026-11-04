# Notes for maintaining this repository

- `public/data/<year>/works.json` is the source for each year's themes and projects. Don't edit the generated `docs/<year>-plan.md` by hand, and don't copy project data into HTML or TSX.
- Shared site text goes in `public/data/site.json`. Listed years and the default year go in `public/data/years.json`.
- After changing data, run `npm run plan`, `npm test` and `npm run build`.
- Keep personal schedules and other private notes out of the JSON files. They are public.
- Keep the licenses and credits of third-party data and images. MIT covers the portal code only (see CREDITS.md).
- Commit with the Git identity configured in this repository.
