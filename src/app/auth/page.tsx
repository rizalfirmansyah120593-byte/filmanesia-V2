import { siteConfig } from "@/config/site";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: `Welcome Back to ${siteConfig.name}`,
};

const AuthPage = () => redirect("/");

export default AuthPage;
