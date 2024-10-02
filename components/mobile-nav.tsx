"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { ScrollArea } from "@/components/ui/scroll-area";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Badge } from "./ui/badge";

export function MobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  siteConfig.components.sort((a, b) => a.title.localeCompare(b.title));

  return (
    <div className="md:hidden flex gap-2 w-full items-center overflow-auto">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button size="icon" variant="outline" aria-label="Open navigation">
            <HamburgerMenuIcon />
          </Button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="h-screen w-full rounded-none flex flex-col flex-1 justify-start items-start border-none overflow-y-auto p-6 pb-48"
        >
          <SheetHeader className="w-full">
            <SheetTitle className="w-full text-left text-2xl font-bold">
              <Link
                href="/"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 text-2xl"
              >
                {siteConfig.name}
                {/* <Badge variant="outline" className="text-normal">
                  Beta
                </Badge> */}
              </Link>
            </SheetTitle>
            <ScrollArea className="flex flex-col gap-6 overflow-scroll mt-6">
              <div className="flex flex-col gap-8 items-start">
                <div className="flex flex-col gap-6 items-start mt-4">
                  <span className="scroll-m-20 text-xl font-medium tracking-tight">
                    Getting Started
                  </span>
                  {siteConfig.docs.map((doc) => (
                    <Link
                      key={doc.path}
                      href={doc.path}
                      className="flex items-center gap-3"
                      onClick={() => setOpen(false)}
                    >
                      <Button
                        variant="link"
                        size="lg"
                        className={cn(
                          "hover:no-underline text-muted-foreground hover:text-foreground px-0 text-lg",
                          pathname === `${doc.path}` && "text-foreground"
                        )}
                      >
                        {doc.title}
                      </Button>
                    </Link>
                  ))}
                </div>
                <div className="flex flex-col gap-6 items-start">
                  <span className="scroll-m-20 text-xl font-medium tracking-tight">
                    Voice Animated Components
                  </span>
                  {siteConfig.components.map((component) => (
                    <Link
                      key={component.path}
                      href={component.path}
                      className="flex items-center gap-3"
                      onClick={() => setOpen(false)}
                    >
                      <Button
                        variant="link"
                        size="lg"
                        className={cn(
                          "hover:no-underline text-muted-foreground hover:text-foreground px-0 text-lg",
                          pathname === `${component.path}` && "text-foreground"
                        )}
                      >
                        {component.title}
                      </Button>
                      {component.new && <Badge variant="outline">New</Badge>}
                    </Link>
                  ))}
                </div>
                <div className="flex flex-col gap-6 items-start">
                  <span className="scroll-m-20 text-xl font-medium tracking-tight">
                    Non-Voice Animated Components
                  </span>
                  {siteConfig.sections.map((component) => (
                    <Link
                      key={component.path}
                      href={component.path}
                      className="flex items-center gap-3"
                      onClick={() => setOpen(false)}
                    >
                      <Button
                        variant="link"
                        size="lg"
                        className={cn(
                          "hover:no-underline text-muted-foreground hover:text-foreground px-0 text-lg",
                          pathname === `${component.path}` && "text-foreground"
                        )}
                      >
                        {component.title}
                      </Button>
                      {component.new && <Badge variant="outline">New</Badge>}
                    </Link>
                  ))}
                </div>
                <div className="flex flex-col gap-6 items-start">
                  <span className="scroll-m-20 text-xl font-medium tracking-tight">
                    Demos & Examples
                  </span>
                  {siteConfig.demos.map((component) => (
                    <Link
                      key={component.path}
                      href={component.path}
                      className="flex items-center gap-3"
                      onClick={() => setOpen(false)}
                    >
                      <Button
                        variant="link"
                        size="lg"
                        className={cn(
                          "hover:no-underline text-muted-foreground hover:text-foreground px-0 text-lg",
                          pathname === `${component.path}` && "text-foreground"
                        )}
                      >
                        {component.title}
                      </Button>
                      {component.new && <Badge variant="outline">New</Badge>}
                    </Link>
                  ))}
                </div>
              </div>
            </ScrollArea>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </div>
  );
}