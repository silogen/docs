# SiloGen AMD Enterprise AI platform documentation

The documentation for this project is built using MkDocs with the Material theme. The documentation utilizes Github actions which import Markdown files from multiple sources into this consolidated documentation repository.

## Setting up documentation locally

1. Install documentation dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Start the documentation server:
   ```bash
   mkdocs serve
   ```

3. View the documentation at http://localhost:8000

## Building documentation

To build the documentation site without serving it run `mkdocs build`.

The built site will be in the `site` directory. The serve function also watches for changes in the documents and builds the site automatically

## Development

See the [Contributing](docs/contributing.md) guide for development setup instructions.

## Publishing

The external SiloGen documentation is published from this repository as a web site in Github pages in address [docs.silogen.ai](https://docs.silogen.ai).
