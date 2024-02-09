import { profileType } from "@/app/api/utils/types";

export type AuthType = {
  loading: boolean;
  authenticated: boolean;
  token: string;
  profile: profileType;
  redirectTo: string;
  authCheck: boolean;
};
