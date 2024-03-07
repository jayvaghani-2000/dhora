import Stripe from "stripe";
import { config } from "@/config";

export const stripe = new Stripe(
  "sk_test_51NSNgPCbtf4F2Iro2Fk13lWGgGqTzy4lFaG5wZR4prB5y95nKaHr5itUUrM0KwDNhkJ18rgJQw17j8blsT7CFa5d00njvahUqb",
  {
    apiVersion: "2023-10-16",
  }
);
