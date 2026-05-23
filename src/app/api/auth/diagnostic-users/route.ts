import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashPassword } from "@/lib/crypto";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const reset = url.searchParams.get("reset");

    if (reset === "true") {
      // Force recreate/update Zadid
      const adminPassword = hashPassword("Zadu00789");
      
      // Delete existing Zadid if exists to prevent duplicates
      await db.user.deleteMany({
        where: { username: "Zadid" }
      });

      const user = await db.user.create({
        data: {
          username: "Zadid",
          name: "Zadid",
          passwordHash: adminPassword,
          role: "ADMIN",
          permissions: "all",
        }
      });

      return NextResponse.json({ 
        message: "Admin user Zadid has been successfully force-recreated!",
        user: {
          id: user.id,
          username: user.username,
          role: user.role
        }
      });
    }

    const users = await db.user.findMany({
      select: {
        id: true,
        username: true,
        role: true,
        createdAt: true
      }
    });

    return NextResponse.json({ users });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
