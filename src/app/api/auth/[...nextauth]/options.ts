import { config } from "@/config";
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
        email: { label: "Email", type: "email", placeholder: "john-doe" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const res = await axios.post(
            `${config.env.NEXT_APP_URL}/api/authenticate/signin`,
            {
              email: credentials?.email,
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
  callbacks: {
    async session({ session }) {
      if (session.user) {
        // @ts-ignore
        session.user.verified = "My name is khan";
      }
      return Promise.resolve(session);
    },
  },
};
