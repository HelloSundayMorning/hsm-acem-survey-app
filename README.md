# Frontend

## Setup

Something like:

1. Install NodeJS
2. `npm install`
3. `cd frontend && npm run serve`

(configure API root in `src/config/dev.js`)

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
    
    # Run Application
    $ go run main.go

## Deployment

    # Get harp
    $ go get -u github.com/bom-d-van/harp
    
    # Deploy to production
    $ harp -s prod -log deploy
