# Sovryn Dapp

## What's inside?

This is a turborepo for sovryn dapp v2.

### Apps and Packages

- `frontend`: a react app
- `@sovryn/ui`: a stub React component library shared by our apps
- `@sovryn/ethers-provider`: helper functions for accessing ethers static provider
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

## Error resolution

**husky package not available**

When using NVM and committing code changes, you may receive a "package 'husky' not found" error. Assuming this is already installed on your machine (by `yarn install`) then you may need to add the file `~/.huskyrc` with the following contents:

```bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
```

**module not found**

If "module not found" errors are encountered when running `yarn test` or from husky precommit checks, then please make sure packages are built first by running `yarn dev` or `yarn build` from root directory.
