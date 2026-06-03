import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

const HomeLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar className="sticky shadow-sm backdrop-blur border-b" />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
};

export default HomeLayout;
