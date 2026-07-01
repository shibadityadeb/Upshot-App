# Creating the test admin account

Supabase Auth users cannot be created via plain SQL insert because
passwords must be hashed by Supabase's auth service. Use one of
these two methods:

## Method 1 — Supabase Dashboard (recommended for quick setup)

1. Go to your Supabase project dashboard
2. Navigate to Authentication > Users
3. Click "Add user" > "Create new user"
4. Email: admin@gmail.com
5. Password: Admin@123
6. Check "Auto Confirm User" so no email verification is needed
7. Click "Create user"
8. Go to the SQL Editor and run:
   UPDATE profiles
   SET role = 'admin', full_name = 'UBM Admin'
   WHERE email = 'admin@gmail.com';

9. Confirm it worked:

   SELECT id, email, full_name, role FROM profiles
   WHERE email = 'admin@gmail.com';

## Method 2 — Supabase CLI (for local dev)

Run: chmod +x scripts/create-admin.sh && ./scripts/create-admin.sh
