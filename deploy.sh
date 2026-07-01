#!/usr/bin/env bash

# Deploys samsar-docs: rebuilds the site, uploads to S3, and invalidates CloudFront.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "${SCRIPT_DIR}"

# Configuration
S3_BUCKET="${S3_BUCKET:-samsar-docs}"
DIST_ID="E2MVTASSD9HUSM"

if ! command -v aws >/dev/null 2>&1; then
  echo "aws CLI is required but not found in PATH" >&2
  exit 1
fi

if ! command -v npm >/dev/null 2>&1; then
  echo "npm is required but not found in PATH" >&2
  exit 1
fi

if [[ -n "${BUILD_DIR:-}" ]]; then
  echo "Preparing build directory ${BUILD_DIR}..."
  rm -rf "${BUILD_DIR}"
  mkdir -p "${BUILD_DIR}"
  CLEAN_BUILD_DIR="false"
else
  BUILD_DIR="$(mktemp -d "${TMPDIR:-/tmp}/samsar-docs-build.XXXXXX")"
  CLEAN_BUILD_DIR="true"
fi

cleanup() {
  if [[ "${CLEAN_BUILD_DIR}" == "true" ]]; then
    rm -rf "${BUILD_DIR}"
  fi
}
trap cleanup EXIT

echo "Building site..."
npm run build -- --out-dir "${BUILD_DIR}"

echo "Uploading immutable hashed assets to s3://${S3_BUCKET}/assets..."
aws s3 sync "${BUILD_DIR}/assets/" "s3://${S3_BUCKET}/assets/" \
  --cache-control "public, max-age=31536000, immutable"

echo "Uploading HTML and static files to s3://${S3_BUCKET}..."
aws s3 sync "${BUILD_DIR}/" "s3://${S3_BUCKET}" \
  --delete \
  --exclude "assets/*" \
  --cache-control "no-cache, no-store, must-revalidate"

echo "Invalidating CloudFront distribution ${DIST_ID}..."
aws cloudfront create-invalidation --distribution-id "${DIST_ID}" --paths "/*"

echo "Deployment complete."
