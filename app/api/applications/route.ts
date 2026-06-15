import { NextRequest, NextResponse } from "next/server";
import { addApplication, readApplications } from "@/lib/db";
import { REGISTRATION_FEE_NGN, dasomReference, getSelarCheckoutUrl } from "@/lib/payment";
import { databaseErrorResponse } from "@/lib/api-errors";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const required = [
      "email",
      "surname",
      "firstName",
      "dateOfBirth",
      "nationality",
      "gender",
      "state",
      "city",
      "homeAddress",
      "profession",
      "mobileNumber",
      "modeOfEnrollment",
    ];
    for (const field of required) {
      if (!body[field]) {
        return NextResponse.json({ error: `Missing field: ${field}` }, { status: 400 });
      }
    }
    const app = await addApplication(body);
    return NextResponse.json({
      success: true,
      id: app.id,
      reference: dasomReference(app.id),
      checkoutUrl: getSelarCheckoutUrl({
        id: app.id,
        email: body.email,
        firstName: body.firstName,
        surname: body.surname,
      }),
      paymentAmount: REGISTRATION_FEE_NGN,
    }, { status: 201 });
  } catch (err) {
    console.error(err);
    const dbError = databaseErrorResponse(err);
    if (dbError) return dbError;
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const apps = await readApplications();
    return NextResponse.json(apps);
  } catch (err) {
    console.error(err);
    const dbError = databaseErrorResponse(err);
    if (dbError) return dbError;
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
