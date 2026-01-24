
import LoginClient from "./LoginClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Sign in | talkflo",
    description: "Sign in to talkflo to start your AI communication journey.",
};

export default function LoginPage() {
    return <LoginClient />;
}
