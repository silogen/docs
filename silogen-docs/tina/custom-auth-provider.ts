import { AbstractAuthProvider } from "tinacms";
import { signOut } from "next-auth/react";
import { USER_ROLES } from "../utils/app/const";

export class CustomAuthProvider extends AbstractAuthProvider {
  roles: string[];

  constructor() {
    super();
    this.roles = []; // Array to store user roles
  }
  async authenticate(props?: {}): Promise<any> {
    // No need to implement this method since keycloak will handle the authentication
  }
  async getToken() {
    // No need to implement this method since keycloak will handle the token
  }
  async getUser() {
    try {
      const response = await fetch("/api/auth/session", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch session");
      }

      const session = await response.json();
      this.roles = session.user.roles;
      return !!session.user; // Returns true(ish) if user exists in session, false otherwise
    } catch (error) {
      console.error("Error checking user session:", error);
      return false; // Return false if there's an error
    }
  }
  async logout() {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      const data = await response.json();
      if (data.path) {
        await signOut({ redirect: false });
        window.location.href = data.path;
      }
    } catch (error) {
      console.error("Error during logout:" + error);
    }
  }
  async authorize(context?: any): Promise<any> {
    console.log("User has roles: ", this.roles);
    if (!this.roles || !this.roles.includes(USER_ROLES.DOCS_EDITOR)) {
      console.warn("User does not have the required role: DOCS_EDITOR");
      return false;
    }
    return true;
  }
  //   getSessionProvider() {
  //     // GetSessionProvider can be deleted if not needed
  //     // OPTIONALLY Return a React context provider to that will wrap the admin
  //   }
}
