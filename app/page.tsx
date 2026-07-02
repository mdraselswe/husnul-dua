import { prisma } from "@/lib/prisma-client";
import HomeClient from "@/components/HomeClient";
import type { Dua } from "@/lib/types";

// Data changes as admins approve/add duas, so render fresh each request.
export const dynamic = "force-dynamic";

export default async function Home() {
  let duas: Dua[] = [];
  try {
    const rows = await prisma.dua.findMany({
      where: { status: "approved" },
      orderBy: { createdAt: "desc" },
    });
    duas = JSON.parse(JSON.stringify(rows));
  } catch (e) {
    console.error("Home fetch failed:", e);
  }
  return <HomeClient initial={duas} />;
}
