[GitHub](https://github.com/DistributedCollective) | [Wiki](https://wiki.sovryn.com/en/home) | [Forum](https://forum.sovryn.app/) | [Blog](https://sovryn.com/all-things-sovryn/) | [LinkedIn](https://www.linkedin.com/company/sovryn/about/) | [Twitter](https://twitter.com/SovrynBTC) | [Discord](https://discord.gg/kBTNx4zjRf)

# Sovryn Dapp

---

## Browsers support

| <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="IE / Edge" width="24px" height="24px" /><br/>Edge | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" /><br/>Firefox | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" /><br/>Chrome | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" /><br/>Safari | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari-ios/safari-ios_48x48.png" alt="iOS Safari" width="24px" height="24px" /><br/>iOS Safari | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/opera/opera_48x48.png" alt="Opera" width="24px" height="24px" /><br/>Opera | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/brave/brave_48x48.png" alt="Opera" width="24px" height="24px" /><br/>Brave |
| ------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| last 5 versions                                                                                                                                        | last 5 versions                                                                                                                                               | last 5 versions                                                                                                                                           | last 5 versions                                                                                                                                           | last 5 versions                                                                                                                                                           | last 5 versions                                                                                                                                       | last 5 versions                                                                                                                                       |

## What's inside?

This is a turborepo for the Sovryn dApp and associated packages that are used to construct the user interface.

### Apps and Packages

- `frontend`: a react app
- `@sovryn/ui`: a stub React component library shared by our apps
- `@sovryn/contracts`: smart contract definition including ABIs, token details, contract addresses for main/testnet environments, and utilty functions for interacting with Sovryn smart contracts
- `@sovryn/ethers-provider`: helper functions for accessing ethers static provider
- `@sovryn/eslint-config-custom`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- `@sovryn/tailwindcss-config`: `tailwindcss` configuration
- `@sovryn/tsconfig`: `tsconfig.json`s used throughout the monorepo

## Development

- Make a fork of this repository and clone it to your machine.
- Make sure you use at least version 18 of Node.js.

  - To install Node.JS as a Windows user, download the required installation from the [Node.js](https://nodejs.org/en/download/) website.
  - To install Node.JS as a Linux or macOS user:
    - `sudo dnf module install nodejs:12`
  - To reset the older Node.JS installation so that you can upgrade to version 12:

    - `sudo dnf module reset nodejs`

    NOTE: Alternatively, You can use the NVM tool that is easy to use and allows you to switch between the installed node versions. For more information, see the [NVM](https://github.com/nvm-sh/nvm) guide.

- When running the `frontend` app locally, environment variables are loaded from `apps/frontend/.env.local`. If this file does not exist then it should be created with the format outlined in `apps/frontend/.env.example`, or the UI may fail to load.

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

## Contributing

<a href="https://github.com/DistributedCollective/sovryn-dapp/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=DistributedCollective/sovryn-dapp" />
</a>

### Support Questions

Sovryn's GitHub issue trackers are not intended to provide help or support. Use one of the following channels instead:

- [Discord](https://discord.gg/kBTNx4zjRf)
- [Wiki Pages](https://wiki.sovryn.app)
- [Sovryn Forum](https://forum.sovryn.app)
- [Sovryn Blog](https://sovryn.com/all-things-sovryn)

### Bug Reports

To foster active collaboration, Sovryn strongly encourages the creation of pull requests rather than just bug reports. "Bug reports" may also be sent in the form of a pull request containing a failing test.

However, if you file a bug report, your issue should contain a title and a clear description of the issue. You should also include as much relevant information as possible. The goal of a bug report is to make it easy for yourself - and others - to replicate the bug and develop a fix.

Remember, bug reports are created in the hope that others with the same problem will be able to collaborate with you on solving it. Do not expect that the bug report will automatically see any activity or that others will jump to fix it. Creating a bug report serves to help yourself and others start on the path of fixing the problem. If you want to chip in, you can help out by fixing any bugs listed in our [issue trackers](https://github.com/issues?q=is%3Aopen+is%3Aissue+label%3Abug+user%3Adistributedcollective).

### Which Branch?

The `develop` branch acts as a testnet containing the latest changes. The `main` branch is production branch for the **app.sovryn.com**. Depending on your feature you are contributing with, select the proper branch as a starting point. Most of the time, it will be the `develop` branch unless you provide hotfixes or features that should be released before other features - then it can be `main`. By doing so, we merge all features to `develop` and then `develop` to `main` to make one big release batch, after full testing and review.

**All** bug fixes should be sent to the latest stable `main` branch. Bug fixes should never be sent to the development branch unless they fix features that exist only in the upcoming release.

**Minor** features that are fully backward compatible with the current release may be sent to the latest stable branch.

**Major** new features should always be sent to the `develop` branch, which contains the upcoming release.

Ask in the `#technical-discussion` channel of the Sovryn Discord server when unsure if the feature qualifies as major or minor.

### Working With UI

All generic UI components located in `@sovryn/ui` package. Each component must include a Storybook example and Jest tests that verify functionality is working as intended. Figma designs for all components, and general design guidelines that we followed when constructing this library, can be found [here](https://www.figma.com/file/Ig2ZfR16Svs8In7yibukrO/Sovryn-UI-Library).

### Storybook

We use Storybook to provide API style docs and examples for our UI components. Any new components should have stories added to them that include all available properties that can be passed in, and some specific examples for major common variations. For specific implementation examples, you can search the codebase for files named `index.stories.tsx`.

To test components via Storybook on your local machine:

- run `yarn install` on your working branch.
- run `yarn storybook` to load the development server.
- access Storybook dev server on `localhost:6006`.
- if the docs fail to load and you see an error `cannot read properties of undefined (reading 'storyStore')`, the package installation is likely broken and you will need to clear `node_modules` folder and follow first two steps again.
- changes can now be made to `index.stories.tsx` files and the development server will hot-reload automatically.

To test components on a deployed PR link, look for `sovryn-storybook` comment in PR thread. If you would like to see the existing components in the Sovryn UI Library without running the code locally, the latest Storybook built from our `develop` branch can always be found [here](https://dev--sovryn-storybook.netlify.app/).

## Security Vulnerabilities

If you discover a security vulnerability within DApp, please submit your bug report to [Immunefi](https://immunefi.com/bounty/sovryn/) (there are bounty rewards). All security vulnerabilities will be promptly addressed.

## Code of Conduct

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/). For more information, see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

## Licence

The Sovryn DApp is open-sourced software licensed under the [MIT license](LICENSE).
