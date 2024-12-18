# Static site generator and visual editor for SiloGen docs both internal and external

This project has the external docs under /external-docs and the internal-docs under /internal-docs. This project
builds static websites for both using [Docusaurus](https://docusaurus.io/), a modern static website generator. We also use Tina CMS to enable visual editing of the docs without a Github account. Tina is deployed within a NextJS app.

The documentation comes in the form of mdx files. It also has files for the sidebars and a seed file for the first TinaCMS user. You can edit all of these locally and
commit the changes as usual or you can edit the pages using the visual tool through a webapp. The webapp has the
internal docs site under / and the TinaCMS app under /admin. The webapp is deployed as a service in k8s and can
be reached at https://internal-docs.services.silogen.ai. The external docs are hosted by GitHub pages at
https://docs.silogen.ai.

You can also develop the TinaCMS or Docusaurus functionality of this project in itself.

## Quickstart With Tina

To see how Tina works with the files locally you can run Tina on your own machine. Tine will edit files locally and you can
commit as usual.
Install dependencies and then run the dev server for Tina. Access the server at localhost:3000/admin. Use pnpm
to install the dependencies. I prefer pnpm to npm since it's faster.

```
$ pnpm install && npm run dev
```

## Local Development of the Docusaurus site

Alternatively, you can edit the files manually in place and then see the results live at `http://localhost:3000/` with:

```
$ npm run docusaurus-start-internal
```

or

```
$ npm run docusaurus-start-external
```

These commands start a local development server and opens up a browser window. Most changes are reflected live without having to restart the server. When you are done editing you can commit changes as usual.

The sidebars are constructed from the `external-docs/config/sidebar/index.json` and `internal-docs/config/sidebar/index.json` files. You can edit them manually or you can edit them using TinaCMS.

## Build

To build everything: the Docusaurus site, the Tina implementation, and the NextJS webapp do:

```
$ npm run build
```

### The actual Docusaurus site

This command generates the static content of the Docusaurus website with our docs into the `build` directory and can be served using any static contents hosting service (Github pages in our case). See the [deployment info](#deployment) below.

### The tina implementation and the NextJS app

The Tina CMS configuration is built and encapsulated in a NextJS application. In order to deploy it you need to also build
and deploy the docker container. While testing you can build and run the container like this:

```
$ ./docker-build.sh
$ ./docker-run.sh
```

For production use, the container is built using the usual CI/CD system.

#### Setup pre-commit & pre-push with Husky for linting and formatting

Just be sure to be in the `docs/silogen-docs` directory and run the following command:

```bash
npm run prepare
```

This will install the husky hooks and will run the formatting and docusaurus build before each commit and linting, formatting and tests before each push.

### How to skip the pre-commit & pre-push hooks

Just add the `--no-verify` or `-n` flag to the `git commit` or `git push` command.

Note: when using Graphite, you cannot use `-n` but only `--no-verify`.

Note: when running tinacms with `npm run dev` it modifies the public/admin/.gitignore file and removes the line break at the end. This breaks the pre-commit checks so you should rever that change before committing. Same goes for the tina-lock.json file.

### Using Tina CMS online

When TinaCMS is deployed as a web app you can use it to edit the files in the docs online without a Github account.

- The application is protected by Keycloak authentication. You need an account with the 'docs_editor' role to use the editor. Without the editor role you can still read the internal documentation.
- Edit the files as you wish. As you save your changes they are committed to the `docs-edit` branch of the core repository.
- When your are done editing, create a PR for the changes (or ask someone to).
- When the PR is merged to main the deployment will happen automatically for external docs and when deploying the internal-docs service for internal docs as described below.

## Deployment

### Deployment of the Docusaurus site

Deployment will happen automatically for external docs like this:

- when changes to this directory are detected on the main branch, the workflow "docs-external-deploy.yml" will copy it over to the public documentation repository.
- when there is a push to the main branch of that repo, its workflow "deploy-docs.yml" will build the site and deploy it in GitHub pages.

### Deployment of the Tina CMS/NextJS app for visual editing

The webapp is deployed during a release of the SiloGen system.

## Future Work

- enable regular auth with keycloak and a special role that allows editing docs.
- (DONE) deploy also the internal docs using this method.
