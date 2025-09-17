#!/bin/bash

# Create database file if it doesn't exist
touch database/database.sqlite

# Run migrations
php artisan migrate --force

# Start the server
php artisan serve --host=0.0.0.0 --port=$PORT
