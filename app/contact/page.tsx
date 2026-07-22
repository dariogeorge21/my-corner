import type { Metadata } from "next";
import ContactClient from "./contact-client";

export const metadata: Metadata = {
  title: "Contact | Dario George",
  description: "Get in touch with Dario George to build fast, reliable, beautiful, and genuinely useful digital solutions.",
  alternates: {
    canonical: "https://dariogeorge.in/contact",
  },
};

export default function ContactPage() {
  return <ContactClient />;
}
