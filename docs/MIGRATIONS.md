# Migrations

This file will contain instructions and checklists that should be followed when deploying/migrating to new versions.

## 1.0 - 1.1

- [ ] Confirm custom email domains work OR hide links to contact page if custom email implementation has been delayed
- [ ] Make sure subreddit is public
- [ ] Backup `sheets` mongodb data into a JSON file via MongoDB compass
- [ ] Enable maintenance mode
- [ ] Set migration mode environment variable to true on Vercel
- [ ] Merge development branch into production
- [ ] Perform data migrations
- [ ] Disable maintenance mode environment variable on Vercel
