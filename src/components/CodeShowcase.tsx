import { useState } from "react";

/* ── Syntax-highlighted snippets ── */
const BASIC_CODE = (
  <>
    <span className="t-kw">import</span>{" "}{"{ "}<span className="t-cls">Controller</span>,{" "}
    <span className="t-cls">Get</span>, <span className="t-cls">Post</span>,{" "}
    <span className="t-cls">Public</span>, <span className="t-cls">Injectable</span>{"}"}
    {"\n"}<span className="t-kw">from</span> <span className="t-str">'@/decorators'</span>;{"\n\n"}
    <span className="t-dec">@Controller</span>(<span className="t-str">'/users'</span>, {"{"} platform: <span className="t-str">'web'</span>, version: <span className="t-str">'v1'</span> {"}"}){"\n"}
    <span className="t-dec">@Injectable</span>(){"\n"}
    <span className="t-kw">export class</span> <span className="t-cls">UserController</span> {"{"}{"\n"}
    {"  "}constructor({"\n"}
    {"    "}<span className="t-kw">private readonly</span> userService: <span className="t-cls">UserService</span>{"\n"}
    {"  "}) {"{}"}{"\n\n"}
    {"  "}<span className="t-dec">@Get</span>(){"\n"}
    {"  "}<span className="t-dec">@Public</span>(){"\n"}
    {"  "}<span className="t-dec">@Cache</span>({"{"} ttl: <span className="t-num">60</span> {"}"}){"\n"}
    {"  "}<span className="t-kw">async</span> <span className="t-fn">getAll</span>() {"{"}{"\n"}
    {"    "}<span className="t-kw">return</span> this.userService.<span className="t-fn">getAll</span>();{"\n"}
    {"  "}{"}"}{"\n\n"}
    {"  "}<span className="t-dec">@Post</span>(){"\n"}
    {"  "}<span className="t-dec">@RequireAuth</span>(){"\n"}
    {"  "}<span className="t-kw">async</span> <span className="t-fn">create</span>({"\n"}
    {"    "}<span className="t-dec">@ValidatedBody</span>(<span className="t-cls">CreateUserSchema</span>){"\n"}
    {"    "}dto: <span className="t-cls">CreateUserDto</span>{"\n"}
    {"  "}) {"{"}{"\n"}
    {"    "}<span className="t-kw">return</span> this.userService.<span className="t-fn">create</span>(dto);{"\n"}
    {"  "}{"}"}{"\n"}
    {"}"}
  </>
);

const AUTH_CODE = (
  <>
    <span className="t-dec">@Controller</span>(<span className="t-str">'/admin'</span>, {"{"} platform: <span className="t-str">'web'</span>, version: <span className="t-str">'v1'</span> {"}"}){"\n"}
    <span className="t-dec">@Injectable</span>(){"\n"}
    <span className="t-kw">export class</span> <span className="t-cls">AdminController</span> {"{"}{"\n\n"}
    {"  "}<span className="t-cmt">// Require authentication only</span>{"\n"}
    {"  "}<span className="t-dec">@Get</span>(<span className="t-str">'/dashboard'</span>){"\n"}
    {"  "}<span className="t-dec">@RequireAuth</span>(){"\n"}
    {"  "}<span className="t-kw">async</span> <span className="t-fn">dashboard</span>(<span className="t-dec">@User</span>() user: <span className="t-cls">AuthUser</span>) {"{"}{"\n"}
    {"    "}<span className="t-kw">return</span> {"{"} message: <span className="t-str">`Welcome ${"${user.name}"}`</span> {"}"};{"\n"}
    {"  "}{"}"}{"\n\n"}
    {"  "}<span className="t-cmt">// Require specific role</span>{"\n"}
    {"  "}<span className="t-dec">@Delete</span>(<span className="t-str">'/users/:id'</span>){"\n"}
    {"  "}<span className="t-dec">@RequireRole</span>(<span className="t-str">'admin'</span>){"\n"}
    {"  "}<span className="t-kw">async</span> <span className="t-fn">deleteUser</span>({"\n"}
    {"    "}<span className="t-dec">@ValidatedParam</span>(<span className="t-str">'id'</span>, z.string().uuid()){"\n"}
    {"    "}id: <span className="t-kw">string</span>{"\n"}
    {"  "}) {"{"}{"\n"}
    {"    "}<span className="t-kw">return</span> this.userService.<span className="t-fn">delete</span>(id);{"\n"}
    {"  "}{"}"}{"\n\n"}
    {"  "}<span className="t-cmt">// Strict rate limit</span>{"\n"}
    {"  "}<span className="t-dec">@Post</span>(<span className="t-str">'/login'</span>){"\n"}
    {"  "}<span className="t-dec">@RateLimit</span>({"{"} max: <span className="t-num">5</span>, windowMs: <span className="t-num">15</span> * <span className="t-num">60_000</span> {"}"}){"\n"}
    {"  "}<span className="t-kw">async</span> <span className="t-fn">login</span>(<span className="t-dec">@ValidatedBody</span>(<span className="t-cls">LoginSchema</span>) dto) {"{"}{"\n"}
    {"    "}<span className="t-kw">return</span> this.authService.<span className="t-fn">login</span>(dto);{"\n"}
    {"  "}{"}"}{"\n"}
    {"}"}
  </>
);

