import React, { useEffect, useMemo, useRef, useState } from "react";

const API_ENDPOINT = "http://localhost:5001/shorten";

const isValidUrl = (value) => {
	try {
		const u = new URL(value);
		return u.protocol === "http:" || u.protocol === "https:";
	} catch {
		return false;
	}
};

const Home = () => {
	const [url, setUrl] = useState("");
	const [shortUrl, setShortUrl] = useState("");
	const [loading, setLoading] = useState(false);
	const [touched, setTouched] = useState(false);
	const [error, setError] = useState("");
	const [copied, setCopied] = useState(false);

	const inputRef = useRef(null);
	const announceRef = useRef(null);

	useEffect(() => {
		// Autofocus on load for quick UX
		inputRef.current?.focus();
	}, []);

	const disabled = useMemo(() => loading || !isValidUrl(url), [loading, url]);

	const onSubmit = async (e) => {
		e.preventDefault();
		setTouched(true);
		setCopied(false);
		setShortUrl("");
		if (!isValidUrl(url)) {
			setError("Enter a valid URL starting with http(s)://");
			return;
		}
		setError("");
		setLoading(true);
		try {
			const res = await fetch(API_ENDPOINT, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					// Include auth headers here if needed, e.g. Authorization: `Bearer ${token}`
				},
				body: JSON.stringify({ longUrl: url }),
				// credentials: "include", // uncomment if server uses cookies
			});
			if (!res.ok) throw new Error(`Failed to shorten URL (${res.status})`);
			const data = await res.json();

			// Prefer backend's canonical field, with safe fallbacks:
			const result =
				data?.shortUrl || // e.g., { shortUrl: "https://ask.ly/abcd" }
				data?.result?.shortUrl ||
				data?.result?.full_short_link ||
				data?.result?.short_link ||
				data?.link ||
				"";

			if (!result) throw new Error("No short URL returned");
			setShortUrl(result);
			announceRef.current.textContent = "URL shortened successfully";
		} catch (err) {
			console.log(err);
			setError("Could not shorten the URL. Try again.");
			announceRef.current.textContent = "Error: could not shorten the URL";
		} finally {
			setLoading(false);
		}
	};

	const onCopy = async () => {
		if (!shortUrl) return;
		try {
			await navigator.clipboard.writeText(shortUrl);
			setCopied(true);
			announceRef.current.textContent = "Short URL copied to clipboard";
			setTimeout(() => setCopied(false), 1600);
		} catch {
			announceRef.current.textContent = "Copy failed";
		}
	};

	return (
		<main
			style={{
				minHeight: "calc(100vh - 56px)",
				display: "grid",
				placeItems: "center",
				padding: "2rem 1rem",
				background: "linear-gradient(135deg, rgba(124,58,237,0.08), rgba(37,99,235,0.08))",
			}}
		>
			{/* Live announcements for screen readers */}
			<div
				aria-live="polite"
				aria-atomic="true"
				style={{
					position: "absolute",
					width: 1,
					height: 1,
					padding: 0,
					margin: -1,
					overflow: "hidden",
					clip: "rect(0,0,0,0)",
					whiteSpace: "nowrap",
					border: 0,
				}}
				ref={announceRef}
			/>

			<section
				aria-labelledby="shortener-title"
				style={{
					width: "100%",
					maxWidth: 720,
					background: "rgba(255,255,255,0.75)",
					backdropFilter: "blur(10px)",
					border: "1px solid rgba(0,0,0,0.06)",
					borderRadius: 16,
					boxShadow: "0 12px 30px rgba(37,99,235,0.15)",
					padding: "1.5rem",
					transform: "translateY(0)",
					transition: "transform 400ms cubic-bezier(.2,.8,.2,1)",
					animation: "card-in 480ms cubic-bezier(.2,.8,.2,1) both",
				}}
			>
				<h1
					id="shortener-title"
					style={{
						fontSize: "1.5rem",
						lineHeight: 1.2,
						marginBottom: "1rem",
						fontWeight: 800,
						color: "#111827",
					}}
					className="dark:text-white"
				>
					Shorten a long URL
				</h1>

				<form onSubmit={onSubmit} noValidate>
					<label
						htmlFor="url-input"
						style={{
							display: "block",
							fontSize: 14,
							fontWeight: 600,
							color: "#374151",
							marginBottom: 8,
						}}
						className="dark:text-gray-200"
					>
						Enter the destination link
					</label>
					<div
						style={{
							display: "grid",
							gridTemplateColumns: "1fr auto",
							gap: 8,
							alignItems: "center",
						}}
					>
						<input
							ref={inputRef}
							id="url-input"
							type="url"
							inputMode="url"
							placeholder="https://example.com/very/long/link"
							value={url}
							onChange={(e) => setUrl(e.target.value)}
							onBlur={() => setTouched(true)}
							aria-invalid={touched && !isValidUrl(url)}
							aria-describedby="url-hint url-error"
							style={{
								width: "100%",
								padding: "0.85rem 0.9rem",
								borderRadius: 12,
								border: "1px solid rgba(0,0,0,0.12)",
								outline: "none",
								background: "white",
								color: "#111827",
								transition: "box-shadow 200ms, transform 200ms",
								boxShadow: touched && !isValidUrl(url) ? "0 0 0 3px rgba(220,38,38,0.25)" : "0 1px 0 rgba(0,0,0,0.02)",
							}}
							className="focus-visible:outline-2 focus-visible:outline-indigo-500 dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700"
						/>
						<button
							type="submit"
							disabled={disabled}
							style={{
								padding: "0.85rem 1rem",
								borderRadius: 12,
								border: "1px solid rgba(0,0,0,0.06)",
								fontWeight: 700,
								color: "white",
								background: disabled
									? "linear-gradient(135deg, #9CA3AF, #6B7280)"
									: "linear-gradient(135deg, #7C3AED 0%, #2563EB 100%)",
								boxShadow: disabled ? "none" : "0 10px 24px rgba(37,99,235,0.35)",
								transform: loading ? "translateY(1px)" : "translateY(0)",
								transition: "transform 150ms, box-shadow 200ms, filter 200ms, opacity 200ms",
								cursor: disabled ? "not-allowed" : "pointer",
								opacity: disabled ? 0.9 : 1,
							}}
							className="hover:brightness-110 active:translate-y-[2px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-500"
						>
							{loading ? "Shortening..." : "Shorten"}
						</button>
					</div>
					<div id="url-hint" style={{ fontSize: 12, color: "#6B7280", marginTop: 6 }} className="dark:text-gray-400">
						Include http:// or https:// in the URL. Example: https://example.com [not a real link]
					</div>
					{touched && error ? (
						<p
							id="url-error"
							role="alert"
							style={{
								marginTop: 8,
								fontSize: 13,
								color: "#DC2626",
								fontWeight: 600,
								animation: "shake 240ms ease-in-out",
							}}
						>
							{error}
						</p>
					) : (
						<span id="url-error" hidden />
					)}
				</form>

				{/* Result */}
				<div
					aria-live="polite"
					style={{
						marginTop: 16,
						minHeight: 44,
					}}
				>
					{shortUrl && !loading ? (
						<div
							style={{
								display: "grid",
								gridTemplateColumns: "1fr auto",
								gap: 8,
								alignItems: "center",
								padding: "0.75rem",
								background: "rgba(16,185,129,0.08)",
								border: "1px solid rgba(16,185,129,0.35)",
								borderRadius: 12,
								transform: "translateY(0)",
								animation: "fade-in-up 360ms cubic-bezier(.2,.8,.2,1) both",
							}}
						>
							<a
								href={shortUrl}
								target="_blank"
								rel="noopener noreferrer"
								style={{
									fontWeight: 700,
									color: "#065F46",
									textDecoration: "none",
									overflowWrap: "anywhere",
								}}
							>
								{shortUrl}
							</a>
							<button
								type="button"
								onClick={onCopy}
								style={{
									padding: "0.6rem 0.8rem",
									borderRadius: 10,
									fontWeight: 700,
									color: copied ? "white" : "#065F46",
									background: copied ? "linear-gradient(135deg, #10B981, #059669)" : "transparent",
									border: "1px solid rgba(16,185,129,0.35)",
									transition: "all 220ms ease",
								}}
								className="hover:bg-emerald-100 dark:hover:bg-emerald-900/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500"
							>
								{copied ? "Copied ✓" : "Copy"}
							</button>
						</div>
					) : loading ? (
						<div
							style={{
								height: 44,
								display: "grid",
								placeItems: "center",
								color: "#6B7280",
								fontSize: 14,
								animation: "pulse 1200ms ease-in-out infinite",
							}}
						>
							Generating short link…
						</div>
					) : null}
				</div>
			</section>

			{/* Page animations */}
			<style>{`
        @keyframes card-in {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        @keyframes shake {
          0% { transform: translateX(0); }
          25% { transform: translateX(-3px); }
          50% { transform: translateX(3px); }
          75% { transform: translateX(-2px); }
          100% { transform: translateX(0); }
        }
      `}</style>
		</main>
	);
};

export default Home;
