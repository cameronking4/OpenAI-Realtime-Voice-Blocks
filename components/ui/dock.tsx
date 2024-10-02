"use client";

import {
	AnimatePresence,
	type MotionValue,
	animate,
	motion,
	useAnimation,
	useMotionValue,
	useSpring,
	useTransform,
} from "framer-motion";
import {
	type ReactNode,
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import useMultiVapi from "@/hooks/use-multi-vapi"; // Ensure the correct path to your hook

import { cn } from "@/lib/utils";

interface DockContextType {
	width: number;
	hovered: boolean;
	setIsZooming: (value: boolean) => void;
	zoomLevel: MotionValue<number>;
	mouseX: MotionValue<number>;
	animatingIndexes: number[];
	setAnimatingIndexes: (indexes: number[]) => void;
	activeCardId: number | null;
	setActiveCardId: (id: number | null) => void;
}

const DockContext = createContext<DockContextType>({
	width: 0,
	hovered: false,
	setIsZooming: () => {},
	zoomLevel: null as any,
	mouseX: null as any,
	animatingIndexes: [],
	setAnimatingIndexes: () => {},
	activeCardId: null,
	setActiveCardId: () => {},
});

// Initial width for the dock
const INITIAL_WIDTH = 48;

// Custom hook to use Dock context
const useDock = () => useContext(DockContext);

// Props for the Dock component
interface DockProps {
	className?: string;
	children: ReactNode; // React children to be rendered within the dock
}

// Main Dock component: orchestrating the dock's animation behavior
function Dock({ className, children }: DockProps) {
	const [hovered, setHovered] = useState(false);
	const [width, setWidth] = useState(0);
	const dockRef = useRef<HTMLDivElement>(null);
	const isZooming = useRef(false);
	const [animatingIndexes, setAnimatingIndexes] = useState<number[]>([]);
	const [activeCardId, setActiveCardId] = useState<number | null>(null);

	const setIsZooming = useCallback((value: boolean) => {
		isZooming.current = value;
		setHovered(!value);
	}, []);

	const zoomLevel = useMotionValue(1);

	useWindowResize(() => {
		setWidth(dockRef.current?.clientWidth || 0);
	});

	const mouseX = useMotionValue(Number.POSITIVE_INFINITY);

	return (
		<DockContext.Provider
			value={{
				hovered,
				setIsZooming,
				width,
				zoomLevel,
				mouseX,
				animatingIndexes,
				setAnimatingIndexes,
				activeCardId,
				setActiveCardId,
			}}
		>
			<motion.div
				ref={dockRef}
				className={cn(
					"-translate-x-1/2 absolute bottom-4 left-1/2 flex h-14 transform items-end gap-3 rounded-xl bg-opacity-90 p-2",
					" bg-neutral-50 p-2 no-underline shadow-sm transition-colors dark:bg-neutral-900 dark:hover:bg-neutral-800/80 hover:bg-neutral-100 ",
					"shadow-[0px_1px_1px_0px_rgba(0,0,0,0.05),0px_1px_1px_0px_rgba(255,252,240,0.5)_inset,0px_0px_0px_1px_hsla(0,0%,100%,0.1)_inset,0px_0px_1px_0px_rgba(28,27,26,0.5)]",
					"dark:shadow-[0_1px_0_0_rgba(255,255,255,0.03)_inset,0_0_0_1px_rgba(255,255,255,0.03)_inset,0_0_0_1px_rgba(0,0,0,0.1),0_2px_2px_0_rgba(0,0,0,0.1),0_4px_4px_0_rgba(0,0,0,0.1),0_8px_8px_0_rgba(0,0,0,0.1)]",
					className,
				)}
				onMouseMove={(e) => {
					mouseX.set(e.pageX);
					if (!isZooming.current) {
						setHovered(true);
					}
				}}
				onMouseLeave={() => {
					mouseX.set(Number.POSITIVE_INFINITY);
					setHovered(false);
				}}
				style={{
					x: "-50%",
					scale: zoomLevel,
				}}
			>
				{children}
			</motion.div>
		</DockContext.Provider>
	);
}

// Props for the DockCardInner component
interface DockCardInnerProps {
	src: string; // Source URL for the image
	id: string; // Unique identifier for the card
	children?: ReactNode; // Optional children for the card
}

// DockCardInner component to display images and handle animation states
function DockCardInner({ src, id, children }: DockCardInnerProps) {
	const { animatingIndexes } = useDock(); // Access the Dock context to get the animating indexes. This determines which cards are currently animating.

	return (
		<span className="relative z-0 flex max-h-8 w-full items-center justify-center overflow-hidden rounded-md">
			{/* Background image with a blur effect to give a depth illusion */}
			{/* <motion.img
				className="absolute z-10 translate-y-2.5 scale-125 transform opacity-40 blur-md filter "
				src={src}
				alt=""
			/> */}

			{/* AnimatePresence component to handle the entrance and exit animations of children - in our case, the "openIcon" */}
			<AnimatePresence>
				{animatingIndexes.includes(Number.parseInt(id)) && children ? (
					<motion.div
						className="relative z-0 h-full w-full rounded-full"
						initial={{ scale: 0, opacity: 0, filter: "blur(4px)" }}
						animate={{
							scale: 1,
							opacity: 1,
							filter: "blur(0px)",
							transition: { type: "spring", delay: 0.2 }, // Animation to spring into place with a delay so our layoutId animations can be smooth
						}}
						exit={{
							scale: 0,
							opacity: 0,
							filter: "blur(4px)",
							transition: { duration: 0 }, // Exit animation with no delay
						}}
					>
						<div className="flex h-full w-full flex-col items-center justify-center">
							{/* Render the openIcon */}
							{children}
						</div>
					</motion.div>
				) : null}
			</AnimatePresence>

			{/* Another AnimatePresence to handle layout animations */}
			<AnimatePresence mode="popLayout">
				{!animatingIndexes.includes(Number.parseInt(id)) ? (
					<motion.img
						layoutId={id} // Unique identifier for layout animations
						className="relative z-0 h-1/2 w-1/2 rounded-full border border-black/30 dark:border-white/10"
						src={src}
						alt=""
					/>
				) : null}
			</AnimatePresence>
		</span>
	);
}

// Props for the DockCard component
interface DockCardProps {
	children: ReactNode;
	id: string;
	assistantId: string; // Add assistantId prop
}

// DockCard component: manages individual card behavior within the dock
function DockCard({ children, id, assistantId }: DockCardProps) {
	const cardRef = useRef<HTMLButtonElement>(null);
	const [elCenterX, setElCenterX] = useState(0);
	const dock = useDock();
	const { toggleCall, isSessionActive } = useMultiVapi();

	const size = useSpring(INITIAL_WIDTH, {
		stiffness: 320,
		damping: 20,
		mass: 0.1,
	});

	const opacity = useSpring(0, {
		stiffness: 300,
		damping: 20,
	});

	useEffect(() => {
		const { x } = cardRef.current?.getBoundingClientRect() || { x: 0 };
		setElCenterX(x + 24); // 24 is the half of INITIAL_WIDTH (48 / 2), centering the element
	}, []);

	const isAnimating = useRef(false);
	const controls = useAnimation();
	const timeoutRef = useRef<number | null>(null);

	const handleClick = () => {
		if (
			dock.activeCardId !== null &&
			dock.activeCardId !== Number.parseInt(id)
		) {
			return;
		}

		if (!isAnimating.current) {
			isAnimating.current = true;
			dock.setAnimatingIndexes([...dock.animatingIndexes, Number.parseInt(id)]);
			opacity.set(0.5);
			controls.start({
				y: -24,
				transition: {
					repeat: Number.POSITIVE_INFINITY,
					repeatType: "reverse",
					duration: 0.5,
				},
			});
			dock.setActiveCardId(Number.parseInt(id));
			toggleCall(assistantId); // Pass the assistantId to toggleCall
		} else {
			isAnimating.current = false;
			dock.setAnimatingIndexes(
				dock.animatingIndexes.filter((index) => index !== Number.parseInt(id)),
			);
			opacity.set(0);
			controls.start({
				y: 0,
				transition: { duration: 0.5 },
			});
			dock.setActiveCardId(null);
			toggleCall(assistantId); // Pass the assistantId to toggleCall
		}
	};

	useEffect(() => {
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		return () => clearTimeout(timeoutRef.current!);
	}, []);

	const distance = useTransform(dock.mouseX, (val) => {
		const bounds = cardRef.current?.getBoundingClientRect() ?? {
			x: 0,
			width: 0,
		};
		return val - bounds.x - bounds.width / 2;
	});

	const widthSync = useTransform(distance, [-150, 0, 150], [40, 80, 40]);
	const width = useSpring(widthSync, {
		mass: 0.1,
		stiffness: 150,
		damping: 12,
	});

	return (
		<div className="flex flex-col items-center gap-1" key={id}>
			<motion.button
				ref={cardRef}
				className="aspect-square w-full rounded-lg border border-black/5 border-opacity-10 bg-neutral-100 brightness-90 saturate-90 transition-filter duration-200 dark:border-white/5 dark:bg-neutral-800 hover:brightness-112 hover:saturate-100"
				onClick={handleClick}
				style={{ width }}
				animate={controls}
				whileTap={{ scale: 0.95 }}
			>
				{children}
			</motion.button>
			<AnimatePresence mode="popLayout">
				{dock.animatingIndexes.includes(Number.parseInt(id)) ? (
					<motion.div
						key={id}
						layoutId={id}
						className="rounded-full"
						style={{ opacity }}
					>
						<motion.div
							exit={{ transition: { duration: 0 } }}
							className="h-1.5 w-1.5 rounded-full bg-black dark:bg-white"
							style={{ opacity }}
						/>
					</motion.div>
				) : null}
			</AnimatePresence>
		</div>
	);
}

// Divider component for the dock
function DockDivider() {
	return (
		<motion.div
			className="flex h-full cursor-ns-resize items-center p-1.5"
			drag="y"
			dragConstraints={{ top: -100, bottom: 50 }}
		>
			<span className="h-full w-0.5 rounded bg-neutral-800/10 dark:bg-neutral-100/10 " />
		</motion.div>
	);
}

type UseWindowResizeCallback = (width: number, height: number) => void;

// Custom hook to handle window resize events and invoke a callback with the new dimensions
function useWindowResize(callback: UseWindowResizeCallback) {
	// Create a stable callback reference to ensure the latest callback is always used
	const callbackRef = useCallbackRef(callback);

	useEffect(() => {
		// Function to handle window resize and call the provided callback with updated dimensions
		const handleResize = () => {
			callbackRef(window.innerWidth, window.innerHeight);
		};

		// Initial call to handleResize to capture the current window size
		handleResize();
		// Adding event listener for window resize events
		window.addEventListener("resize", handleResize);

		// Cleanup function to remove the event listener when the component unmounts or dependencies change
		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, [callbackRef]); // Dependency array includes the stable callback reference
}

// Custom hook to create a stable callback reference
function useCallbackRef<T extends (...args: any[]) => any>(callback: T): T {
	// Use a ref to store the callback
	const callbackRef = useRef(callback);

	// Update the ref with the latest callback whenever it changes
	useEffect(() => {
		callbackRef.current = callback;
	});

	// Return a memoized version of the callback that always uses the latest callback stored in the ref
	return useMemo(() => ((...args) => callbackRef.current?.(...args)) as T, []);
}

// Interface for mouse position options
interface MousePositionOptions {
	onChange?: (position: { value: { x: number; y: number } }) => void;
}

// Custom hook to track mouse position and animate values accordingly
export function useMousePosition(
	options: MousePositionOptions = {}, // Options to customize behavior, including an onChange callback
	deps: readonly any[] = [], // Dependencies array export default Docke when the effect should re-run
) {
	const { onChange } = options; // Destructure onChange from options for use in the effect

	// Create motion values for x and y coordinates, initialized to 0
	const x = useMotionValue(0);
	const y = useMotionValue(0);

	useEffect(() => {
		// Function to handle mouse move events, animating the x and y motion values to the current mouse coordinates
		const handleMouseMove = (event: MouseEvent) => {
			animate(x, event.clientX);
			animate(y, event.clientY);
		};

		// Function to handle changes in the motion values, calling the onChange callback if it exists
		const handleChange = () => {
			if (onChange) {
				onChange({ value: { x: x.get(), y: y.get() } });
			}
		};

		// Subscribe to changes in the x and y motion values
		const unsubscribeX = x.on("change", handleChange);
		const unsubscribeY = y.on("change", handleChange);

		// Add event listener for mouse move events
		window.addEventListener("mousemove", handleMouseMove);

		// Cleanup function to remove event listener and unsubscribe from motion value changes
		return () => {
			window.removeEventListener("mousemove", handleMouseMove);
			unsubscribeX();
			unsubscribeY();
		};
	}, [x, y, onChange, ...deps]); // Dependency array includes x, y, onChange, and any additional dependencies

	// Memoize and return the motion values for x and y coordinates
	return useMemo(
		() => ({
			x, // Motion value for x coordinate
			y, // Motion value for y coordinate
		}),
		[x, y], // Dependencies for the memoized return value
	);
}

export { Dock, DockCard, DockCardInner, DockDivider, useDock };
