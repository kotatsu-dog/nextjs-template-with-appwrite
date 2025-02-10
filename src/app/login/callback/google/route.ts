import { createAdminClient, getCredentials } from "@/lib/appwrite/server";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const { sessionName, siteHomeUrl } = await getCredentials();

    const userId = req.nextUrl.searchParams.get("userId");
    const secret = req.nextUrl.searchParams.get("secret");
    if (!userId || !secret) {
        return NextResponse.redirect(`${siteHomeUrl}?error=missing-params`);
    }

    const { account } = await createAdminClient();
    const session = await account.createSession(userId, secret);

    (await cookies()).set(sessionName, session.secret, {
        path: "/",
        httpOnly: true,
        sameSite: "strict",
        secure: true
    });

    return NextResponse.redirect(`${siteHomeUrl}`);
}