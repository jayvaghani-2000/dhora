import { config } from "@/config";
import Stripe from "stripe";

export const stripeInstance = new Stripe(config.env.STRIPE_SECRET_KEY);
