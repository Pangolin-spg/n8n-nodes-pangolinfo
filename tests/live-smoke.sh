#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PACKAGE_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
ENV_FILE="$PACKAGE_DIR/.env"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "Missing $ENV_FILE"
  exit 1
fi

set -a
source "$ENV_FILE"
set +a

if [[ -z "${PANGOLINFO_API_KEY:-}" ]]; then
  echo "PANGOLINFO_API_KEY is not configured"
  exit 1
fi

RESULT_DIR="$(mktemp -d)"
trap 'rm -rf "$RESULT_DIR"' EXIT

run_test() {
  local name="$1"
  local endpoint="$2"
  local payload="$3"
  local output="$RESULT_DIR/$name.json"
  local http_code

  http_code="$(curl -sS --max-time 200 -o "$output" -w '%{http_code}' \
    -X POST "https://scrapeapi.pangolinfo.com$endpoint" \
    -H "Authorization: Bearer $PANGOLINFO_API_KEY" \
    -H 'Accept: application/json' \
    -H 'Content-Type: application/json' \
    --data "$payload")"

  local app_code message bytes
  app_code="$(jq -r '.code // .status // "n/a"' "$output" 2>/dev/null || echo 'invalid-json')"
  message="$(jq -r '.message // .errorMessage // ""' "$output" 2>/dev/null || echo 'unparseable response')"
  bytes="$(wc -c < "$output" | tr -d ' ')"
  printf '%-18s http=%s app=%s bytes=%s message=%s\n' "$name" "$http_code" "$app_code" "$bytes" "$message"

  [[ "$http_code" == "200" ]]
}

run_test "amazon-product" "/api/v1/scrape" '{
  "parserName": "amzProductDetail",
  "site": "amz_us",
  "content": "B0DYTF8L2W",
  "format": "json",
  "bizContext": {"zipcode": "10041"}
}'

run_test "amazon-reviews" "/api/v1/scrape" '{
  "url": "https://www.amazon.com",
  "site": "amz_us",
  "parserName": "amzReviewV2",
  "format": "json",
  "formatType": "all_formats",
  "mediaType": "all_contents",
  "bizContext": {
    "bizKey": "review",
    "asin": "B076CLQDR4",
    "pageCount": 1,
    "filterByStar": "all_stars",
    "sortBy": "recent"
  }
}'

run_test "amazon-search" "/api/v1/scrape" '{
  "parserName": "amzKeyword",
  "site": "amz_us",
  "content": "headphones",
  "format": "json",
  "bizContext": {"zipcode": "10041"}
}'

run_test "seller-products" "/api/v1/scrape" '{
  "parserName": "amzProductOfSeller",
  "site": "amz_us",
  "content": "A294P4X9EWVXLJ",
  "pageCount": 1,
  "format": "json",
  "bizContext": {"zipcode": "10041"}
}'

run_test "best-sellers" "/api/v1/scrape" '{
  "parserName": "amzBestSellers",
  "site": "amz_us",
  "content": "electronics",
  "format": "json",
  "bizContext": {"zipcode": "10041"}
}'

run_test "new-releases" "/api/v1/scrape" '{
  "parserName": "amzNewReleases",
  "site": "amz_us",
  "content": "electronics",
  "format": "json",
  "bizContext": {"zipcode": "10041"}
}'

run_test "alexa" "/api/v2/scrape" '{
  "parserName": "amazonAlexa",
  "param": ["Recommend a quiet portable fan under $30"],
  "url": "https://www.amazon.com/",
  "screenshot": false
}'

run_test "ai-overview" "/api/v2/scrape" '{
  "parserName": "googleSearch",
  "url": "https://www.google.com/search?q=best+portable+fan",
  "screenshot": false
}'

run_test "keyword-trends" "/api/v2/google/trends" '{
  "timeRange": "today 3-m",
  "region": "US",
  "keywords": ["portable fan", "neck fan"],
  "language": "en-US"
}'

run_test "niche-filter" "/api/v1/amzscope/niches/filter" '{
  "marketplaceId": "US",
  "searchVolumeT90Min": 10000,
  "top5BrandsClickShareMax": 0.4,
  "page": 1,
  "size": 1
}'

run_test "category-filter" "/api/v1/amzscope/categories/filter" '{
  "marketplaceId": "US",
  "timeRange": "l7d",
  "sampleScope": "all_asin",
  "categoryId": "979832011",
  "page": 1,
  "size": 1
}'
