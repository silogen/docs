// tell typescript that these functions exist in the module despite us not exporting them
// one could argue that testing internal function is not good but...
declare module "../docusaurus.config.internal" {
  export function findRepoRoot(startPath: string): string | null;
  export function getEnvironmentVariables(): {
    token: string;
    owner: string;
    repo: string;
  } | null;
  export function extractAuthorFromCommit(commit: any): string;
  export function fetchCommits(
    octokit: octokitModule.Octokit,
    owner: string,
    repo: string,
    path: string,
  );
  export function getRelativeFilePath(
    filePath: string,
    findFunction,
  ): string | null;
  export function getFileMetadata(
    filePath: string,
    getRelativeFilePathFunction,
  ): Promise<{ authors: { name: string }[]; lastEdited: string } | []>;
}
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import path from "path";
import fs from "fs";
import * as octokitModule from "@octokit/rest";
import * as internalModule from "../docusaurus.config.internal";

vi.mock("@octokit/rest");
vi.mock("fs");
vi.mock("path", async (importOriginal) => {
  const actual = (await importOriginal()) as object;
  return {
    ...actual,
    dirname: vi.fn(),
    join: vi.fn(),
    parse: vi.fn(),
    relative: vi.fn(),
  };
});

describe("Author utilities", () => {
  describe("findRepoRoot", () => {
    it("should return the repository root when found", async () => {
      const mockPath = "/path/to/repo/.git";
      vi.spyOn(path, "parse").mockReturnValue({ root: "/" } as path.ParsedPath);
      vi.spyOn(fs, "existsSync").mockImplementation((p) => p === mockPath);

      expect(internalModule.findRepoRoot("/path/to/repo/some/file.ts")).toBe(
        "/path/to/repo",
      );
    });

    it("should return cwd when repository root is not found", async () => {
      vi.spyOn(path, "parse").mockReturnValue({ root: "/" } as path.ParsedPath);
      vi.spyOn(fs, "existsSync").mockReturnValue(false);
      vi.spyOn(process, "cwd").mockReturnValue(
        "/mocked/current/working/directory",
      );

      expect(internalModule.findRepoRoot("/path/to/file.ts")).toBe(
        "/mocked/current/working/directory",
      );
    });
  });

  describe("getRelativeFilePath", () => {
    it("should return the relative file path when repo root is found", async () => {
      const mockFindRepoRoot = vi.fn().mockReturnValue("/path/to/repo/some");

      vi.spyOn(path, "dirname").mockReturnValue("/path/to/repo/some");
      vi.spyOn(path, "parse").mockReturnValue({ root: "/" } as path.ParsedPath);
      vi.spyOn(path, "relative").mockReturnValue("some/file.ts");

      const result = internalModule.getRelativeFilePath(
        "/path/to/repo/some/file.ts",
        mockFindRepoRoot,
      );
      expect(mockFindRepoRoot).toHaveBeenCalled();
      expect(result).toBe("some/file.ts");
    });
  });

  describe("getEnvironmentVariables", () => {
    const originalEnv = process.env;

    beforeEach(() => {
      process.env = { ...originalEnv };
    });

    afterAll(() => {
      process.env = originalEnv;
    });

    it("should return environment variables when all are set", async () => {
      process.env.GITHUB_ACCESS_TOKEN = "token";
      process.env.GITHUB_OWNER = "owner";
      process.env.GITHUB_REPO = "repo";

      expect(internalModule.getEnvironmentVariables()).toEqual({
        token: "token",
        owner: "owner",
        repo: "repo",
      });
    });

    it("should return null when any environment variable is missing", async () => {
      process.env.GITHUB_ACCESS_TOKEN = "token";
      process.env.GITHUB_OWNER = "owner";
      delete process.env.GITHUB_REPO; // Ensure GITHUB_REPO is not set

      expect(internalModule.getEnvironmentVariables()).toBeNull();
    });
  });

  describe("extractAuthorFromCommit", () => {
    it("should extract author from commit message", () => {
      const commit = {
        commit: {
          message: "John Doe: Update content",
          author: { name: "John Doe" },
        },
      };

      expect(internalModule.extractAuthorFromCommit(commit)).toBe("John Doe");
    });

    it("should use author name when commit message doesn't match pattern", () => {
      const commit = {
        commit: {
          message: "Regular commit message",
          author: { name: "Jane Doe" },
        },
      };

      expect(internalModule.extractAuthorFromCommit(commit)).toBe("Jane Doe");
    });

    it('should use "Unknown" when no author information is available', () => {
      const commit = {
        commit: {
          message: "Regular commit message",
        },
      };

      expect(internalModule.extractAuthorFromCommit(commit)).toBe("Unknown");
    });
  });
});

