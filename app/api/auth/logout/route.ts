import { NextResponse } from "next/server";

import { destroyLoginSession } from "@/app/lib/auth";

export async function POST() {
  try {
    await destroyLoginSession();

    return NextResponse.json({
      success: true,
      message: "Logged out successfully.",
    });
  } catch (error) {
    console.error("LOGOUT_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to log out.",
      },
      { status: 500 },
    );
  }
}