# API

Bag of Holding offers a minimalist REST API with the bare minimum functionality required for the application to function.

- GET - `/api/sheets/newSheet` - Generates a new sheet and returns the id of the new sheet as a plain string.
- GET - `/api/sheets/[sheetId]` - Fetch the sheet with the provided id.
- PATCH - `/api/sheets/[sheetId]` - Expects a valid `SheetStateAction` which is processed by the `dbReducer` to determine what mutations will be executed upon a sheet's document in the database.