import type { ReactNode } from "react";

/**
 * Lightweight tokenizer — maps code to the .t-* token classes in styles.css.
 * Groups (in alternation order):
 *   1 line comment · 2 block comment · 3-5 strings · 6 decorator
 *   7 keyword · 8 number · 9 TypeIdent · 10 call ident
 */
const TS_RE =
	/(\/\/[^\n]*)|(\/\*[\s\S]*?\*\/)|(`(?:[^`\\]|\\.)*`)|('(?:[^'\\]|\\.)*')|("(?:[^"\\]|\\.)*")|(@[A-Za-z_]\w*)|\b(import|from|export|default|class|extends|implements|interface|type|const|let|var|function|return|await|async|new|if|else|for|while|of|in|try|catch|finally|throw|switch|case|break|continue|static|readonly|private|public|protected|null|undefined|true|false|void|this|as)\b|\b(\d[\d_]*(?:\.\d+)?)\b|([A-Z][A-Za-z0-9_]*)|([a-z_$][\w$]*)(?=\s*\()/g;

const TS_CLS = [
	"",
	"t-cmt",
	"t-cmt",
	"t-str",
	"t-str",
	"t-str",
	"t-dec",
	"t-kw",
	"t-num",
	"t-cls",
	"t-fn",
];

/**
 * Shell tokenizer — 1 comment · 2-3 strings · 4 flag · 5 number · 6 command · 7 $ prompt
 */
const BASH_RE =
	/(#[^\n]*)|('(?:[^'\\]|\\.)*')|("(?:[^"\\]|\\.)*")|((?<![\w-])--?[A-Za-z][\w-]*)|\b(\d+(?:\.\d+)*)\b|\b(bunx?|npm|npx|pnpm|yarn|cd|node|docker|git|curl|echo)\b|(^[ \t]*\$)/gm;

const BASH_CLS = [
	"",
	"t-cmt",
	"t-str",
	"t-str",
	"t-typ",
	"t-num",
	"t-fn",
	"t-dec",
];

export type CodeLang = "ts" | "bash";

export function highlight(code: string, lang: CodeLang = "ts"): ReactNode[] {
	const re = lang === "bash" ? BASH_RE : TS_RE;
	const classes = lang === "bash" ? BASH_CLS : TS_CLS;
	re.lastIndex = 0;

	const out: ReactNode[] = [];
	let last = 0;
	let k = 0;

	for (const m of code.matchAll(re)) {
		const idx = m.index;
		if (idx > last) out.push(code.slice(last, idx));

		let cls = "t-mut";
		for (let g = 1; g < m.length; g++) {
			if (m[g] !== undefined) {
				cls = classes[g] ?? "t-mut";
				break;
			}
		}

		out.push(
			<span key={k++} className={cls}>
				{m[0]}
			</span>,
		);
		last = idx + m[0].length;
	}

	if (last < code.length) out.push(code.slice(last));
	return out;
}
