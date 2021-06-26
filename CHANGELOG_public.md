# CHANGELOG

<!-- This is a more reader-friendly version of the changelog, as opposed to `CHANGELOG.md` which is auto generated and not suitable to be viewed by end users -->

<!-- VERSION CHANGELOG TEMPLATE -->
<!--
## Version *VERSION NUMBER*

### Features
* new/altered features *

### Bug Fixes
* bug fixes *

### Backend
* non user-facing stuff *

### Documentation
* changes to documentation *
-->

## Version 1.1.0

### Features

- Created 'Contact' and 'Info' pages
- Added links to home, contact and info pages as well as to the GitHub repository to the top navigation bar
- Confirmation prompts are used when deleting an item or a party member from a sheet

### Bug Fixes
- Multiplication and division performed when calculating weight and value totals will no longer occasionally output incorrect and very long decimals
- Consecutive edits to party member names/the sheet title will no longer result in the first edit being completely overridden

### Backend

- Implemented Google Analytics
- Added maintenance mode that will redirect all users to landing page which will display a message explaining that the site is undergoing maintenance

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
