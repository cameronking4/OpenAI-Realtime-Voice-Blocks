import { docs } from "#site/content";
import { MDXContent } from "@/components/mdx-components";

export default function DocsPage() {
  const introduction = docs.find((doc) => doc.slugAsParams === "introduction");

  if (!introduction || !introduction.published) {
    return null;
  }

  return (
    <article className="prose dark:prose-invert flex flex-col justify-start items-start py-10 mdx min-w-full max-w-full">
      <MDXContent code={introduction.body} />
    </article>
  );
}
