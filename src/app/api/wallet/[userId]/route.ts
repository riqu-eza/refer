/* eslint-disable @typescript-eslint/no-explicit-any */
import { connectDB } from "@/src/lib/db";
import Wallet from "@/src/models/Wallet";

interface WalletParams {
  userId: string;
}

interface WalletDocument {
  _id?: any;
  userId: string;
  balance?: number;
  [key: string]: any;
}

interface ErrorResponse {
  message: string;
}

export async function GET(
  req: Request,
  context: { params: Promise<WalletParams> } // <--- params is now a Promise
): Promise<Response> {
  await connectDB();

  try {
    const { userId } = await context.params; // <--- await here
    const wallet = (await Wallet.findOne({ userId })) as WalletDocument | null;

    if (!wallet) {
      return new Response(
        JSON.stringify({ message: "Wallet not found" } as ErrorResponse),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(JSON.stringify(wallet), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching wallet:", error);
    return new Response(
      JSON.stringify({ message: "Server error" } as ErrorResponse),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
