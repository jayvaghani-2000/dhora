export type profileType = {
  userName: string;
};

export type AuthType = {
  loading: boolean;
  authenticated: boolean;
  token: string;
  profile: profileType;
  redirectTo: string;
  authCheck: boolean;
};
