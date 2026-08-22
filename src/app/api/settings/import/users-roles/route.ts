// File: frontend/src/app/api/settings/import/users-roles/route.ts
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { roles, users } = body;

    if (!Array.isArray(roles) || !Array.isArray(users)) {
      return NextResponse.json(
        {
          message: "فرمت فایل نامعتبر است. فیلدهای roles و users باید آرایه باشند."
        },
        { status: 400 }
      );
    }

    console.log("Users and roles import received:", {
      rolesCount: roles.length,
      usersCount: users.length
    });

    return NextResponse.json(
      {
        message: `${roles.length} نقش و ${users.length} کاربر با موفقیت دریافت شد.`,
        data: {
          roles,
          users
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Users and roles import error:", error);

    return NextResponse.json(
      {
        message: "بدنه درخواست JSON معتبر نیست."
      },
      { status: 400 }
    );
  }
}
