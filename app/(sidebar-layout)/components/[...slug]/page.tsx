import { components } from "#site/content";
import { MDXContent } from "@/components/mdx-components";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { siteConfig } from "@/config/site";

interface ComponentPageProps {
  params: { slug: string[] };
}

async function getComponentFromParams(params: ComponentPageProps["params"]) {
  const slug = params?.slug.join("/");
  const component = components.find(
    (component) => component.slugAsParams === slug
  );

  return component;
}

export async function generateMetadata({
  params,
}: ComponentPageProps): Promise<Metadata> {
  const component = await getComponentFromParams(params);

  if (!component) {
    return {};
  }

  const ogSearchParams = new URLSearchParams();
  ogSearchParams.set("title", component.title);

  return {
    title: component.title,
    description: component.description,
    authors: { name: siteConfig.author },
    openGraph: {
      title: component.title,
      description: component.description,
      type: "article",
      url: component.slug,
      images: [
        {
          url: `/api/og?${ogSearchParams.toString()}`,
          width: 1200,
          height: 630,
          alt: component.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: component.title,
      description: component.description,
      images: [`/api/og?${ogSearchParams.toString()}`],
    },
  };
}

export async function generateStaticParams(): Promise<
  ComponentPageProps["params"][]
> {
  return components.map((component) => ({
    slug: component.slugAsParams.split("/"),
  }));
}

export default async function ComponentPage({ params }: ComponentPageProps) {
  const component = await getComponentFromParams(params);

  if (!component || !component.published) {
    return notFound();
  }

  return (
    <article className="prose dark:prose-invert justify-start items-start py-10 min-w-full">
      <MDXContent code={component.body} />
    </article>
  );
}
