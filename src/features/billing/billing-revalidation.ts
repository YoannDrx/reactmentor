import { revalidatePath } from "next/cache";

export function revalidateBillingEntitlementPaths() {
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/modules");
  revalidatePath("/dashboard/mock-interviews");
  revalidatePath("/dashboard/playlists");
  revalidatePath("/dashboard/settings");
}
