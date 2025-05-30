import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";
import { Octokit } from "@octokit/rest";
import type { RestEndpointMethodTypes } from "@octokit/rest";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";

dotenv.config();

// Cache object to store results
const fileMetadataCache: {
  [key: string]: { authors: Array<{ name: string }>; lastEdited: string };
} = {};

function clearFileMetadataCache(): void {
  Object.keys(fileMetadataCache).forEach(
    (key) => delete fileMetadataCache[key],
  );
}

const REPO_ROOT_PREFIX = "docs/silogen-docs";
// const LEVELS_TO_REPO_ROOT = REPO_ROOT_PREFIX.split('/').length;

// Function to find the repository root
function findRepoRoot(startPath: string): string {
  let currentPath = path.resolve(startPath);

  // For local development, search for .git directory
  while (currentPath !== path.dirname(currentPath)) {
    if (fs.existsSync(path.join(currentPath, ".git"))) {
      return currentPath;
    }
    currentPath = path.dirname(currentPath);
  }
  // Fallback: return the current working directory (like when building docker image)
  return process.cwd();
}

function getRelativeFilePath(
  filePath: string,
  findFunction = findRepoRoot,
): string | null {
  const projectRoot = process.cwd();
  const repoRoot = findFunction(projectRoot);

  if (repoRoot === projectRoot) {
    // We're in the Docker build context
    return path.join(REPO_ROOT_PREFIX, path.relative(projectRoot, filePath));
  } else {
    // We're in local development
    return path.relative(repoRoot, filePath);
  }
}

function getEnvironmentVariables(): {
  token: string;
  owner: string;
  repo: string;
} | null {
  const token = process.env.GITHUB_ACCESS_TOKEN;
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;

  if (!token || !owner || !repo) {
    console.error("Missing required environment variables");
    if (!token) console.error("GITHUB_ACCESS_TOKEN is missing");
    if (!owner) console.error("GITHUB_OWNER is missing");
    if (!repo) console.error("GITHUB_REPO is missing");
    return null;
  }

  return { token, owner, repo };
}

async function fetchCommits(
  octokit: Octokit,
  owner: string,
  repo: string,
  path: string,
): Promise<
  RestEndpointMethodTypes["repos"]["listCommits"]["response"]["data"]
> {
  let allCommits: RestEndpointMethodTypes["repos"]["listCommits"]["response"]["data"] =
    [];
  let page = 1;
  const per_page = 100;

  while (true) {
    const response = await octokit.repos.listCommits({
      owner,
      repo,
      path,
      per_page,
      page,
    });

    allCommits = allCommits.concat(response.data);

    if (response.data.length < per_page) {
      break;
    }

    page++;
  }

  return allCommits;
}

function extractAuthorFromCommit(commit: any): string {
  const commitMessage = commit.commit.message;
  const match = commitMessage.match(/^(.*?):\s*(Update|Delete)\s*content/);

  if (match) {
    return match[1];
  }

  return (
    commit.commit.author?.name || commit.commit.committer?.name || "Unknown"
  );
}

async function getFileMetadata(
  filePath: string,
  getRelativeFilePathFunction = getRelativeFilePath,
): Promise<{ authors: { name: string }[]; lastEdited: string } | undefined> {
  // Check if result is in cache
  if (fileMetadataCache[filePath]) {
    return fileMetadataCache[filePath];
  }

  try {
    const relativeFilePath = getRelativeFilePathFunction(filePath);
    const envVars = getEnvironmentVariables();

    if (!relativeFilePath || !envVars) {
      console.error(
        `Invalid file path or missing environment variables. File path: ${relativeFilePath}, Environment variables: ${JSON.stringify(envVars)}`,
      );
      return undefined;
    }

    const octokit = new Octokit({ auth: envVars.token });
    const commits = await fetchCommits(
      octokit,
      envVars.owner,
      envVars.repo,
      relativeFilePath,
    );

    const lastCommitDate: string =
      commits[0]?.commit.committer?.date ?? "Unknown";

    const authors = commits
      .map((commit) => extractAuthorFromCommit(commit))
      .filter((author, index, self) => self.indexOf(author) === index)
      .map((name) => ({ name }));

    const metadata = {
      authors,
      lastEdited: lastCommitDate,
    };

    console.log(
      "Metadata for original filepath ",
      filePath,
      " converted to relative ",
      relativeFilePath,
      ":",
      metadata,
    );

    fileMetadataCache[filePath] = metadata;
    return metadata;
  } catch (error) {
    console.error("Error in getFileMetadata:", error);
    return { authors: [], lastEdited: "Unknown" };
  }
}

const config: Config = {
  title: "SiloGen INTERNAL Docs",
  tagline: "Custom LLMs made easy.",
  favicon: "img/favicon.ico",
  // with these static dirs we don't get the CNAME file in the build
  staticDirectories: ["public"],

  // Set the production url of your site here
  url: "https://internal-docs.services.silogen.ai",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "silogen", // Usually your GitHub org/user name.
  projectName: "internal-docs", // Usually your repo name.

  onBrokenLinks: "warn",
  onBrokenMarkdownLinks: "warn",

  // inject metadata about author and last updated date into the frontmatter
  markdown: {
    parseFrontMatter: async (params) => {
      const result = await params.defaultParseFrontMatter(params);
      const metadata = await getFileMetadata(params.filePath);
      return {
        ...result,
        frontMatter: {
          ...result.frontMatter,
          metadata: metadata,
        },
      };
    },
  },

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  customFields: {
    clearFileMetadataCache: clearFileMetadataCache,
  },

  presets: [
    [
      "@docusaurus/preset-classic",
      {
        docs: {
          path: "./internal-docs/docs",
          sidebarPath: "./sidebar-internal.ts",
          routeBasePath: "/",
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          //editUrl:
          //  'https://github.com/silogen/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        blog: false,
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: "img/silogen-social-card.jpg",
    docs: {
      sidebar: {
        hideable: true,
      },
    },
    navbar: {
      title: "SiloGen",
      logo: {
        alt: "SiloGen Logo",
        src: "img/logo.svg",
      },
      items: [
        {
          type: "docSidebar",
          sidebarId: "internalDocsSidebar",
          position: "left",
          label: "Internal Docs",
        },
        {
          href: "pathname:///admin",
          label: "Admin (edit internal and external documentation)",
        },
        {
          href: "https://www.silo.ai/silogen",
          label: "SiloGen",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",

      copyright: `Copyright © ${new Date().getFullYear()} SiloGen, Inc. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;

// Define an object with the functions you want to export for testing
const testExports = {
  findRepoRoot,
  getRelativeFilePath,
  getEnvironmentVariables,
  fetchCommits,
  extractAuthorFromCommit,
  getFileMetadata,
  clearFileMetadataCache,
};

// Conditionally export the test functions while keeping this file an ES module
if (process.env.NODE_ENV === "test") {
  Object.assign(module.exports, testExports);
}
