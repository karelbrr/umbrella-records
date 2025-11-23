"use client";
import { motion } from "framer-motion";
import SpotlightCard from "../ui/SpotlightCard";

export function AboutStudio() {
  return (
    <motion.section
      id="quote"
      className="bg-black h-screen flex justify-center items-center flex-col py-20 container px-4 m-auto"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 1, ease: "easeOut" }}
    >
      <h2 className="text-4xl lg:text-7xl font-medium opacity-95 text-center font-satoshi">
        where ideas hit harder.
      </h2>
      <a href="/beats">
        <SpotlightCard
          className="hover:cursor-pointer mt-6 custom-spotlight-card w-48 m-auto"
          spotlightColor="rgba(148, 3, 252, 0.5)"
        >
          <h4 className="text-center font-satoshi opacity-90 lg:text-xl font-light pb-1">
            explore beats
          </h4>
        </SpotlightCard>
      </a>
    </motion.section>
  );
}
