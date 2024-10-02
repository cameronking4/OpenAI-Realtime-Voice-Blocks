/* eslint-disable @next/next/no-img-element */
"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { MobileNav } from "./mobile-nav";
import { Badge } from "./ui/badge";

export function Header() {
  const pathname = usePathname();
  // const newComponent =
  //   siteConfig.components.find((component) => component.new) ||
  //   siteConfig.components[0];
  return (
    <header className="sticky top-0 z-50 border-b bg-background">
      <div className="max-md:px-4 md:container h-12 flex justify-center items-center">
        <MobileNav />
        <nav className="max-md:hidden flex gap-10 w-full items-center">
          <Link href="/" className="flex gap-3 items-center">
            <h1 className="text-lg font-medium tracking-tighter flex gap-1 items-center">
              {siteConfig.name}
            </h1>
            <Badge variant="outline" className="text-normal">
              Beta
            </Badge>
          </Link>
          <div className="flex gap-10 items-center">
            {/* <Link href={newComponent.path}> */}
            <Link href="/components/outbound-phone-dial" >
              <Button
                variant="link"
                size="sm"
                className={cn(
                  "hover:no-underline text-muted-foreground hover:text-foreground",
                  pathname.includes("components") && !pathname.includes("demos") && "text-foreground"
                )}
              >
                Components
              </Button>
            </Link>
            <Link href="/components/demos/meeting">
              <Button
                variant="link"
                size="sm"
                className={cn(
                  "hover:no-underline text-muted-foreground hover:text-foreground",
                  pathname.includes("demos") && "text-foreground"
                )}
              >
                Blocks
              </Button>
            </Link>
            <Link href="/docs/templates">
              <Button
                variant="link"
                size="sm"
                className={cn(
                  "hover:no-underline text-muted-foreground hover:text-foreground",
                  pathname.includes("demos") && "text-foreground"
                )}
              >
                Templates
              </Button>
            </Link>
          </div>
        </nav>
        <div className="flex gap-3 items-center justify-end">
          {/* <Link
            href={"#"}
            target="_blank"
            rel="noreferrer noopener"
            aria-label="Give Feedback"
          >
            <Button
              variant="outline"
              size="sm"
              className="flex gap-3 items-center max-md:h-9 max-md:w-9 max-md:px-0"
              aria-label="Give Feedback"
            >
              <span className="hidden md:block">Give Feedback</span>
            </Button>
          </Link> */}
          <Link
            href={siteConfig.links.github}
            target="_blank"
            rel="noreferrer noopener"
            aria-label="Give a star on GitHub"
          >
            <Button
              variant="outline"
              size="sm"
              className="flex gap-3 items-center max-md:h-9 max-md:w-9 max-md:px-0"
              aria-label="Give a star on GitHub"
            >
              <span className="hidden md:block">Give a star</span>{" "}
              <Icons.github />
            </Button>
          </Link>
          <Link
            href={siteConfig.links.twitter}
            target="_blank"
            rel="noreferrer noopener"
            aria-label="Follow on Twitter"
          >
            <Button
              variant="outline"
              size="sm"
              className="flex gap-3 items-center max-md:h-9 max-md:w-9 max-md:px-0"
              aria-label="Follow on Twitter"
            >
              <span className="hidden md:block">Follow on</span>{" "}
              <Icons.twitter />
            </Button>
          </Link>
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  );
}
