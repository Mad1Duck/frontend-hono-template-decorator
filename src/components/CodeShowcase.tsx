import { useState } from 'react'

const BASIC_CODE = (
  <>
    <span className="t-kw">import</span>{' '}{'{ '}<span className="t-cls">Controller</span>, <span className="t-cls">Get</span>, <span className="t-cls">Post</span>,{'\n'}
    {'       '}<span className="t-cls">Public</span>, <span className="t-cls">Injectable</span>{' '}{'}'}{'\n'}
    <span className="t-kw">from</span> <span className="t-str">'@/decorators'</span>;{'\n\n'}
    <span className="t-dec">@Controller</span>(<span className="t-str">'/users'</span>, {'{'} platform: <span className="t-str">'web'</span>, version: <span className="t-str">'v1'</span> {'}'}){'\n'}
    <span className="t-dec">@Injectable</span>(){'\n'}
    <span className="t-kw">export class</span> <span className="t-cls">UserController</span> {'{'}{'\n'}
    {'  '}constructor({'\n'}
    {'    '}<span className="t-kw">private readonly</span> userService: <span className="t-cls">UserService</span>{'\n'}
    {'  '}) {'{}'}{'\n\n'}
    {'  '}<span className="t-dec">@Get</span>(){'\n'}
    {'  '}<span className="t-dec">@Public</span>(){'\n'}
    {'  '}<span className="t-dec">@Cache</span>({'{'} ttl: <span className="t-num">60</span> {'}'}){'\n'}
    {'  '}<span className="t-kw">async</span> <span className="t-fn">getAll</span>() {'{'}{'\n'}
    {'    '}<span className="t-kw">return</span> this.userService.<span className="t-fn">getAll</span>();{'\n'}
    {'  '}{'}'}{'\n\n'}
    {'  '}<span className="t-dec">@Post</span>(){'\n'}
    {'  '}<span className="t-dec">@RequireAuth</span>(){'\n'}
    {'  '}<span className="t-kw">async</span> <span className="t-fn">create</span>({'\n'}
    {'    '}<span className="t-dec">@ValidatedBody</span>(<span className="t-cls">CreateUserSchema</span>){'\n'}
    {'    '}dto: <span className="t-cls">CreateUserDto</span>{'\n'}
    {'  '}) {'{'}{'\n'}
    {'    '}<span className="t-kw">return</span> this.userService.<span className="t-fn">create</span>(dto);{'\n'}
    {'  '}{'}'}{'\n'}
    {'}'}
  </>
)

const AUTH_CODE = (
  <>
    <span className="t-dec">@Controller</span>(<span className="t-str">'/admin'</span>, {'{'} platform: <span className="t-str">'web'</span>, version: <span className="t-str">'v1'</span> {'}'}){'\n'}
    <span className="t-dec">@Injectable</span>(){'\n'}
    <span className="t-kw">export class</span> <span className="t-cls">AdminController</span> {'{'}{'\n\n'}
    {'  '}<span className="t-cmt">// Require authentication only</span>{'\n'}
    {'  '}<span className="t-dec">@Get</span>(<span className="t-str">'/dashboard'</span>){'\n'}
    {'  '}<span className="t-dec">@RequireAuth</span>(){'\n'}
    {'  '}<span className="t-kw">async</span> <span className="t-fn">dashboard</span>(<span className="t-dec">@User</span>() user: <span className="t-cls">AuthUser</span>) {'{'}{'\n'}
    {'    '}<span className="t-kw">return</span> {'{'} message: <span className="t-str">{"`Welcome ${'{'}user.name{'}'}`"}</span> {'}'};{'\n'}
    {'  '}{'}'}{'\n\n'}
    {'  '}<span className="t-cmt">// Require specific role</span>{'\n'}
    {'  '}<span className="t-dec">@Delete</span>(<span className="t-str">'/users/:id'</span>){'\n'}
    {'  '}<span className="t-dec">@RequireRole</span>(<span className="t-str">'admin'</span>){'\n'}
    {'  '}<span className="t-kw">async</span> <span className="t-fn">deleteUser</span>({'\n'}
    {'    '}<span className="t-dec">@ValidatedParam</span>(<span className="t-str">'id'</span>, z.string().uuid()){'\n'}
    {'    '}id: <span className="t-kw">string</span>{'\n'}
    {'  '}) {'{'}{'\n'}
    {'    '}<span className="t-kw">return</span> this.userService.<span className="t-fn">delete</span>(id);{'\n'}
    {'  '}{'}'}{'\n\n'}
    {'  '}<span className="t-cmt">// Strict rate limit</span>{'\n'}
    {'  '}<span className="t-dec">@Post</span>(<span className="t-str">'/login'</span>){'\n'}
    {'  '}<span className="t-dec">@RateLimit</span>({'{'} max: <span className="t-num">5</span>, windowMs: <span className="t-num">15</span> * <span className="t-num">60_000</span> {'}'}){'\n'}
    {'  '}<span className="t-kw">async</span> <span className="t-fn">login</span>(<span className="t-dec">@ValidatedBody</span>(<span className="t-cls">LoginSchema</span>) dto) {'{'}{'\n'}
    {'    '}<span className="t-kw">return</span> this.authService.<span className="t-fn">login</span>(dto);{'\n'}
    {'  '}{'}'}{'\n'}
    {'}'}
  </>
)

