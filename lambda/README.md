# Netlify Functions

## Develop

See https://docs.netlify.com/cli/manage-functions/#serve-functions-with-a-standalone-server-locally

To start local dev environment:

- fill root `.env` file
- `cd lambda` (this directory)
- `netlify.toml` should be like :

```toml
[build]
  command = "npm run build"
  publish = "build"

[functions]
  directory = "src"
  node_bundler = "esbuild"

[dev]
  functions = "src"
  functionsPort = 9999
```

- `npx netlify functions:serve`
- you will see if it found your functions and `.env` file because it will have logs like:

```log
◈ Ignored general context env var: LANG (defined in process)
◈ Injected .env file env var: UNSPLASH_API_ACCESS_KEY
◈ Injected .env file env var: AT_API_KEY
◈ Injected .env file env var: AT_POLLS_BASE
◈ Injected .env file env var: AT_POLLS_TABLE
   ┌─────────────────────────────────────────────────┐
   │                                                 │
   │   ◈ Server now ready on http://localhost:9999   │
   │                                                 │
   └─────────────────────────────────────────────────┘

◈ Loaded function poll-description
◈ Loaded function polls
◈ Loaded function airtable-poll-api
```

- you can access/call the functions on `http://localhost:9999/.netlify/functions/{function-name=js filename without .js extension}`
- you can add console.log to see in logs
- everything will hot reload on JS file save

## Build

TBD

## Deploy

TBD