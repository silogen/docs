import { NextRequestWithAuth, withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

import { USER_ROLES } from "./utils/app/const";

import jsonwebtoken from "jsonwebtoken";

export const authorize = (req: NextRequestWithAuth) => {
  const path = req.nextUrl.pathname;
  const token = req.nextauth.token;

  if (!token) {
    throw new Error("Token must be defined");
  }

  const decoded = jsonwebtoken.decode(token.accessToken as string);
  if (typeof decoded !== "object" || decoded === null) {
    console.error(
      "Decoded token must be an object (is " + typeof decoded + ")",
    );
    const redirectUrl = new URL("/api/auth/signin?csrf=true", req.url);
    console.log(NextResponse.redirect(redirectUrl));
    return NextResponse.redirect(redirectUrl);
  }

  const roles = decoded?.realm_access?.roles || [];
  let isAuthorized = true;

  Object.keys(pathBasedRoleRequirements).forEach((key) => {
    if (path.startsWith(key)) {
      const allowedRoles = pathBasedRoleRequirements[key];
      isAuthorized = allowedRoles.some((role) => roles.includes(role));
    }
  });

  if (!isAuthorized) {
    const redirectUrl = new URL("/api/auth/error?error=AccessDenied", req.url);
    console.log(NextResponse.redirect(redirectUrl));
    return NextResponse.redirect(redirectUrl);
  }
};

export default withAuth(authorize);

/**
 * URLs with the roles required to access them.
 * Any URL not listed here is accessible by any authenticated user.
 * The user must have at least one of the roles listed for the URL.
 */
const pathBasedRoleRequirements: { [key: string]: string[] } = {
  "/admin": [USER_ROLES.DOCS_EDITOR],
};

// borrowed from services/chat
