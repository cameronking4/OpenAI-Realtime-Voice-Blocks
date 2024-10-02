import { Button } from "./ui/button";
import { Icons } from "./icons";
import { siteConfig } from "@/config/site";

export default function Hero() {
  return (
    <section className="w-full max-w-5xl container px-4 py-10 text-white">
      <div className="flex flex-col justify-center space-y-4 text-center">
        <div className="space-y-2">
          <span className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none text-transparent bg-clip-text bg-gradient-to-r from-white to-white/30">
            Your next component starts here
          </span>
          <p className="w-full px-10 md:text-xl lg:text-lg xl:text-xl text-transparent bg-clip-text bg-gradient-to-r from-white to-white/30">
            {siteConfig.description}
          </p>
        </div>
        <div className="flex gap-2 justify-center">
          <a
            href="https://github.com/cameronking4/VapiBlocks"
            className="no-underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline" className="flex items-center gap-2">
              Star on GitHub <Icons.github />
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}
