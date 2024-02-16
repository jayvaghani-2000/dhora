import { profileType } from "@/actions/(public)/(auth)/me";

export type AuthType = {
  loading: boolean;
  authenticated: boolean;
  profile: profileType;
  redirectTo: string;
  authCheck: boolean;
};
