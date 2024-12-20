export const siteConfig = {
  name: "OpenAI Realtime Blocks",
  url: "https://vapiblocks.com",
  description: "OpenAI Realtime Blocks is a UI Library built with React and TailwindCSS to drop-in Voice AI components into your application with ease.",
  author: "cameronking4",
  links: {
    twitter: "https://x.com/cameronyking4",
    github: "https://github.com/cameronking4/openai-realtime-blocks",
    portfolio: "https://www.linkedin.com/in/cameronyking",
  },
  docs: [
    {
      title: "Getting Started",
      path: "/docs",
      new: false,
    },
    {
      title: "Changelog",
      path: "/docs/changelog",
      new: false,
    },
    // {
    //   title: "Quickstart",
    //   path: "/docs/quickstart",
    //   new: false,
    // },
    // {
    //   title: "Templates",
    //   path: "/docs/templates",
    //   new: false,
    // },
  ],
  components: [
    {
      title: "Classic",
      path: "/components/classic",
      new: false,
    },
    {
      title: "Dock",
      path: "/components/dock", 
      new: true,
    },
    {
      title: "Dynamic Island",
      path: "/components/dynamic-island",
      new: true,
    },
    {
      title: "Floaty",
      path: "/components/floaty",
      new: false,
    },
    {
      title: "Glob",
      path: "/components/glob",
      new: true,
    },
    {
      title: "Minimal",
      path: "/components/minimal-component",
      new: false,
    },
    {
      title: "Orb",
      path: "/components/3d-orb",
      new: false,
    },
    {
      title: "Radial",
      path: "/components/circlewaveform",
      new: false,
    },
    {
      title: "Siri",
      path: "/components/siri",
      new: true,
    },
    {
      title: "Transcriber",
      path: "/components/transcribe", 
      new: true,
    },
  ],
  // sections: [
  //   {
  //     title: "Outbound Call",
  //     path: "/components/outbound-phone-dial",
  //     new: false,
  //   }
  // ],
  // demos: [
  //   {
  //     title: "Meeting Scheduler",
  //     path: "/components/demos/meeting",
  //     new: true,
  //   },
  //   {
  //     title: "Coding Assistant",
  //     path: "/components/demos/coder",
  //     new: true,
  //   }
  // ],
};

export type SiteConfig = typeof siteConfig;
