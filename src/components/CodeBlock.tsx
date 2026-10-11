export default function CodeBlock({
  filename,
  children,
}: {
  filename: string;
  children: string;
}) {
  return (
    <div className="code-window">
      <div className="code-window-header">
        <div className="dot dot-red" />
        <div className="dot dot-yellow" />
        <div className="dot dot-green" />
        {filename && <span className="code-filename">{filename}</span>}
      </div>
      <div className="code-body">
        <pre>{children}</pre>
      </div>
    </div>
  );
}