const FULL_CODE = (
  <>
    <span className="t-dec">@Controller</span>(<span className="t-str">'/users'</span>, {'{'} platform: <span className="t-str">'web'</span>, version: <span className="t-str">'v1'</span> {'}'}){'\n'}
    <span className="t-dec">@ApiTags</span>(<span className="t-str">'users'</span>){'\n'}
    <span className="t-dec">@Injectable</span>(){'\n'}
    <span className="t-kw">export class</span> <span className="t-cls">UserController</span> {'{'}{'\n\n'}
    {'  '}<span className="t-dec">@Post</span>(){'\n'}
    {'  '}<span className="t-dec">@RequireAuth</span>(){'\n'}
    {'  '}<span className="t-dec">@RateLimit</span>({'{'} max: <span className="t-num">10</span>, windowMs: <span className="t-num">60_000</span> {'}'}){'\n'}
    {'  '}<span className="t-dec">@LogActivity</span>(<span className="t-str">'USER_CREATED'</span>, {'{'} includeBody: <span className="t-kw">true</span> {'}'}){'\n'}
    {'  '}<span className="t-dec">@TrackMetrics</span>({'{'} name: <span className="t-str">'user_creation'</span> {'}'}){'\n'}
    {'  '}<span className="t-dec">@ApiDoc</span>({'{'} summary: <span className="t-str">'Create new user'</span> {'}'}){'\n'}
    {'  '}<span className="t-dec">@ApiResponse</span>(<span className="t-num">201</span>, <span className="t-str">'User created'</span>){'\n'}
    {'  '}<span className="t-dec">@ApiResponse</span>(<span className="t-num">400</span>, <span className="t-str">'Validation failed'</span>){'\n'}
    {'  '}<span className="t-kw">async</span> <span className="t-fn">create</span>({'\n'}
    {'    '}<span className="t-dec">@ValidatedBody</span>(<span className="t-cls">CreateUserSchema</span>) dto: <span className="t-cls">CreateUserDto</span>,{'\n'}
    {'    '}<span className="t-dec">@User</span>() currentUser: <span className="t-cls">AuthUser</span>{'\n'}
    {'  '}) {'{'}{'\n'}
    {'    '}this.logger.<span className="t-fn">info</span>({'{'} userId: currentUser.id {'}'}, <span className="t-str">'Creating user'</span>);{'\n'}
    {'    '}<span className="t-kw">return</span> this.userService.<span className="t-fn">create</span>(dto, currentUser);{'\n'}
    {'  '}{'}'}{'\n'}
    {'}'}
  </>
)

const TABS = [
  { id: 'basic', label: 'basic',        code: BASIC_CODE },
  { id: 'auth',  label: 'auth',         code: AUTH_CODE  },
  { id: 'full',  label: 'full example', code: FULL_CODE  },
]

function CodeWindow({ filename, children, tabs, activeTab, onTabChange }: any) {
  return (
    <div className="code-window">
      <div className="code-window-header">
        <span className="dot dot-red" />
        <span className="dot dot-yellow" />
        <span className="dot dot-green" />
        <span className="code-filename">{filename}</span>
      </div>
      {tabs && (
        <div className="code-tabs">
          {tabs.map((t: any) => (
            <button
              key={t.id}
              className={`code-tab${activeTab === t.id ? ' active' : ''}`}
              onClick={() => onTabChange(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>
      )}
      <div className="code-body">
        <pre>{children}</pre>
      </div>
    </div>
  )
}

export default function CodeShowcase() {
  const [activeTab, setActiveTab] = useState('basic')
  const activeCode = TABS.find((t) => t.id === activeTab)?.code

  return (
    <section id="usage">
      <div className="section-label">quick start</div>
      <h2 className="section-title">From zero to API<br />in minutes.</h2>
      <p className="section-desc">
        Scaffold, code, run. The template handles all the infrastructure so you don't have to.
      </p>

      <div className="code-section reveal">
        {/* Left col */}
        <div>
          <div>
            <div className="code-step-title">1. Create project</div>
            <CodeWindow filename="terminal">
              <span className="t-dec">$</span>{' bun create hono-decorator@latest my-app\n\n'}
              <span className="t-dec">$</span>{' cd my-app && bun install\n\n'}
              <span className="t-dec">$</span>{' cp .env.example .env\n\n'}
              <span className="t-dec">$</span>{' bun run db:migrate\n\n'}
              <span className="t-dec">$</span>{' bun run dev\n'}
              <span className="t-cmt"># → http://localhost:3000</span>
            </CodeWindow>
          </div>
          <div>
            <div className="code-step-title">2. Test it</div>
            <CodeWindow filename="terminal">
              <span className="t-dec">$</span>{' curl localhost:3000/health\n'}
              <span className="t-cmt">{'# → { "status": "ok" }'}</span>
              {'\n\n'}
              <span className="t-dec">$</span>{' curl localhost:3000/api/web/v1/users\n'}
              <span className="t-cmt">{'# → { "data": [], "total": 0 }'}</span>
            </CodeWindow>
          </div>
        </div>

        {/* Right col */}
        <div>
          <div className="code-step-title">3. Write your controller</div>
          <div className="code-window">
            <div className="code-window-header">
              <span className="dot dot-red" />
              <span className="dot dot-yellow" />
              <span className="dot dot-green" />
              <span className="code-filename">user.controller.ts</span>
            </div>
            <div className="code-tabs">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  className={`code-tab${activeTab === t.id ? ' active' : ''}`}
                  onClick={() => setActiveTab(t.id)}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <div className="code-body">
              <pre>{activeCode}</pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
