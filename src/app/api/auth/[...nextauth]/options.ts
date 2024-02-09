import axios, { AxiosError } from "axios";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const options: NextAuthOptions = {
  pages: {
    signIn: "/login",
    signOut: "/auth/signout",
    error: "/auth/error",
    verifyRequest: "/auth/verify-request",
    newUser: "/register",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", placeholder: "john-doe" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const res = await axios.post(
            `${process.env.NEXTAUTH_URL}/api/authenticate/signin`,
            {
              username: credentials?.username,
              password: credentials?.password,
            }
          );
          if (res.data.data) {
            return res.data.data;
          }
        } catch (err) {
          if (err instanceof AxiosError) {
            throw new Error(err.response?.data.error);
          }
          throw new Error("Something went wrong!");
        }
      },
    }),
  ],
};
