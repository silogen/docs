---
title: Flyte Workflows
description: How to use Flyte workflows in the SiloGen platform.
---

## Deploying and Running New Versions of Workflows

During the workflow registration process the serialized definition of the workflow is uploaded to Flyte, however, nothing is executed at this point.

There are multiple ways to interact with the Flyte and launch executions. The most user-friendly ways include launching a job from user’s console (UI) of SiloGen platform or from Flyte console. Flyte console can be accessed at:

1. Development: https://dev-flyte.tail5abf9.ts.net/console/projects/silogen/domains/flyte-workflows/executions

1. Production: https://production-flyte.tail5abf9.ts.net/console/projects/silogen/domains/flyte-workflows/executions

### Automatic Evaluation Workflows Registration from CI/CD

1. Registering to `dev` environment happens on every commit to `silocore`, `evaluation_client`, `llmops/silogen` packages.

1. Registering to production happens on changes to `core/llmops/silogen/releases/evaluation-workflows-release.txt` file and pushing to main. Any change to this file will work, but convention is to increment a version number in the file. It is worth noting that the actual workflow version is composed using branch name and shortened git commit SHA, e.g. `main-f99e1b15`.

### Links to workflow dashboards in Flyte and launching guidelines

Below you can find a list of URLs for quick accessing different workflows that we support in Flyte console. To launch a workflow from Flyte console, click L`aunch Workflow` button in the top right of workflow dashboard page, enter input parameters, and click `Launch`. The most user-friendly way however, would be to launch a job from SiloGen platform UI, since there authentication token is passed to Flyte workflow without a need to echoing and copy-pasting it.

1. LLM as Judge Evaluation:

   1. Development: https://dev-flyte.tail5abf9.ts.net/console/projects/silogen/domains/flyte-workflows/workflows/workflows.evaluation_pipelines.judge_evaluation_pipeline

   1. Production: https://production-flyte.tail5abf9.ts.net/console/projects/silogen/domains/flyte-workflows/workflows/workflows.evaluation_pipelines.judge_evaluation_pipeline

Besides UI-based ways to launch workflows there are CLI-based. The detailed dive in Flyte CLI setup and interaction can be found at https://github.com/silogen/core/blob/main/llmops/silogen/README.md
