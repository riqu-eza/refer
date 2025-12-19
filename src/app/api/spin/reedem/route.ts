import { connectDB } from "@/src/lib/db";
import { convertPointsToFiat } from "@/src/services/convertService";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
await connectDB();

    const userId = req.headers.get("x-user-id");
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
 try {
    const { points } = await req.json();
    await convertPointsToFiat(userId, points);
 } catch (error) {
    console.error("Error converting points:", error);
    return NextResponse.json({ error: "Failed to convert points" }, { status: 500 });
 }

}