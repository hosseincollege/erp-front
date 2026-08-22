// File: frontend/src/app/api/settings/import/organization/route.ts
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { company, branches, departments } = body;

    if (!company || typeof company !== "object" || !company.name) {
      return NextResponse.json(
        {
          message: "اطلاعات شرکت ناقص است. نام شرکت الزامی است."
        },
        { status: 400 }
      );
    }

    if (branches !== undefined && !Array.isArray(branches)) {
      return NextResponse.json(
        {
          message: "فیلد branches باید آرایه باشد."
        },
        { status: 400 }
      );
    }

    if (departments !== undefined && !Array.isArray(departments)) {
      return NextResponse.json(
        {
          message: "فیلد departments باید آرایه باشد."
        },
        { status: 400 }
      );
    }

    console.log("Organization import received:", {
      company,
      branchesCount: branches?.length ?? 0,
      departmentsCount: departments?.length ?? 0
    });

    return NextResponse.json(
      {
        message: `ساختار سازمان شامل ${branches?.length ?? 0} شعبه و ${departments?.length ?? 0} دپارتمان با موفقیت دریافت شد.`,
        data: {
          company,
          branches: branches ?? [],
          departments: departments ?? []
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Organization import error:", error);

    return NextResponse.json(
      {
        message: "بدنه درخواست JSON معتبر نیست."
      },
      { status: 400 }
    );
  }
}
