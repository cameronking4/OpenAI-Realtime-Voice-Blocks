"use client";
import React, { Suspense, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { ReloadIcon } from "@radix-ui/react-icons";

interface ComponentPreviewProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  align?: "center" | "start" | "end";
  description?: string;
}
export function ComponentPreview({
	name,
	align = "center",
	description,
	...props
}: ComponentPreviewProps) {
	const [forceUpdate, setForceUpdate] = useState(false);
	const [key, setKey] = useState(0);

	const LoadComponent = () => {
		const LazyComponent = React.useMemo(() => {
			return React.lazy(() => import(`@/components/examples/${name}`));
		}, [forceUpdate]);

		return LazyComponent;
	};

	const reloadComponent = () => {
		setKey((prevKey) => prevKey + 1);
	};

	const LazyComponent = LoadComponent();

	return (
		<div
			className={cn(
				"relative bg-transparent border rounded-[1rem] w-full min-h-[250px] flex justify-center items-center overflow-hidden p-2"
			)}
			{...props}
		>
			<Suspense fallback={<div></div>}>
				<LazyComponent key={key} />
			</Suspense>
			<Button
				size="icon"
				variant="ghost"
				className="text-white absolute top-2 right-2"
				onClick={reloadComponent}
			>
				<ReloadIcon />
			</Button>
		</div>
	);
}
