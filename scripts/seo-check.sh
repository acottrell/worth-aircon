#!/usr/bin/env bash
# SEO/AEO health check for worthaircon.com
# Usage: ./scripts/seo-check.sh [base_url]
# Defaults to production. Run after every deploy or on a schedule.

BASE="${1:-https://www.worthaircon.com}"
FAIL=0

check() {
  local name="$1" result="$2"
  if [ "$result" = "1" ]; then
    echo "  PASS: $name"
  else
    echo "  FAIL: $name"
    FAIL=1
  fi
}

echo "=== SEO/AEO checks against $BASE ==="
echo

HTML=$(curl -s --max-time 15 "$BASE/")

echo "-- Technical SEO --"
ROBOTS=$(curl -s --max-time 10 "$BASE/robots.txt")
echo "$ROBOTS" | grep -q "Sitemap:" && R=1 || R=0
check "robots.txt exists and references sitemap" $R

SITEMAP=$(curl -s --max-time 10 "$BASE/sitemap.xml")
echo "$SITEMAP" | grep -q "<urlset" && R=1 || R=0
check "sitemap.xml is valid XML urlset" $R

# Sitemap URLs must match the serving domain (no redirect hops for crawlers)
echo "$SITEMAP" | grep -q "<loc>$BASE" && R=1 || R=0
check "sitemap URLs match serving domain" $R

echo "$HTML" | grep -q "<title>Worth Aircon" && R=1 || R=0
check "title tag present" $R

echo "$HTML" | grep -q 'name="description"' && R=1 || R=0
check "meta description present" $R

echo "$HTML" | grep -q "rel=\"canonical\" href=\"$BASE\"" && R=1 || R=0
check "canonical matches serving domain" $R

echo "$HTML" | grep -q 'property="og:image"' && R=1 || R=0
check "OG image tag present" $R

OG_STATUS=$(curl -s -o /dev/null -w "%{http_code}" --max-time 15 "$BASE/opengraph-image")
[ "$OG_STATUS" = "200" ] && R=1 || R=0
check "OG image returns 200" $R

echo
echo "-- AEO (answer engine extractability) --"

echo "$HTML" | grep -q 'application/ld+json' && R=1 || R=0
check "JSON-LD structured data present" $R

echo "$HTML" | grep -q "FAQPage" && R=1 || R=0
check "FAQPage schema present" $R

# Content must be in static HTML, not client-rendered
echo "$HTML" | grep -q "How many hot nights does the UK actually get" && R=1 || R=0
check "FAQ content in static HTML (no JS needed)" $R

echo "$HTML" | grep -q "How this works" && R=1 || R=0
check "methodology in static HTML" $R

echo "$HTML" | grep -q "<h1" && R=1 || R=0
check "H1 present" $R

echo
echo "-- Performance signals --"
TTFB=$(curl -s -o /dev/null -w "%{time_starttransfer}" --max-time 15 "$BASE/")
echo "  INFO: TTFB ${TTFB}s (aim < 0.8s)"

SIZE=$(curl -s --max-time 15 "$BASE/" | wc -c | tr -d ' ')
echo "  INFO: HTML size ${SIZE} bytes (aim < 150KB)"

echo
if [ $FAIL = "0" ]; then
  echo "All checks passed."
else
  echo "SOME CHECKS FAILED."
  exit 1
fi
