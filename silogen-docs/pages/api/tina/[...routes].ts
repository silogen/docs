import { TinaNodeBackend, LocalBackendAuthProvider } from "@tinacms/datalayer";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import databaseClient from "@/tina/__generated__/databaseClient";
import { setCurrentUserId } from "@/tina/database";
import { authOptions } from "@/utils/server/auth";
import { CustomBackendAuth } from "@/utils/server/silogen-tina-auth";
import getLogger from "@/utils/server/logger";

const logger = getLogger();

const isLocal = process.env.TINA_PUBLIC_IS_LOCAL === "true";

const handler = TinaNodeBackend({
  authProvider: isLocal ? LocalBackendAuthProvider() : CustomBackendAuth(),
  databaseClient,
});

const tinaHandler = async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> => {
  const session = await getServerSession(req, res, authOptions);
  logger.debug("Session retrieved", session);

  if (!session) {
    logger.warn("Unauthorized access attempt");
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  // Check if user has the required role
  // We could do this in the utils/server/auth.ts or using authenticateRoute from services/chat/utils/app/route.ts
  // This is not necessary as long as we use the middleware and the path based access control
  // if (!session.user?.roles?.includes(USER_ROLES.DOCS_EDITOR)) {
  //   logger.warn("User does not have the required role: DOCS_EDITOR");
  //   res
  //     .status(403)
  //     .json({
  //       message:
  //         "Forbidden: Insufficient permissions. You need the docs_editor role.",
  //     });
  //   return;
  // }

  // Set the user ID from the session so we can add it to the commit messages later
  const userId = session.user?.email || "unknown";
  setCurrentUserId(userId); // Update the global user ID
  logger.debug("Request received from user", { userId });

  return handler(req, res);
};

export default tinaHandler;
