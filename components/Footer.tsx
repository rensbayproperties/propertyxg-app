import React from "react";
import Container from "./Container";
import siteData from "@/constant/site";
import SectionContainer from "./SectionContainer";
import Link from "next/link";
import { Button } from "./ui/button";

interface SocialLink {
  icon: React.ReactNode;
  href: string;
  label: string;
}

interface QuickLink {
  text: string;
  href: string;
}

const Footer = () => {
  const quickLinks: QuickLink[] = [
    { text: "About Us", href: "/about" },
    { text: "Contact Us", href: "/contact" },
  ];

  return (
    <footer className="h-[120vh] flex">
      <Container>
        <div className="bg-brand/20 p-12 md:p-20 flex flex-col gap-y-2 rounded">
          <div className="flexs items-center justify-center text-heading text-4xl text-center leading-[1.2] mx-auto font-semibold">
            Your business deserve better tools<span className="text-brand">.</span>
          </div>
          <div className="flex items-center justify-center text-lg text-center leading-[1.2] max-w-lg mx-auto opacity-60">Join hundreds of agencies and property managers who run their operations smarter with PortalXg</div>
          <div className="flex gap-3 items-center justify-center mt-4">
            <Link href="" passHref>
              <Button variant={"brand"} size={"lg"}>Get Started Free</Button>
            </Link>
            <Link href="" passHref>
              <Button variant={"light"} size={"lg"} className="text-brand">Book a Demo</Button>
            </Link>
          </div>
        </div>
        {/* <div>© {new Date().getFullYear()} {siteData.name} Ltd. All rights reserved.</div> */}
      </Container>
    </footer>
  );
};

export default Footer;
