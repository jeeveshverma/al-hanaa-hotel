#!/usr/bin/env bash
# Build the site and publish dist/ to the gh-pages branch (GitHub Pages source: branch gh-pages, /).
# Usage: scripts/deploy.sh        (needs the gh CLI logged in as the repo owner, or push rights)
set -euo pipefail
cd "$(dirname "$0")/.."
npm run build
rm -rf work/gh-pages
git branch -D gh-pages-build >/dev/null 2>&1 || true
git worktree add -q --detach work/gh-pages
( cd work/gh-pages && git checkout -q --orphan gh-pages-build && git rm -rfq . && cp -R ../../dist/. . && touch .nojekyll \
  && git add -A && git -c commit.gpgsign=false commit -q -m "Deploy $(date -u +%Y-%m-%dT%H:%MZ) from $(git -C ../.. rev-parse --short HEAD)" \
  && git push -f origin HEAD:gh-pages )
git worktree remove --force work/gh-pages
git branch -D gh-pages-build >/dev/null 2>&1 || true
echo "published gh-pages → https://jeeveshverma.github.io/al-hanaa-hotel/"
