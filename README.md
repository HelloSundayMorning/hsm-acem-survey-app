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

Serve built front-end (starting at repo root):

1. `cd /public`
2. `python -mSimpleHTTPServer <port, defaults to 8000>`

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
