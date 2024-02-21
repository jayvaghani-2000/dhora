import { profileType } from "@/actions/_utils/types.type";

export type AuthType = {
  loading: boolean;
  authenticated: boolean;
  profile: profileType;
  redirectTo: string;
  authCheck: boolean;
};