describe("fetchCommits", () => {
  it("should fetch commits successfully", async () => {
    const mockOctokit = {
      repos: {
        listCommits: vi.fn().mockResolvedValue({
          data: [{ sha: "123", commit: { message: "Test commit" } }],
        }),
      },
    };

    const result = await internalModule.fetchCommits(
      mockOctokit as unknown as octokitModule.Octokit,
      "owner",
      "repo",
      "path",
    );

    expect(mockOctokit.repos.listCommits).toHaveBeenCalledWith({
      owner: "owner",
      page: 1,
      repo: "repo",
      path: "path",
      per_page: 100,
    });
    expect(result).toHaveLength(1);
    expect(result[0].sha).toBe("123");
  });

  it("should handle errors when fetching commits", async () => {
    const mockOctokit = {
      repos: {
        listCommits: vi.fn().mockRejectedValue(new Error("API error")),
      },
    };

    await expect(
      internalModule.fetchCommits(
        mockOctokit as unknown as octokitModule.Octokit,
        "owner",
        "repo",
        "path",
      ),
    ).rejects.toThrow("API error");
  });
});

describe("getFileMetadata", () => {
  beforeEach(() => {
    process.env.GITHUB_ACCESS_TOKEN = "token";
    process.env.GITHUB_OWNER = "owner";
    process.env.GITHUB_REPO = "repo";

    // Clear the cache before each test
    // @ts-ignore: Accessing private cache
    internalModule.clearFileMetadataCache();
  });

  it("should return metadata for a valid file path", async () => {
    const mockGetRelativeFilePath = vi.fn().mockReturnValue("some/file.ts");

    const mockListCommits = vi.fn().mockResolvedValue({
      data: [
        {
          commit: {
            message: "docs-editor: Update content",
            author: { name: "John Doe" },
            committer: { date: "2021-01-02T00:00:00Z" },
          },
        },
        {
          commit: {
            message: "Regular commit",
            author: { name: "Jane Doe" },
            committer: { date: "2021-01-01T00:00:00Z" },
          },
        },
      ],
    });

    vi.mocked(octokitModule.Octokit).mockImplementation(() => {
      return {
        repos: {
          listCommits: mockListCommits,
        },
      } as any;
    });

    const result = await internalModule.getFileMetadata(
      "/path/to/repo/some/file.ts",
      mockGetRelativeFilePath,
    );

    expect(mockListCommits).toHaveBeenCalledWith({
      owner: "owner",
      page: 1,
      repo: "repo",
      path: "some/file.ts",
      per_page: 100,
    });
    expect(result).toEqual({
      authors: [{ name: "docs-editor" }, { name: "Jane Doe" }],
      lastEdited: "2021-01-02T00:00:00Z",
    });
  });

  it("should return empty lastEdited when there are no commits", async () => {
    const mockGetRelativeFilePath = vi.fn().mockReturnValue("some/file.ts");

    // process.env.GITHUB_ACCESS_TOKEN = "token";
    // process.env.GITHUB_OWNER = "owner";
    // process.env.GITHUB_REPO = "repo";

    const mockListCommits = vi.fn().mockResolvedValue({
      data: [], // Empty array to simulate no commits
    });

    vi.mocked(octokitModule.Octokit).mockImplementation(() => {
      return {
        repos: {
          listCommits: mockListCommits,
        },
      } as any;
    });

    const result = await internalModule.getFileMetadata(
      "/path/to/repo/some/file.ts",
      mockGetRelativeFilePath,
    );

    expect(mockListCommits).toHaveBeenCalledWith({
      owner: "owner",
      page: 1,
      repo: "repo",
      path: "some/file.ts",
      per_page: 100,
    });
    expect(result).toEqual({
      authors: [],
      lastEdited: "Unknown",
    });
  });

  it("should return cached result if available", async () => {
    const mockGetRelativeFilePath = vi.fn().mockReturnValue("some/file.ts");
    const filePath = "/path/to/repo/some/file.ts";

    // First, call getFileMetadata to populate the cache
    const mockListCommits = vi.fn().mockResolvedValue({
      data: [
        {
          commit: {
            message: "Cached Author: Initial commit",
            author: { name: "Cached Author" },
            committer: { date: "2021-01-03T00:00:00Z" },
          },
        },
      ],
    });

    vi.mocked(octokitModule.Octokit).mockImplementation(
      () =>
        ({
          repos: {
            listCommits: mockListCommits,
          },
        }) as any,
    );

    // This call should populate the cache
    await internalModule.getFileMetadata(filePath, mockGetRelativeFilePath);

    // Clear the mock to ensure it's not called again
    vi.clearAllMocks();

    const result = await internalModule.getFileMetadata(
      "/path/to/repo/some/file.ts",
      mockGetRelativeFilePath,
    );

    expect(result).toEqual({
      authors: [{ name: "Cached Author" }],
      lastEdited: "2021-01-03T00:00:00Z",
    });

    // Ensure Octokit was not called
    expect(octokitModule.Octokit).not.toHaveBeenCalled();
  });

  it("should handle invalid file paths", async () => {
    const mockGetRelativeFilePath = vi.fn().mockReturnValue(null);

    const result = await internalModule.getFileMetadata(
      "/invalid/path",
      mockGetRelativeFilePath,
    );

    expect(result).toEqual([]);
  });

  it("should handle missing environment variables", async () => {
    delete process.env.GITHUB_ACCESS_TOKEN;

    const mockGetRelativeFilePath = vi.fn().mockReturnValue("some/file.ts");

    const result = await internalModule.getFileMetadata(
      "/path/to/repo/some/file.ts",
      mockGetRelativeFilePath,
    );

    expect(result).toEqual([]);
  });

  it("should extract author from commit message correctly", async () => {
    const mockGetRelativeFilePath = vi.fn().mockReturnValue("some/file.ts");

    const mockListCommits = vi.fn().mockResolvedValue({
      data: [
        {
          commit: {
            message: "John: Update content",
            author: { name: "John Doe" },
            committer: { date: "2021-01-02T00:00:00Z" },
          },
        },
        {
          commit: {
            message: "Jane: Delete content",
            author: { name: "Jane Doe" },
            committer: { date: "2021-01-01T00:00:00Z" },
          },
        },
        {
          commit: {
            message: "Regular commit",
            author: { name: "Bob Smith" },
            committer: { date: "2021-01-01T00:00:00Z" },
          },
        },
      ],
    });

    vi.mocked(octokitModule.Octokit).mockImplementation(
      () =>
        ({
          repos: {
            listCommits: mockListCommits,
          },
        }) as any,
    );

    const result = await internalModule.getFileMetadata(
      "/path/to/repo/some/file.ts",
      mockGetRelativeFilePath,
    );

    expect(result).toEqual({
      authors: [{ name: "John" }, { name: "Jane" }, { name: "Bob Smith" }],
      lastEdited: "2021-01-02T00:00:00Z",
    });
  });

  it("should handle API errors gracefully", async () => {
    const mockGetRelativeFilePath = vi.fn().mockReturnValue("some/file.ts");

    const mockListCommits = vi.fn().mockRejectedValue(new Error("API Error"));

    vi.mocked(octokitModule.Octokit).mockImplementation(
      () =>
        ({
          repos: {
            listCommits: mockListCommits,
          },
        }) as any,
    );

    const result = await internalModule.getFileMetadata(
      "/path/to/repo/some/file.ts",
      mockGetRelativeFilePath,
    );

    expect(result).toEqual({ authors: [], lastEdited: "Unknown" });
  });

  it("should handle rate limiting", async () => {
    const mockGetRelativeFilePath = vi.fn().mockReturnValue("some/file.ts");

    const mockListCommits = vi.fn().mockRejectedValue({
      status: 403,
      message: "API rate limit exceeded",
    });

    vi.mocked(octokitModule.Octokit).mockImplementation(
      () =>
        ({
          repos: {
            listCommits: mockListCommits,
          },
        }) as any,
    );

    const result = await internalModule.getFileMetadata(
      "/path/to/repo/some/file.ts",
      mockGetRelativeFilePath,
    );

    expect(result).toEqual({ authors: [], lastEdited: "Unknown" });
    // You might want to check for a specific error log here
  });

  it("should handle up to 100 commits", async () => {
    const mockGetRelativeFilePath = vi.fn().mockReturnValue("some/file.ts");

    const mockListCommits = vi
      .fn()
      .mockResolvedValueOnce({
        data: Array(100).fill({
          commit: {
            message: "Commit on first page",
            author: { name: "First Author" },
            committer: { date: "2021-01-01T00:00:00Z" },
          },
        }),
      })
      .mockResolvedValueOnce({
        data: [], // Second page is empty
      });

    vi.mocked(octokitModule.Octokit).mockImplementation(
      () =>
        ({
          repos: {
            listCommits: mockListCommits,
          },
        }) as any,
    );

    const result = await internalModule.getFileMetadata(
      "/path/to/repo/some/file.ts",
      mockGetRelativeFilePath,
    );

    expect(mockListCommits).toHaveBeenCalledTimes(2);

    expect(mockListCommits).toHaveBeenCalledWith({
      owner: "owner",
      repo: "repo",
      path: "some/file.ts",
      per_page: 100,
      page: 1,
    });

    expect(result).toEqual({
      authors: [{ name: "First Author" }],
      lastEdited: "2021-01-01T00:00:00Z",
    });
  });

  it("should handle multiple pages of commits", async () => {
    console.log("Starting multiple pages of commits test");

    const mockGetRelativeFilePath = vi.fn().mockReturnValue("some/file.ts");
    console.log("Mocked getRelativeFilePath");

    const mockListCommits = vi
      .fn()
      .mockResolvedValueOnce({
        data: Array(100).fill({
          commit: {
            message: "Commit on first page",
            author: { name: "First Author" },
            committer: { date: "2021-01-02T00:00:00Z" },
          },
        }),
      })
      .mockResolvedValueOnce({
        data: [
          {
            commit: {
              message: "Commit on second page",
              author: { name: "Second Author" },
              committer: { date: "2021-01-01T00:00:00Z" },
            },
          },
        ],
      });
    console.log("Mocked listCommits function");

    vi.mocked(octokitModule.Octokit).mockImplementation(
      () =>
        ({
          repos: {
            listCommits: mockListCommits,
          },
        }) as any,
    );
    console.log("Mocked Octokit implementation");

    // Mock environment variables
    process.env.GITHUB_ACCESS_TOKEN = "mock_token";
    process.env.GITHUB_OWNER = "owner";
    process.env.GITHUB_REPO = "repo";
    console.log("Set mock environment variables");

    console.log("Calling getFileMetadata");
    const result = await internalModule.getFileMetadata(
      "/path/to/repo/some/file.ts",
      mockGetRelativeFilePath,
    );
    console.log("getFileMetadata returned:", result);

    console.log("Checking mockListCommits call count");
    expect(mockListCommits).toHaveBeenCalledTimes(2);
    console.log("mockListCommits call count check passed");

    console.log("Checking first mockListCommits call");
    expect(mockListCommits).toHaveBeenNthCalledWith(1, {
      owner: "owner",
      repo: "repo",
      path: "some/file.ts",
      per_page: 100,
      page: 1,
    });
    console.log("First mockListCommits call check passed");

    console.log("Checking second mockListCommits call");
    expect(mockListCommits).toHaveBeenNthCalledWith(2, {
      owner: "owner",
      repo: "repo",
      path: "some/file.ts",
      per_page: 100,
      page: 2,
    });
    console.log("Second mockListCommits call check passed");

    console.log("Checking final result");
    expect(result).toEqual({
      authors: [{ name: "First Author" }, { name: "Second Author" }],
      lastEdited: "2021-01-02T00:00:00Z",
    });
    console.log("Final result check passed");

    console.log("Test completed successfully");
  });

  it("should handle errors in getRelativeFilePath", async () => {
    const mockGetRelativeFilePath = vi.fn().mockImplementation(() => {
      throw new Error("Path error");
    });

    const result = await internalModule.getFileMetadata(
      "/path/to/repo/some/file.ts",
      mockGetRelativeFilePath,
    );

    expect(result).toEqual({ authors: [], lastEdited: "Unknown" });
  });

  it("should handle network errors when fetching commits", async () => {
    const mockGetRelativeFilePath = vi.fn().mockReturnValue("some/file.ts");
    const mockListCommits = vi
      .fn()
      .mockRejectedValue(new Error("Network error"));

    vi.mocked(octokitModule.Octokit).mockImplementation(
      () =>
        ({
          repos: {
            listCommits: mockListCommits,
          },
        }) as any,
    );

    const result = await internalModule.getFileMetadata(
      "/path/to/repo/some/file.ts",
      mockGetRelativeFilePath,
    );

    expect(result).toEqual({ authors: [], lastEdited: "Unknown" });
  });

  it("should handle unexpected response format", async () => {
    const mockGetRelativeFilePath = vi.fn().mockReturnValue("some/file.ts");
    const mockListCommits = vi.fn().mockResolvedValue({
      data: [{ unexpected: "format" }],
    });

    vi.mocked(octokitModule.Octokit).mockImplementation(
      () =>
        ({
          repos: {
            listCommits: mockListCommits,
          },
        }) as any,
    );

    const result = await internalModule.getFileMetadata(
      "/path/to/repo/some/file.ts",
      mockGetRelativeFilePath,
    );

    expect(result).toEqual({
      authors: [],
      lastEdited: "Unknown",
    });
  });
});
