import { Webhook } from "svix";
import { headers } from "next/headers";
import type { WebhookEvent } from "@clerk/nextjs/server";
import { prisma } from "@/utils/prisma";

export async function POST(req: Request) {
  // Get the headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Missing svix headers", { status: 400 });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your webhook secret
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return new Response("Missing webhook secret", { status: 500 });
  }

  // Create a new Svix instance with your webhook secret
  const wh = new Webhook(webhookSecret);

  let evt: WebhookEvent;

  // Verify the webhook
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error verifying webhook", { status: 400 });
  }

  // Get the ID and type
  const { id } = evt.data;
  const eventType = evt.type;

  console.log(`Webhook with ID: ${id} and type: ${eventType}`);
  console.log("Webhook body:", body);

  // Handle the webhook
  try {
    switch (eventType) {
      //   case "user.created": {
      //     // Extract user data
      //     const { id, email_addresses, first_name, last_name } = evt.data;
      //     const emailObject = email_addresses?.[0];
      //     const email = emailObject?.email_address;

      //     if (!email) {
      //       return new Response("Missing email in user data", { status: 400 });
      //     }

      //     // Check if user already exists (to prevent duplicates)
      //     const existingUser = await prisma.user.findUnique({
      //       where: { external_id: id as string },
      //     });

      //     if (!existingUser) {
      //       // Create new user in database
      //       await prisma.user.create({
      //         data: {
      //           external_id: id as string,
      //           email,
      //         },
      //       });
      //       console.log(`User created: ${id}`);
      //     }
      //     break;
      //   }

      case "user.updated": {
        // Extract updated user data
        const { id, email_addresses, first_name, last_name } = evt.data;
        const emailObject = email_addresses?.[0];
        const email = emailObject?.email_address;

        if (!email) {
          return new Response("Missing email in user data", { status: 400 });
        }

        // Update user in database
        await prisma.user.update({
          where: { external_id: id as string },
          data: {
            email,
            first_name: (first_name as string) || null,
            last_name: (last_name as string) || null,
            updated_at: new Date(),
          },
        });
        console.log(`User updated: ${id}`);
        break;
      }

      case "user.deleted": {
        // Extract user ID
        const { id } = evt.data;

        // Delete user from database (or mark as deleted)
        await prisma.user.update({
          where: { external_id: id as string },
          data: {
            deleted_at: new Date(),
          },
        });

        console.log(`User deleted: ${id}`);
        break;
      }

      default:
        console.log(`Unhandled event type: ${eventType}`);
    }

    return new Response("Webhook processed successfully", { status: 200 });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return new Response("Error processing webhook", { status: 500 });
  }
}
