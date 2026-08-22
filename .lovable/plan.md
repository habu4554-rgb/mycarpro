# Fix Russian and Estonian Google visibility

## Changes
- Make Russian the canonical homepage language and keep Estonian as a separate crawlable `/et` page.
- Correct each server-rendered page language (`ru`, `et`, `en`) so Google receives the right `<html lang>` value.
- Align canonical, Open Graph, and `hreflang` URLs with the live `https://www.mycarpro.ee` domain.
- Make language switching perform real page navigation so metadata and page language update correctly.
- Add a crawlable sitemap containing the Russian homepage and Estonian page, plus a robots file pointing Google to it.
- Keep private admin and password-reset pages out of the sitemap.

## Verification
- Confirm the Russian and Estonian URLs return localized titles, descriptions, canonical URLs, language tags, and content in server-rendered HTML.
- Confirm `/robots.txt` and `/sitemap.xml` are accessible and the project builds successfully.

## Note
These changes provide Google the correct language signals, but Google controls when results are recrawled and which language it displays for each searcher. The screenshot result is for `mycar.ee`, which is a separate website from MyCarPro.
