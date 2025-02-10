"use server";

import { Client, Account, OAuthProvider } from "node-appwrite";
import { cookies } from "next/headers";
import { env } from "process";
import { redirect } from "next/navigation";

export async function getCredentials() {
    const sessionName = env.APPWRITE_SESSION_NAME;
    const appwriteEndpoint = env.APPWRITE_ENDPOINT;
    const appwriteProjectId = env.APPWRITE_PROJECT_ID;
    const appwriteKey = env.APPWRITE_KEY;
    const siteHomeUrl = env.SITE_HOME_URL;
    if (!sessionName || !appwriteEndpoint || !appwriteProjectId || !appwriteKey || !siteHomeUrl) {
        throw new Error("Appwrite environment variables not set");
    }

    return {
        sessionName,
        appwriteEndpoint,
        appwriteProjectId,
        appwriteKey,
        siteHomeUrl
    };
}

export async function createSessionClient() {
    const { sessionName, appwriteEndpoint, appwriteProjectId } = await getCredentials();

    const client = new Client()
        .setEndpoint(appwriteEndpoint)
        .setProject(appwriteProjectId);
    
    const session = (await cookies()).get(sessionName);
    if (!session || !session.value) {
        throw new Error("Session not found");
    }

    client.setSession(session.value);

    return {
        get account() {
            return new Account(client);
        }
    };
}

export async function createAdminClient() {
    const { appwriteEndpoint, appwriteProjectId, appwriteKey } = await getCredentials();
    const client = new Client()
        .setEndpoint(appwriteEndpoint)
        .setProject(appwriteProjectId)
        .setKey(appwriteKey);

    return {
        get account() {
            return new Account(client);
        }
    }
}

export async function getLoggedInUser() {
    try { 
        const { account } = await createSessionClient();
        return await account.get();
    } catch {
        return null;
    }
}

export async function signInWithGoogle() {
    const { account } = await createAdminClient();
    const { siteHomeUrl } = await getCredentials();

    const redirectUrl = await account.createOAuth2Token(
        OAuthProvider.Google,
        `${siteHomeUrl}/login/callback/google`,
        `${siteHomeUrl}/login?withError`
    );

    return redirect(redirectUrl);
}

export async function signOut() {
    const { sessionName, siteHomeUrl } = await getCredentials();

    const { account } = await createSessionClient();

    (await cookies()).delete(sessionName);
    await account.deleteSession("current");

    return redirect(siteHomeUrl);
}