const FULL_CODE = (
  <>
    <span className="t-dec">@Controller</span>(<span className="t-str">'/users'</span>, {"{"} platform: <span className="t-str">'web'</span>, version: <span className="t-str">'v1'</span> {"}"}){"\n"}
    <span className="t-dec">@ApiTags</span>(<span className="t-str">'users'</span>){"\n"}
    <span className="t-dec">@Injectable</span>(){"\n"}
    <span className="t-kw">export class</span> <span className="t-cls">UserController</span> {"{"}{"\n\n"}
    {"  "}<span className="t-dec">@Post</span>(){"\n"}
    {"  "}<span className="t-dec">@RequireAuth</span>(){"\n"}
    {"  "}<span className="t-dec">@RateLimit</span>({"{"} max: <span className="t-num">10</span>, windowMs: <span className="t-num">60_000</span> {"}"}){"\n"}
    {"  "}<span className="t-dec">@LogActivity</span>(<span className="t-str">'USER_CREATED'</span>, {"{"} includeBody: <span className="t-kw">true</span> {"}"}){"\n"}
    {"  "}<span className="t-dec">@TrackMetrics</span>({"{"} name: <span className="t-str">'user_creation'</span> {"}"}){"\n"}
    {"  "}<span className="t-dec">@ApiDoc</span>({"{"} summary: <span className="t-str">'Create new user'</span> {"}"}){"\n"}
    {"  "}<span className="t-dec">@ApiResponse</span>(<span className="t-num">201</span>, <span className="t-str">'User created'</span>){"\n"}
    {"  "}<span className="t-dec">@ApiResponse</span>(<span className="t-num">400</span>, <span className="t-str">'Validation failed'</span>){"\n"}
    {"  "}<span className="t-kw">async</span> <span className="t-fn">create</span>({"\n"}
    {"    "}<span className="t-dec">@ValidatedBody</span>(<span className="t-cls">CreateUserSchema</span>) dto: <span className="t-cls">CreateUserDto</span>,{"\n"}
    {"    "}<span className="t-dec">@User</span>() currentUser: <span className="t-cls">AuthUser</span>{"\n"}
    {"  "}) {"{"}{"\n"}
    {"    "}this.logger.<span className="t-fn">info</span>({"{"} userId: currentUser.id {"}"}, <span className="t-str">'Creating user'</span>);{"\n"}
    {"    "}<span className="t-kw">return</span> this.userService.<span className="t-fn">create</span>(dto, currentUser);{"\n"}
    {"  "}{"}"}{"\n\n"}
    {"  "}<span className="t-dec">@Delete</span>(<span className="t-str">':id'</span>){"\n"}
    {"  "}<span className="t-dec">@RequireRole</span>(<span className="t-str">'admin'</span>){"\n"}
    {"  "}<span className="t-dec">@LogActivity</span>(<span className="t-str">'USER_DELETED'</span>){"\n"}
    {"  "}<span className="t-dec">@TrackMetrics</span>(){"\n"}
    {"  "}<span className="t-kw">async</span> <span className="t-fn">delete</span>({"\n"}
    {"    "}<span className="t-dec">@ValidatedParam</span>(<span className="t-str">'id'</span>, z.string().uuid()) id: <span className="t-kw">string</span>,{"\n"}
    {"    "}<span className="t-dec">@User</span>() currentUser: <span className="t-cls">AuthUser</span>{"\n"}
    {"  "}) {"{"}{"\n"}
    {"    "}<span className="t-kw">await</span> this.userService.<span className="t-fn">delete</span>(id, currentUser);{"\n"}
    {"    "}<span className="t-kw">return</span> {"{"} message: <span className="t-str">'User deleted successfully'</span> {"}"};{"\n"}
    {"  "}{"}"}{"\n"}
    {"}"}
  </>
);

