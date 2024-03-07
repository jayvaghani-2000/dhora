"use server";

import { validateBusinessToken } from "@/actions/_utils/validateToken";
import { User } from "lucia";
import { errorHandler } from "@/actions/_utils/errorHandler";
import { config } from "@/config";
import axios from "axios";
import { revalidatePath } from "next/cache";

const handler = async (user: User, submissionId: string) => {
  const options = {
    method: "DELETE",
    url: `https://api.docuseal.co/submissions/${submissionId}`,
    headers: { "X-Auth-Token": config.env.DOCU_SEAL },
  };

  try {
    await axios.request(options);
    revalidatePath("/business/contracts");
    return { success: true, data: "Submission deleted successfully." };
  } catch (err) {
    return errorHandler(err);
  }
};

export const deleteSubmittedContracts: (
  id: string
) => Promise<Awaited<ReturnType<typeof handler>>> =
  validateBusinessToken(handler);
