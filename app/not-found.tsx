'use client'
import React from "react";
import errorimage from "../public/assets/images/errorimage.png";
import { usePathname } from "next/navigation";
import Link from "next/link";

function NotFound({
  heading,
  subheading,
}: {
  heading: string;
  subheading: string;
}
) {
  const pathname = usePathname();
  const parent = pathname.split("/")[1] || "home";

  return (
    <>
      <div className="flex min-h-screen flex-col items-center justify-center text-center gap-4 px-4">
        <img
          src={errorimage.src}
          alt=""
          width={"200px"}
          className="h-auto opacity-90"
        />
        <p className="text-4xl font-bold text-blue-800">{heading || "Page not found"}</p>
        <p className="tracking-tight opacity-60 max-w-md">
          {subheading || "Sorry, we couldn't find the page you're looking for. Please check the URL or return to the homepage."}
        </p>

        <Link href={`/`} passHref={true} className="text-link text-lg border-b-2 border-b-gray-300 flex gap-2 font-bold">
          Back to Homepage
        </Link>
        <Link href={`/${parent}`} passHref={true} className="text-link text-lg border-b-2 border-b-gray-300 flex gap-2 font-bold">
          Back to {parent}
          {/* <i className="bi-arrow-up-right"></i> */}
        </Link>
      </div>
    </>
  );
}

export default NotFound;
