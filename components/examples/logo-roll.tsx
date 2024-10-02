/* eslint-disable @next/next/no-img-element */

export default function LogoRoll() {
  /*
  all of the logos were taken from thtps://svgl.app/ 
  */
  const logos = [
    { src: "/logos/aws.svg", alt: "AWS logo" },
    { src: "/logos/nextjs_logo_dark.svg", alt: "NextJS logo" },
    { src: "/logos/coursera.svg", alt: "Coursera logo" },
    { src: "/logos/babel.svg", alt: "Babel logo" },
    { src: "/logos/sanity.svg", alt: "Sanity logo" },
    { src: "/logos/webflow.svg", alt: "Webflow logo" },
    { src: "/logos/stripe.svg", alt: "Stripe logo" },
    { src: "/logos/prime-video.svg", alt: "Prime video logo" },
  ];

  const dobleLogos = logos.concat(logos);

  return (
    <section
      className="w-full max-w-3xl overflow-hidden select-none bg-[#0D0D0C]"
      style={{
        WebkitMask:
          "linear-gradient(90deg, transparent, black 20%, black 80%, transparent)",
        mask: "linear-gradient(90deg, transparent, black 20%, black 80%, black transparent)",
      }}
    >
      <div className="w-full h-fit max-w-3xl flex flex-col justify-center select-none overflow-hidden">
        <div className="w-max flex flex-nowrap gap-[4rem] animate-slide-logos">
          {dobleLogos.map((logo, index) => (
            <img
              key={index}
              src={logo.src}
              alt={logo.alt}
              loading="eager"
              className="size-20 object-contain"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
