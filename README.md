# Frontend

## Setup

Something like:

1. Install NodeJS
2. `cd frontend`
2. `npm install`
3. `npm start`

(configure API root in `src/config/dev.js`)

If you are not working on the front-end and just need it to build for distribution/deployment, run `npm install --production instead`

### Simulating Production Environment

Build distribution version of app (starting at repo root):

1. `cd frontend`
2. `npm run dist`
3. `cd ../public`

Serve built front-end:

1. `python -mSimpleHTTPServer <port, defaults to 8000>`

# Backend

## Quick Started

    # Get code
    $ go get -u github.com/theplant/hsm-acem-survey-app
    
    # Set environment variables
    $ cp config/.envrc.example config/.envrc
    $ source config/.envrc
    
    # Setup postgres database
    $ postgres=# CREATE USER acem;
    $ postgres=# CREATE DATABASE acem_dev OWNER acem;
    
    # Update dependencies and run migrations
    $ go get -d -t ./...
    $ go run db/reset.go
    $ go run db/seeds.go

    # Setup environment
    ...
    
    # Run Application
    $ go run main.go

# Deployment

Install harp

    go get -u github.com/bom-d-van/harp

Build front-end

    cd frontend && npm run dist

Deploy to production

    harp -s prod -log deploy

# Asset Sharing

Assets are shared between JS frontend and Go backend templates. Assets
are created via Webpack and output to `public/assets`. Any files in
`frontend/public` are copied directly to `public/`.

Generated assets are listed in `public/assets/manifest.json`
(generated when frontend is built with `env=dist`).

Go backend reads this file and provides a template function `asset`
that will map the input asset filename to the generated asset.

In development (or rather, if the environment variable
`SERVE_STATIC_ASSETS` is not blank, the Go backend will serve assets
from `http://.../assets` directly, mapping to `public/assets`.

In production, assets should be served by Nginx directly from the
public directory (via `tryfiles`).
