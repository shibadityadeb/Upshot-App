#!/bin/bash
set -e
EMAIL="admin@gmail.com"
PASSWORD="Admin@123"
echo "Creating admin user: $EMAIL"
supabase auth users create "$EMAIL" --password "$PASSWORD" --email-confirm
echo "Promoting to admin role..."
supabase db execute --local <<SQL
UPDATE profiles SET role = 'admin', full_name = 'UBM Admin' WHERE email = '$EMAIL';
SQL
echo "Done. Login with: Email: $EMAIL  Password: $PASSWORD"
