import { prisma } from "@/utils/prisma";
import { currentUser } from "@clerk/nextjs/server";

export async function getLocalUserId(): Promise<
  | {
      unauthorized: true;
      id: null;
    }
  | {
      unauthorized: false;
      id: string;
    }
> {
  const user = await currentUser();
  if (!user) {
    return {
      unauthorized: true,
      id: null,
    };
  }
  const localUser = await prisma.user.findUnique({
    where: { external_id: user.id },
  });
  if (!localUser) {
    return {
      unauthorized: true,
      id: null,
    };
  }
  return {
    unauthorized: false,
    id: localUser.id,
  };
}
