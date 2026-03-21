import { Metadata } from "next";
import { siteConfig } from "@/lib/site";

export const metadataKeywords = [
    "Business Consulting",
    "Automation Templates",
    "User Manuals",
    "Test Cases",
    "Notification Templates",
    "AI Prompts",
    "Business Process Automation",
    "Consulting Workflows",
    "BC Automations",
    "Document Automation",
    "Quality Assurance",
    "Client Onboarding",
]

export const metadata: Metadata = {
    title: siteConfig.name,
    description: siteConfig.description,
    keywords: metadataKeywords,
    authors: [
        {
            name: "BC Automations",
            url: "https://bc-automations.vercel.app",
        },
    ],
    creator: "BC Automations",
    openGraph: {
        type: "website",
        locale: "en_US",
        url: siteConfig.url,
        title: siteConfig.name,
        description: siteConfig.description,
        siteName: siteConfig.name,
    },
    twitter: {
        card: "summary_large_image",
        title: siteConfig.name,
        description: siteConfig.description,
        creator: "@bc_automations",
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
};