# CHANGELOG

<!-- VERSION CHANGELOG TEMPLATE -->
<!--
## Version *VERSION NUMBER*

### Features
* new/altered features *

### Backend
* non user-facing stuff *

### Bug Fixes
* bug fixes *

### Documentation
* changes to documentation *
-->

## Version 1.1.0

### Features

- Created 'Contact' and 'Info' pages
- Added links to home, contact and info pages as well as to the GitHub repository to the top navigation bar
- Confirmation prompts are used when deleting an item or a party member from a sheet

### Backend

- Implemented Google Analytics

### Documentation

- Replaced template 'README.md' content with custom content
- Added required MIT license documentation
- Created `/docs` folder for storing documentation files
- Created`ENV.md` file documenting use of environment variables
- Created `FOLDER_STRUCTURE.md` file documenting codebase folder structure
- Created `API.md` file providing basic documentation of API routes

### Tests

- Added basic render testing to home and sheet page

## Version 1.0.1

### Features

- If an item's reference is a valid URL, the name becomes a clickable link to that URL
- The category item field will now auto suggest other category values from items in the sheet
