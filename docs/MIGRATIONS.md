# Migrations

This file will contain instructions and checklists that should be followed when deploying/migrating to new versions.

## 1.0 - 1.1

- [x] Confirm custom email domains work OR hide links to contact page if custom email implementation has been delayed
- [x] Make sure subreddit is public
- [x] Backup `sheets` mongodb data into a JSON file via MongoDB compass
- [x] Enable maintenance mode
- [x] Set migration mode environment variable to true on Vercel
- [x] Merge development branch into production
- [x] Perform data migrations
- [x] Disable maintenance mode environment variable on Vercel
