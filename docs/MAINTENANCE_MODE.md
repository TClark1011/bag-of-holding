# Maintenance Mode

Bag of Holding has "maintenance mode" functionality which allows the application to be set to "maintenance mode". when in maintenance mode, the bag of holding home page will not show the "Get Started" button, and any attempt to create new or access existing sheets will be redirected to the home page.

![Landing Page in Maintenance Mode](../public/Maintenance_Screenshot.png?raw=true)

To enable maintenance mode, set the `NEXT_PUBLIC_MAINTENANCE_MODE` environment variable to `true`.
