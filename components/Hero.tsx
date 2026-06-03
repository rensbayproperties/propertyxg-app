'use client'
import React from "react";
import Container from "./Container";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/button";
import siteData from "@/constant/site";
import Image from "next/image";

const Hero = () => {
  return (
    <div className="bg-1">
      <Container>
        <div>
          <div className="flex flex-col gap-4 mx-auto text-center justify-center md:min-h-[30rems] items-center py-10 md:py-20">
            <AnimatedText />
            <p className="text-lg max-w-lg">{siteData.name} lets you track your sales pipeline, optimize leads, manage deals with AI and automate your entire sales process so you can focus on selling.</p>
            <div className="mt-2 flex gap-2 justify-center">
              <Link
                href={`/signup`}
                className={cn(buttonVariants({ variant: "brand" }), "")}
              >
                Get started
              </Link>
              <Link
                href={`/signup`}
                className={cn(buttonVariants({ variant: "secondary" }), "")}
              >
                Talk to sales
              </Link>
            </div>
          </div>
        </div>
        <div className="pb-20">
          <Image src="/assets/images/bg1.png" alt="" width={1600} height={700} />
        </div>
        <div className="pb-20">
          <Image src="/assets/images/bg2.png" alt="" width={1600} height={80} />
        </div>
      </Container>
    </div>
  );
};

export default Hero;



import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

const words = ['Grow your leads', 'Discover Dubai projects', 'Manage your sales', 'Automate your workflow', 'Boost your productivity'];

export function AnimatedText() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col gap-2 text-3xl md:text-5xl font-extrabold !leading-tight max-w-3xl capitalize">
      <div >
        <AnimatePresence mode="wait">
          <motion.span
            key={words[index]}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="text-brand"
          >
            {words[index]}
          </motion.span>
        </AnimatePresence>
      </div>
      <span>better with PortalXg</span>
    </div>
  );
}
