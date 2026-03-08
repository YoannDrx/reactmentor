import { getAdminContentExportPayload } from "@/features/admin/admin-content-export";
import { getUser } from "@/lib/auth/auth-user";
import { isContentAdminUser } from "@/lib/auth/content-admin";

export async function GET() {
  const user = await getUser();

  if (!user) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }

  if (!isContentAdminUser(user)) {
    return new Response("Forbidden", {
      status: 403,
    });
  }

  const payload = await getAdminContentExportPayload();
  const dateStamp = new Date().toISOString().slice(0, 10);

  return new Response(JSON.stringify(payload, null, 2), {
    status: 200,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "content-disposition": `attachment; filename="react-mentor-content-${dateStamp}.json"`,
      "cache-control": "no-store",
    },
  });
}
