"use client";

import { motion, useReducedMotion } from "framer-motion";

const speedLanes = [
	{ delay: 0, duration: 3.8, top: "16%", width: "34rem" },
	{ delay: 0.45, duration: 4.4, top: "29%", width: "42rem" },
	{ delay: 0.15, duration: 3.4, top: "48%", width: "30rem" },
	{ delay: 0.72, duration: 4.9, top: "66%", width: "46rem" },
	{ delay: 0.28, duration: 4.1, top: "82%", width: "36rem" },
];

const pulseNodes = [
	{ delay: 0.1, left: "18%", top: "22%" },
	{ delay: 0.45, left: "76%", top: "31%" },
	{ delay: 0.25, left: "56%", top: "58%" },
	{ delay: 0.7, left: "28%", top: "76%" },
];

const scanColumns = [
	{ delay: 0, left: "12%" },
	{ delay: 0.8, left: "47%" },
	{ delay: 0.35, left: "82%" },
];

export function RacingMotionLayer() {
	const reduceMotion = useReducedMotion();

	if (reduceMotion) {
		return null;
	}

	return (
		<div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
			<div className="absolute inset-0 bg-track-radial opacity-25" />
			{/* <div className="absolute inset-0 opacity-[0.13] [background-size:56px_56px]" /> */}

			{speedLanes.map((lane, index) => (
				<motion.span
					key={`lane-${index}`}
					className="absolute left-[-45%] h-px -skew-x-12 bg-gradient-to-r from-transparent via-cyan-racing/45 to-transparent"
					style={{ top: lane.top, width: lane.width }}
					animate={{ x: ["0vw", "170vw"], opacity: [0, 0.7, 0] }}
					transition={{
						delay: lane.delay,
						duration: lane.duration,
						ease: "easeInOut",
						repeat: Infinity,
						repeatDelay: 0.6,
					}}
				/>
			))}

			{scanColumns.map((column, index) => (
				<motion.span
					key={`scan-${index}`}
					className="absolute top-[-18%] h-48 w-px bg-gradient-to-b from-transparent via-orange-racing/24 to-transparent"
					style={{ left: column.left }}
					animate={{ y: ["0vh", "135vh"], opacity: [0, 0.65, 0] }}
					transition={{
						delay: column.delay,
						duration: 5.6,
						ease: "linear",
						repeat: Infinity,
						repeatDelay: 1,
					}}
				/>
			))}

			{pulseNodes.map((node, index) => (
				<motion.span
					key={`pulse-${index}`}
					className="absolute h-2 w-2 rounded-full border border-cyan-racing/40 bg-cyan-racing/60 shadow-glow"
					style={{ left: node.left, top: node.top }}
					animate={{
						boxShadow: ["0 0 0 rgba(32,247,255,0)", "0 0 34px rgba(32,247,255,0.28)", "0 0 0 rgba(32,247,255,0)"],
						opacity: [0.18, 0.85, 0.18],
						scale: [0.72, 1.25, 0.72],
					}}
					transition={{
						delay: node.delay,
						duration: 2.4,
						ease: "easeInOut",
						repeat: Infinity,
					}}
				/>
			))}

			<motion.div
				className="absolute inset-x-[-20%] bottom-[12%] h-px rotate-[-8deg] bg-gradient-to-r from-transparent via-violet-racing/22 to-transparent"
				animate={{ opacity: [0.18, 0.55, 0.18], x: ["-4%", "4%", "-4%"] }}
				transition={{ duration: 6.5, ease: "easeInOut", repeat: Infinity }}
			/>
		</div>
	);
}
