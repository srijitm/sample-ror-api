#!/bin/sh

set -e

if [ -f tmp/pids/server.pid ]; then
  rm tmp/pids/server.pid
fi

echo "Connecting to ${REACT_APP_API_URL}"
RAILS_ENV=production bundle exec rake assets:precompile
RAILS_ENV=production RAILS_SERVE_STATIC_FILES=true bundle exec rails s -p 3001 -b 0.0.0.0

