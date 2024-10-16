import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { authOptions, logOutUrl } from "@/utils/server/auth";
import { CustomSession } from "@/utils/server/auth";

import getLogger from "@/utils/server/logger";

const logger = getLogger();

export async function POST() {
  logger.debug("logout api route called");
  // I wonder why this is not within the try block. Maybe because you wouldn't get a call to logout unless you were already logged in?
  const session = (await getServerSession(authOptions)) as CustomSession | null;

  try {
    // We manually add idToken to the session in some cases
    const path = logOutUrl(session?.idToken);
    return NextResponse.json({ path });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// borrowed from services/chat
