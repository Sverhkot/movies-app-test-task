#!/bin/sh
set -e

# Default if user forgot to pass anything
: "${API_URL:=http://localhost:8000/api/v1}"

cat >/app/dist/env.js <<EOF
window.__APP_CONFIG__ = {
  API_URL: "${API_URL}"
};
EOF

# launch the static server (serve)
exec serve -s dist -l 3000 