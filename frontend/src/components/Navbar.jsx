import React, { useEffect, useState } from "react";

/**
 * ASK — URL Shortner
 * - Only logo is shown on all sizes
 * - Mobile menu button and drawer are removed
 * - Desktop issues resolved by using a simple, centered/sticky header
 */

const Navbar = () => {
	// Optional: keep dark-mode pref if desired in the future
	const [dark, setDark] = useState(false);

	useEffect(() => {
		const saved = localStorage.getItem("ask_dark_mode");
		if (saved) {
			const v = saved === "true";
			setDark(v);
			document.body.classList.toggle("dark", v);
		}
	}, []);

	useEffect(() => {
		document.body.classList.toggle("dark", dark);
		localStorage.setItem("ask_dark_mode", String(dark));
	}, [dark]);

	return (
		<header
			style={{
				position: "sticky",
				top: 0,
				zIndex: 50,
				backdropFilter: "saturate(180%) blur(8px)",
				background: "rgba(255,255,255,0.75)",
				borderBottom: "1px solid rgba(0,0,0,0.06)",
			}}
			className="dark:bg-[rgba(17,24,39,0.75)] dark:border-gray-800"
		>
			<nav
				aria-label="Primary"
				style={{
					maxWidth: 1200,
					margin: "0 auto",
					padding: "0.75rem 1rem",
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					gap: "0.75rem",
					minHeight: 56,
				}}
			>
				{/* Brand (only element kept) */}
				<a
					href="#top"
					aria-label="ASK URL Shortner home"
					style={{
						display: "inline-flex",
						alignItems: "center",
						gap: "0.5rem",
						textDecoration: "none",
					}}
				>
					<div
						aria-hidden
						style={{
							width: 32,
							height: 32,
							borderRadius: 8,
							background: "linear-gradient(135deg, #6D28D9 0%, #22D3EE 100%)",
							boxShadow: "0 6px 18px rgba(109,40,217,0.35)",
						}}
					/>
					<div style={{ lineHeight: 1 }}>
						<span
							style={{
								fontWeight: 800,
								fontSize: "1.125rem",
								color: "#111827",
							}}
							className="dark:text-white"
						>
							ASK
						</span>
						<span
							style={{
								marginLeft: 8,
								fontWeight: 500,
								fontSize: "0.95rem",
								color: "#6B7280",
							}}
							className="dark:text-gray-300"
						>
							URL Shortner
						</span>
					</div>
				</a>

				{/* Optional: small dark mode toggle (remove if not needed) */}
				<button
					type="button"
					aria-label="Toggle dark mode"
					onClick={() => setDark((v) => !v)}
					style={{
						border: "1px solid rgba(0,0,0,0.08)",
						padding: "0.45rem 0.6rem",
						borderRadius: 10,
						background: "white",
						color: "#111827",
						lineHeight: 1,
					}}
					className="hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700 dark:hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-500"
				>
					{dark ? "🌙" : "☀️"}
				</button>
			</nav>
		</header>
	);
};

export default Navbar;
