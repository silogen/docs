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
