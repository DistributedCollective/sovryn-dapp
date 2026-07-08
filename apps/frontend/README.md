# New Sovryn monorepo

To run the project, run

```
yarn --cwd apps/frontend build:dev
```

and then

```
yarn --cwd apps/frontend serve
```

To use custom environment variables locally, create a file named `.env.local` and add required values (see `.env.example` for sample variables and values).

For environment variables used in deployments see `netlify.toml`.

