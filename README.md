# Czarny api boilerplate 2

### Environment variables
- **PORT** (default: 8080)
- **DB_NAME** (default: 'chooseYourDbNameForThisBoilerplate', you can change the default in config.js)
- **DB_HOST** (default: 'localhost:27017')
- **ADMIN_PASSWORD** - (*required*) password to access API (password must be then added to each request as a "authentication" header)

### Run development build
`ADMIN_PASSWORD=foobarbaz npm run dev`

### Run production build
`ADMIN_PASSWORD=foobarbaz npm run start`