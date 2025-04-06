"use server";

import { prisma } from "@/utils/prisma";

export async function syncUserToDatabase(
  userId: string,
  email: string,
  firstName?: string,
  lastName?: string
) {
  try {
    // Check if user already exists in the database
    const existingUser = await prisma.user.findUnique({
      where: {
        external_id: userId,
      },
    });

    if (!existingUser) {
      // Insert the new user into your database
      await prisma.user.create({
        data: {
          external_id: userId,
          email,
        },
      });
    }

    return { success: true };
  } catch (error) {
    console.error("Error syncing user to database:", error);
    return { success: false, error };
  }
}
