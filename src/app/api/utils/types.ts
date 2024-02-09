import { getProfile } from "../authenticate/me";

export type profileType = Awaited<ReturnType<typeof getProfile>>;
