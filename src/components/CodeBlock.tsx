import { useState } from "react";
import { highlight } from "#/lib/highlight";

export default function CodeBlock({
	filename,
	children,
}: {
	filename: string;
	children: string;
}) {
	const [copied, setCopied] = useState(false);
	const lang = filename === "terminal" ? "bash" : "ts";

	const copy = async () => {
		await navigator.clipboard.writeText(children);
		setCopied(true);
		setTimeout(() => setCopied(false), 1500);
	};

	return (
		<div className="code-window">
			<div className="code-window-header">
				<div className="dot dot-red" />
				<div className="dot dot-yellow" />
				<div className="dot dot-green" />
				{filename && <span className="code-filename">{filename}</span>}
				<button
					type="button"
					className={`copy-btn code-copy${copied ? " copied" : ""}`}
					onClick={copy}
				>
					{copied ? "copied" : "copy"}
				</button>
			</div>
			<div className="code-body">
				<pre>{highlight(children, lang)}</pre>
			</div>
		</div>
	);
}
