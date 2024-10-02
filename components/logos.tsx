/* eslint-disable @next/next/no-img-element */

export default function Logos() {
  /*
  all of the logos were taken from thtps://svgl.app/ 
  */
  const logos = [
    { src: "/logos/tailwindcss.svg", alt: "TailwindCSS logo" },
    { src: "/logos/react.svg", alt: "React logo" },
    { src: "/logos/typescript.svg", alt: "Typescript logo" },
    { src: "/logos/javascript.svg", alt: "JavaScript logo" },
    { src: "/logos/css.svg", alt: "CSS logo" },
    { src: "/logos/html5.svg", alt: "HTML 5 logo" },
    { src: "/logos/git.svg", alt: "GIT logo" },
    { src: "/logos/vscode.svg", alt: "VS Code logo" },
  ];

  const dobleLogos = logos.concat(logos);

  // to match the logos with the site style we need to change to black and white the logos adding the filter class to the img tag

  return (
    <section
      className="w-full max-w-3xl overflow-hidden select-none flex flex-col justify-center text-center font-medium text-muted-foreground animate-hero-in mb-2"
      style={{
        WebkitMask:
          "linear-gradient(90deg, transparent, black 20%, black 80%, transparent)",
        mask: "linear-gradient(90deg, transparent, black 20%, black 80%, black transparent)",
      }}
    >
      <span className="w-full px-10 md:text-xl lg:text-lg xl:text-xl text-muted-foreground">
        Built with
      </span>
      <div className="w-full h-fit mt-4 max-w-3xl flex flex-col justify-center select-none overflow-hidden">
        <div className="w-max flex flex-nowrap gap-[4rem] animate-slide-logos">
          {dobleLogos.map((logo, index) => (
            <img
              key={index}
              src={logo.src}
              alt={logo.alt}
              loading="eager"
              className="size-10 object-contain filter grayscale hover:grayscale-0 transition-all duration-300 ease-in-out"
            />
          ))}
          {dobleLogos.map((logo, index) => (
            <img
              key={index}
              src={logo.src}
              alt={logo.alt}
              loading="eager"
              className="size-10 object-contain filter grayscale hover:grayscale-0 transition-all duration-300 ease-in-out"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
