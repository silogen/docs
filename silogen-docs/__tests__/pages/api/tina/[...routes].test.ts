import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextApiRequest, NextApiResponse } from "next";

// Mock dependencies
vi.mock("next-auth/next", () => ({
  getServerSession: vi.fn(),
}));

vi.mock("@/tina/database", () => ({
  setCurrentUserId: vi.fn(),
}));

vi.mock("@/utils/server/auth", () => ({
  authOptions: {},
}));

// Mock console.log
vi.mock("console", () => ({
  log: vi.fn(),
}));

describe("tinaHandler", () => {
  let mockReq: Partial<NextApiRequest>;
  let mockRes: Partial<NextApiResponse>;
  let mockTinaHandler: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    // Clear module cache to ensure fresh imports
    vi.resetModules();
    // Clear all mocks before each test
    vi.resetAllMocks();
    mockReq = {};
    mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
      write: vi.fn(),
      end: vi.fn(),
    };
    mockTinaHandler = vi.fn();

    // Re-mock TinaNodeBackend for each test
    vi.doMock("@tinacms/datalayer", () => ({
      TinaNodeBackend: vi.fn(() => mockTinaHandler),
      LocalBackendAuthProvider: vi.fn(),
    }));
  });

  it('should use "unknown" as user ID if email is not present in session', async () => {
    const tinaHandler = (await import("@/pages/api/tina/[...routes]")).default;
    const { getServerSession } = await import("next-auth/next");
    const { setCurrentUserId } = await import("@/tina/database");

    (getServerSession as any).mockResolvedValue({
      user: {},
    });

    await tinaHandler(mockReq as NextApiRequest, mockRes as NextApiResponse);

    expect(getServerSession).toHaveBeenCalledWith(
      mockReq,
      mockRes,
      expect.anything(),
    );
    expect(setCurrentUserId).toHaveBeenCalledWith("unknown");
    expect(mockTinaHandler).toHaveBeenCalledWith(mockReq, mockRes);
  });

  it("should set user ID and call TinaNodeBackend handler if session is valid", async () => {
    const tinaHandler = (await import("@/pages/api/tina/[...routes]")).default;
    const { getServerSession } = await import("next-auth/next");
    const { setCurrentUserId } = await import("@/tina/database");

    (getServerSession as any).mockResolvedValue({
      user: { email: "test@example.com" },
    });

    await tinaHandler(mockReq as NextApiRequest, mockRes as NextApiResponse);

    expect(getServerSession).toHaveBeenCalledWith(
      mockReq,
      mockRes,
      expect.anything(),
    );
    expect(setCurrentUserId).toHaveBeenCalledWith("test@example.com");
    expect(mockTinaHandler).toHaveBeenCalledWith(mockReq, mockRes);
  });

  it("should return 401 if no session is found", async () => {
    const { getServerSession } = await import("next-auth/next");
    (getServerSession as any).mockResolvedValue(null);
    const tinaHandler = (await import("@/pages/api/tina/[...routes]")).default;

    await tinaHandler(mockReq as NextApiRequest, mockRes as NextApiResponse);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ message: "Unauthorized" });
  });
});