const TABS = [
  { id: "basic", label: "basic",        code: BASIC_CODE },
  { id: "auth",  label: "auth",         code: AUTH_CODE  },
  { id: "full",  label: "full example", code: FULL_CODE  },
];

/* ── Reusable code window ── */
function CodeWindow({ filename, children, tabs, activeTab, onTabChange }: any) {
  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-border2)] rounded-[6px] overflow-hidden">
      {/* Window chrome */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-[var(--color-surface2)] border-b border-[var(--color-border)]">
        <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
        <span className="font-[family-name:var(--font-mono)] text-[0.7rem] text-[var(--color-muted)] ml-2">
          {filename}
        </span>
      </div>

      {/* Tabs */}
      {tabs && (
        <div className="flex border-b border-[var(--color-border)]">
          {tabs.map((t: any) => (
            <button
              key={t.id}
              onClick={() => onTabChange(t.id)}
              className={`font-[family-name:var(--font-mono)] text-[0.7rem] tracking-[0.03em]
                          px-4 py-2.5 border-b-2 transition-all duration-150 cursor-pointer
                          bg-transparent
                          ${
                            activeTab === t.id
                              ? "text-[var(--color-accent)] border-[var(--color-accent)]"
                              : "text-[var(--color-muted)] border-transparent hover:text-[var(--color-text)]"
                          }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      )}

      {/* Code body */}
      <div className="p-6 overflow-x-auto">
        <pre className="font-[family-name:var(--font-mono)] text-[0.76rem] leading-[1.85] text-[var(--color-text)]">
          {children}
        </pre>
      </div>
    </div>
  );
}

export default function CodeShowcase() {
  const [activeTab, setActiveTab] = useState("basic");
  const activeCode = TABS.find((t) => t.id === activeTab)?.code;

  return (
    <section id="usage" className="max-w-[1100px] mx-auto px-6 py-20">
      {/* Header */}
      <p className="font-[family-name:var(--font-mono)] text-[0.68rem] uppercase tracking-[0.15em] text-[var(--color-accent)] mb-3">
        quick start
      </p>
      <h2
        className="font-[family-name:var(--font-sans)] font-extrabold tracking-[-0.02em]
                   text-[clamp(1.8rem,3vw,2.6rem)] mb-3"
      >
        From zero to API
        <br />
        in minutes.
      </h2>
      <p
        className="font-[family-name:var(--font-mono)] text-[0.83rem] text-[var(--color-muted)]
                   leading-[1.7] max-w-[440px] mb-12"
      >
        Scaffold, code, run. The template handles all the infrastructure so
        you don't have to.
      </p>

      {/* Two-col layout */}
      <div className="reveal grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-10 items-start">
        {/* Left: terminal steps */}
        <div className="flex flex-col gap-6">
          <div>
            <h3 className="font-[family-name:var(--font-sans)] text-[0.93rem] font-bold mb-3">
              1. Create project
            </h3>
            <CodeWindow filename="terminal">
              {`$ `}<span className="t-dec">bun create hono-decorator@latest</span>{` my-app\n\n$ cd my-app && bun install\n\n$ cp .env.example .env\n\n$ bun run db:migrate\n\n$ bun run dev\n`}
              <span className="t-cmt"># → http://localhost:3000</span>
            </CodeWindow>
          </div>

          <div>
            <h3 className="font-[family-name:var(--font-sans)] text-[0.93rem] font-bold mb-3">
              2. Test it
            </h3>
            <CodeWindow filename="terminal">
              <span className="t-dec">$</span>{` curl localhost:3000/health\n`}
              <span className="t-cmt"># → {"{ \"status\": \"ok\" }"}</span>
              {"\n\n"}
              <span className="t-dec">$</span>{` curl localhost:3000/api/web/v1/users\n`}
              <span className="t-cmt"># → {"{ \"data\": [], \"total\": 0 }"}</span>
            </CodeWindow>
          </div>
        </div>

        {/* Right: controller code tabs */}
        <div>
          <h3 className="font-[family-name:var(--font-sans)] text-[0.93rem] font-bold mb-3">
            3. Write your controller
          </h3>
          <CodeWindow
            filename="user.controller.ts"
            tabs={TABS}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          >
            {activeCode}
          </CodeWindow>
        </div>
      </div>
    </section>
  );
}
