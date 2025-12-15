import { connectDB } from "@/src/lib/db";
import { buyExtraSpin } from "@/src/services/spinPurchaseService";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  await connectDB();

  const userId = req.headers.get("x-user-id");
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await buyExtraSpin(userId);
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: message },
      { status: 400 }
    );
  }
}
