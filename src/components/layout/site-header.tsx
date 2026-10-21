"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Logo } from "@/components/layout/logo";
import { mainNav, services } from "@/content/site";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-colors",
        scrolled
          ? "border-border bg-card/80 backdrop-blur-md"
          : "border-transparent bg-transparent",
      )}
    >
      <div className="container-page flex h-18 items-center justify-between gap-6">
        <Logo />

        <NavigationMenu className="hidden lg:flex" viewport={false}>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="bg-transparent">Services</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[420px] gap-1 p-2">
                  {services.map((s) => (
                    <li key={s.slug}>
                      <NavigationMenuLink asChild>
                        <Link
                          href={`/services/${s.slug}`}
                          className="flex flex-row items-start gap-3 rounded-lg p-3"
                        >
                          <s.icon className="text-brand mt-0.5 size-4" aria-hidden />
                          <span>
                            <span className="block font-medium">{s.title}</span>
                            <span className="text-muted-foreground block text-sm">{s.summary}</span>
                          </span>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            {mainNav.map((item) => (
              <NavigationMenuItem key={item.href}>
                <NavigationMenuLink
                  asChild
                  className={cn(navigationMenuTriggerStyle(), "bg-transparent")}
                >
                  <Link href={item.href}>{item.label}</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center gap-2">
          <Button asChild variant="brand" size="xl" className="hidden h-10 sm:inline-flex">
            <Link href="/contact">
              Get in touch <ArrowRight />
            </Link>
          </Button>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon-lg" className="lg:hidden" aria-label="Open menu">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="gap-0 overflow-y-auto p-6">
              <SheetTitle className="sr-only">Menu</SheetTitle>
              <nav aria-label="Mobile" className="mt-8 flex flex-col gap-6">
                <div>
                  <p className="text-brand mb-2 text-xs font-semibold tracking-[0.12em] uppercase">
                    Services
                  </p>
                  <ul className="flex flex-col">
                    {services.map((s) => (
                      <li key={s.slug}>
                        <SheetClose asChild>
                          <Link href={`/services/${s.slug}`} className="block py-2 text-base">
                            {s.title}
                          </Link>
                        </SheetClose>
                      </li>
                    ))}
                  </ul>
                </div>
                <ul className="flex flex-col border-t pt-4">
                  {mainNav.map((item) => (
                    <li key={item.href}>
                      <SheetClose asChild>
                        <Link href={item.href} className="block py-2 text-base">
                          {item.label}
                        </Link>
                      </SheetClose>
                    </li>
                  ))}
                </ul>
                <SheetClose asChild>
                  <Button asChild variant="brand" size="xl">
                    <Link href="/contact">
                      Get in touch <ArrowRight />
                    </Link>
                  </Button>
                </SheetClose>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
