# Sovryn Dapp

## What's inside?

This is a turborepo for sovryn dapp v2.

### Apps and Packages

- `frontend`: a react app
- `@sovryn/ui`: a stub React component library shared by our apps
- `@sovryn/eslint-config-custom`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- `@sovryn/tailwindcss-config`: `tailwindcss` configuration
- `@sovryn/tsconfig`: `tsconfig.json`s used throughout the monorepo

## Development

```bash
# install dependencies
yarn install
# run all apps on development mode
yarn dev
# run storybook
yarn storybook
# run tests
yarn test
```
