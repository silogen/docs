import NextAuth from "next-auth";

import { authOptions } from "@/utils/server/auth";
import getLogger from "@/utils/server/logger";

const logger = getLogger();

// todo: check these in a different way so we don't have to set them during building the docker image
if (!process.env.NEXTAUTH_SECRET) throw new Error("NEXTAUTH_SECRET is not set");
if (!process.env.KEYCLOAK_ID) throw new Error("KEYCLOAK_ID is not set");
if (!process.env.KEYCLOAK_SECRET) throw new Error("KEYCLOAK_SECRET is not set");
if (!process.env.KEYCLOAK_ISSUER) throw new Error("KEYCLOAK_ISSUER is not set");

let nextAuthSecret = process.env.NEXTAUTH_SECRET;
let keycloakId = process.env.KEYCLOAK_ID;
let keycloakSecret = process.env.KEYCLOAK_SECRET;
let keycloakIssuer = process.env.KEYCLOAK_ISSUER;

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

// borrowed from services/chat
