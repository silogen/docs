import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { POST } from "@/app/api/auth/logout/route";
import { authOptions, logOutUrl } from "@/utils/server/auth";

// Mock dependencies
vi.mock("next-auth");
vi.mock("@/utils/server/auth");

describe("POST /api/auth/logout", () => {
  const mockSession = { idToken: "mock-id-token" };

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should return the logout path when session exists", async () => {
    const mockLogoutPath = "/mock-logout-path";

    vi.mocked(getServerSession).mockResolvedValue(mockSession);
    vi.mocked(logOutUrl).mockReturnValue(mockLogoutPath);

    const response = await POST();

    expect(getServerSession).toHaveBeenCalledWith(authOptions);
    expect(logOutUrl).toHaveBeenCalledWith(mockSession.idToken);
    expect(response).toBeInstanceOf(NextResponse);
    expect(await response.json()).toEqual({ path: mockLogoutPath });
  });

  it("should return the logout path when session does not exist", async () => {
    const mockLogoutPath = "/mock-logout-path";

    vi.mocked(getServerSession).mockResolvedValue(null);
    vi.mocked(logOutUrl).mockReturnValue(mockLogoutPath);

    const response = await POST();

    expect(getServerSession).toHaveBeenCalledWith(authOptions);
    expect(logOutUrl).toHaveBeenCalledWith(undefined);
    expect(response).toBeInstanceOf(NextResponse);
    expect(await response.json()).toEqual({ path: mockLogoutPath });
  });

  it("should return an error response when an exception occurs", async () => {
    vi.mocked(getServerSession).mockResolvedValue(mockSession);
    vi.mocked(logOutUrl).mockImplementation(() => {
      throw new Error("Logout URL generation failed");
    });

    const response = await POST();

    expect(getServerSession).toHaveBeenCalledWith(authOptions);
    expect(response).toBeInstanceOf(NextResponse);
    expect(await response.json()).toEqual({
      error: "Logout URL generation failed",
    });
    expect(response.status).toBe(500);
  });
});
