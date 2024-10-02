"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Badge } from "./ui/badge";

export const Sidebar = () => {
  const pathname = usePathname();

  siteConfig.components.sort((a, b) => a.title.localeCompare(b.title));

  return (
    <aside className="sticky top-[49px] gap-10 py-8 z-20 h-[calc(100dvh-25px)] w-full hidden md:block overflow-auto">
      <ScrollArea className="h-full pr-6">
        <div className="flex flex-col gap-5 h-full">
          <div className="flex flex-col gap-1 items-start">
            <span className="scroll-m-20 text-sm font-medium tracking-tight">
             Docs
            </span>
            {siteConfig.docs.map((doc) => (
              <Link
                key={doc.path}
                href={doc.path}
                className="flex items-center gap-1"
              >
                <Button
                  variant="link"
                  size="lg"
                  className={cn(
                    "hover:no-underline text-muted-foreground hover:text-foreground px-0",
                    pathname === `${doc.path}` && "text-foreground"
                  )}
                >
                  {doc.title}
                </Button>
              </Link>
            ))}
          </div>
          <div className="flex flex-col gap-1 items-start">
            <span className="scroll-m-20 text-sm font-medium tracking-tight">
              Animated Components
            </span>
            {siteConfig.components.map((component) => (
              <Link
                key={component.path}
                href={component.path}
                className="flex items-center gap-1"
              >
                <Button
                  variant="link"
                  size="lg"
                  className={cn(
                    "hover:no-underline text-muted-foreground hover:text-foreground px-0",
                    pathname === `${component.path}` && "text-foreground"
                  )}
                >
                  {component.title}
                </Button>
                {component.new && <Badge variant="outline">New</Badge>}
              </Link>
            ))}
          </div>
          <div className="flex flex-col gap-1 items-start">
            <span className="scroll-m-20 text-sm font-medium tracking-tight">
              Standard Components
            </span>
            {siteConfig.sections.map((component) => (
              <Link
                key={component.path}
                href={component.path}
                className="flex items-center gap-1"
              >
                <Button
                  variant="link"
                  size="lg"
                  className={cn(
                    "hover:no-underline text-muted-foreground hover:text-foreground px-0",
                    pathname === `${component.path}` && "text-foreground"
                  )}
                >
                  {component.title}
                </Button>
                {component.new && <Badge variant="outline">New</Badge>}
              </Link>
            ))}
          </div>
          <div className="flex flex-col gap-1 items-start">
            <span className="scroll-m-20 text-sm font-medium tracking-tight">
              Blocks / Cookbook
            </span>
            {siteConfig.demos.map((component) => (
              <Link
                key={component.path}
                href={component.path}
                className="flex items-center gap-1"
              >
                <Button
                  variant="link"
                  size="lg"
                  className={cn(
                    "hover:no-underline text-muted-foreground hover:text-foreground px-0",
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
    </aside>
  );
};
