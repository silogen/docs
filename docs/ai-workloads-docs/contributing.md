# Contributing

Thank you for considering contributing to the SiloGen AI Workloads development!

## Development Setup

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/silogen/ai-workloads
   cd ai-workloads
   ```

3. Set up development environment:
   ```bash
   python -m venv .venv
   source .venv/bin/activate
   # install packages you need
   ```

### Pre-commit setup

We use [pre-commit](https://pre-commit.com/) for consistent formatting and cleaner code. Hooks are specified in `ai-workloads-dev/.pre-commit-config.yaml`.

To install:<br />
`cd ai-workloads-dev` (this is necessary for `pre-commit install`, which runs particular to a git repository)<br />
`source your_venv`<br />
`pip install pre-commit`<br />
`pre-commit install --config .pre-commit-config.yaml`<br />
`git commit -m "test commit"`<br />

With the final command, pre-commit should run automatically, with output something like the following:

   >check json...........................................(no files to check)Skipped<br />
   check yaml...........................................(no files to check)Skipped<br />
   fix end of files.....................................(no files to check)Skipped<br />
   fix requirements.txt.................................(no files to check)Skipped<br />
   trim trailing whitespace.............................(no files to check)Skipped<br />
   black................................................(no files to check)Skipped<br />
   flake8...............................................(no files to check)Skipped<br />
   isort (python).......................................(no files to check)Skipped<br />
   mypy.................................................(no files to check)Skipped<br />
   helmlint.............................................(no files to check)Skipped<br />

It's also possible to manually run pre-commit using

`pre-commit run --all-files`

#### Troubleshooting pre-commit

Many pre-commit bugs come from having an incorrect version of pre-commit active. Pre-commit can hang around as a system-wide version, in python venvs, or in your pre-commit cache.

 It's easiest to use pre-commit as part of a python virtual environment. To check that the right pre-commit is being found, run `which pre-commit` and confirm that the binaries inside your venv are shown. For example: `/../../venvs/your_venv/bin/pre-commit`. A different path could indicate that your system is choosing the wrong pre-commit install.


From system:
`brew uninstall pre-commit` (mac)
`sudo apt remove pre-commit` (linux)

From venv:
`pip uninstall pre-commit`

Just the pre-commit hooks uninstall:
`pre-commit uninstall`
`pre-commit clean`


Then reinstall pre-commit from scratch as described above.


## Development Workflow

1. Create a branch for your feature or bugfix:
   ```bash
   git checkout -b feature-name
   ```

2. Make your changes and write tests

3. Run tests:
   ```bash
   pytest
   ```

4. Submit a pull request

## Documentation

Update the documentation when adding new features:

1. Add new pages in the `docs/` directory
2. Update the `nav` section in `mkdocs.yml` if necessary
3. Test the documentation locally:
   ```bash
   mkdocs serve
   ```

## Code Style

Follow PEP 8 guidelines. We use `black` for code formatting and `flake8` for linting.
