import { Button } from "@/components/ui/button";
import Link from "next/link";
import { siteConfig } from "@/config/site";

export function Footer() {
  return (
    <footer className="bg-background">
      <div className="max-md:px-4 md:container h-12 flex justify-start items-center">
        <div className="flex gap-3 items-center justify-end">
          <Link
            href={siteConfig.links.twitter}
            target="_blank"
            rel="noreferrer noopener"
          >
            <Button
              variant="link"
              size="sm"
              className="flex gap-1 items-center px-0 text-muted-foreground hover:text-foreground hover:no-underline"
            >
              #BuildingInPublic{" "}
              <span className="font-semibold">@cameronking4</span>
            </Button>
          </Link>
        </div>
      </div>
    </footer>
  );
}
