# Folder Structure

The following folders contained within this repository are used as described:

- **assets:** Used to store assets such as fonts or images. **NOTE:** assets used strictly in metadata should be stored within the public folder. See the description of that folder for more information.
- **components:** Store React components used in the application. Contains the subfolders:
	- **contexts:** Store contexts and custom hooks for use with those contexts
	- **domain:** Components with a single very specific use-case that is related directly and specifically to bag of holding.
	- **icons:** Custom SVG icons converted to components
	- **ui:** Generic re-useable components that can be used in a wide variety of circumstances
	- **templates:** Components that have specific use-cases similarly to 'domain' components but allow for limited re-use.
- **config:** Contains files related to application configuration
- **constants:** Contains variables to be re-used in various locations throughout the codebase
- **db:** Stores all code related to database operations
- **fixtures:** Placeholder data that can be used for application testing/previewing
- **pages:** Application pages. See [Next.js documentation](https://nextjs.org/docs/basic-features/pages) for more information
- **public:** Metadata assets that should be included with all application pages
	- **ogImages:** Images used in `og:image` metadata tags
- **services:** Store functions containing http request code
- **state:** State related code eg; reducers or Hookstate objects
- **types:** Typescript types
- **utils:** Utility functions
- **validation:** Yup object validation code that is used for validating form content