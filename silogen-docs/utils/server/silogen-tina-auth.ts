import { BackendAuthProvider } from "@tinacms/datalayer";

export const CustomBackendAuth = (): BackendAuthProvider => {
  return {
    async initialize(): Promise<void> {},
    isAuthorized: async (req, res) => {
      // we check the authorization in the route handler in pages/api/tina/[...routes].ts
      return {
        isAuthorized: true,
      };
    },
  };
};
