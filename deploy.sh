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

echo "Removing existing build directory..."
rm -rf build

echo "Building site..."
npm run build

echo "Uploading build to s3://${S3_BUCKET}..."
aws s3 sync build/ "s3://${S3_BUCKET}" --delete

echo "Invalidating CloudFront distribution ${DIST_ID}..."
aws cloudfront create-invalidation --distribution-id "${DIST_ID}" --paths "/*"

echo "Deployment complete."
