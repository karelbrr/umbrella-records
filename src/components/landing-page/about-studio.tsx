"use client";

import { motion } from "framer-motion";
import ScrollReveal from "../ScrollReveal";
import SpotlightCard from "../SpotlightCard";
import { Button } from "../ui/button";
import Image from "next/image";

export function AboutStudio() {
  return (
    <section className="bg-black h-screen flex justify-center items-center flex-col py-20 container px-4 m-auto" >


      <h2 className="text-4xl lg:text-7xl font-medium opacity-95 text-center font-satoshi">
        where ideas hit harder.
      </h2>
      <a href="/beats">
        <SpotlightCard
          className="hover:cursor-pointer mt-6 custom-spotlight-card w-48  m-auto"
          spotlightColor="rgba(148, 3, 252, 0.5)"
        >
          <h4 className="text-center font-satoshi opacity-90 lg:text-xl font-light pb-1">
            explore beats
          </h4>
        </SpotlightCard>
      </a>
    </section>
  );
}
