"use client";

import { useRef, useState } from "react";
import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { PrimaryDoors } from "@/components/primary-doors";
import { FreeTextRouter } from "@/components/free-text-router";
import { SpecializedCards } from "@/components/specialized-cards";
import { Ecosystem } from "@/components/ecosystem";
import { Disclaimer } from "@/components/disclaimer";
import { Footer } from "@/components/footer";

export function HomeClient() {
  const [routerOpen, setRouterOpen] = useState(false);
  const routerRef = useRef<HTMLDivElement>(null);

  const openRouter = () => {
    setRouterOpen(true);
    // Scroll to the router after it renders
    requestAnimationFrame(() => {
      setTimeout(() => {
        routerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 50);
    });
  };

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-brand-navy focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to main content
      </a>
      <Header />
      <main id="main">
        <Hero />
        <PrimaryDoors onDontKnowClick={openRouter} />
        {routerOpen && (
          <div ref={routerRef} tabIndex={-1}>
            <FreeTextRouter />
          </div>
        )}
        <SpecializedCards />
        <Ecosystem />
        <section className="container-page pb-16">
          <Disclaimer />
        </section>
      </main>
      <Footer />
    </>
  );
}
