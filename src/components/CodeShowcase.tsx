import { useState } from 'react'

const BASIC_CODE = (
  <>
    <span className="t-kw">import</span>{' '}<span className="t-str">'reflect-metadata'</span>;{'\n'}
    <span className="t-kw">import</span> {'{ '}<span className="t-cls">Hono</span>{' }'} <span className="t-kw">from</span> <span className="t-str">'hono'</span>;{'\n'}
    <span className="t-kw">import</span> {'{ '}{'\n'}
    {'  '}<span className="t-cls">Controller</span>, <span className="t-cls">Get</span>, <span className="t-cls">Post</span>, <span className="t-cls">Patch</span>, <span className="t-cls">Delete</span>,{'\n'}
    {'  '}<span className="t-cls">Body</span>, <span className="t-cls">Param</span>, <span className="t-cls">Public</span>, <span className="t-cls">RequireAuth</span>,{'\n'}
    {'  '}<span className="t-cls">Injectable</span>, <span className="t-cls">HonoRouteBuilder</span>,{'\n'}
    {'}'} <span className="t-kw">from</span> <span className="t-str">'hono-forge'</span>;{'\n'}
    <span className="t-kw">import</span> {'{ '}<span className="t-fn">z</span>{' }'} <span className="t-kw">from</span> <span className="t-str">'zod'</span>;{'\n\n'}
    <span className="t-kw">const</span> <span className="t-cls">CreateUserSchema</span> = z.<span className="t-fn">object</span>({'{'}{'\n'}
    {'  '}name: z.<span className="t-fn">string</span>().<span className="t-fn">min</span>(<span className="t-num">1</span>),{'\n'}
    {'  '}email: z.<span className="t-fn">string</span>().<span className="t-fn">email</span>(),{'\n'}
    {'}'});{'\n'}
    <span className="t-kw">const</span> <span className="t-cls">UpdateUserSchema</span> = <span className="t-cls">CreateUserSchema</span>.<span className="t-fn">partial</span>();{'\n\n'}
    <span className="t-dec">@Injectable</span>(){'\n'}
    <span className="t-kw">class</span> <span className="t-cls">UserService</span> {'{'}{'\n'}
    {'  '}<span className="t-fn">getAll</span>() {'{'} <span className="t-kw">return</span> [{'{'} id: <span className="t-num">1</span>, name: <span className="t-str">'Alice'</span> {'}'}]; {'}'}{'\n'}
    {'  '}<span className="t-fn">create</span>(data: <span className="t-kw">any</span>) {'{'} <span className="t-kw">return</span> {'{'} id: <span className="t-num">2</span>, ...data {'}'}; {'}'}{'\n'}
    {'}'}{'\n\n'}
    <span className="t-dec">@Controller</span>(<span className="t-str">'/users'</span>){'\n'}
    <span className="t-kw">class</span> <span className="t-cls">UserController</span> {'{'}{'\n'}
    {'  '}constructor(<span className="t-kw">private</span> userService: <span className="t-cls">UserService</span>) {'{}'}{'\n\n'}
    {'  '}<span className="t-dec">@Get</span>() <span className="t-dec">@Public</span>(){'\n'}
    {'  '}<span className="t-fn">list</span>() {'{'} <span className="t-kw">return</span> this.userService.<span className="t-fn">getAll</span>(); {'}'}{'\n\n'}
    {'  '}<span className="t-dec">@Post</span>() <span className="t-dec">@RequireAuth</span>(){'\n'}
    {'  '}<span className="t-fn">create</span>(<span className="t-dec">@Body</span>(<span className="t-cls">CreateUserSchema</span>) body: <span className="t-kw">any</span>) {'{'}{'\n'}
    {'    '}<span className="t-kw">return</span> this.userService.<span className="t-fn">create</span>(body);{'\n'}
    {'  '}{'}'}{'\n\n'}
    {'  '}<span className="t-dec">@Patch</span>(<span className="t-str">'/:id'</span>) <span className="t-dec">@RequireAuth</span>(){'\n'}
    {'  '}<span className="t-fn">update</span>(<span className="t-dec">@Param</span>(<span className="t-str">'id'</span>) id: <span className="t-kw">string</span>, <span className="t-dec">@Body</span>(<span className="t-cls">UpdateUserSchema</span>) body: <span className="t-kw">any</span>) {'{'}{'\n'}
    {'    '}<span className="t-kw">return</span> this.userService.<span className="t-fn">update</span>(id, body);{'\n'}
    {'  '}{'}'}{'\n\n'}
    {'  '}<span className="t-dec">@Delete</span>(<span className="t-str">'/:id'</span>) <span className="t-dec">@RequireAuth</span>(){'\n'}
    {'  '}<span className="t-fn">remove</span>(<span className="t-dec">@Param</span>(<span className="t-str">'id'</span>) id: <span className="t-kw">string</span>) {'{'}{'\n'}
    {'    '}<span className="t-kw">return</span> this.userService.<span className="t-fn">delete</span>(id);{'\n'}
    {'  '}{'}'}{'\n'}
    {'}'}{'\n\n'}
    <span className="t-kw">const</span> app = <span className="t-kw">new</span> <span className="t-cls">Hono</span>();{'\n'}
    app.<span className="t-fn">route</span>(<span className="t-str">'/'</span>, <span className="t-cls">HonoRouteBuilder</span>.<span className="t-fn">build</span>(<span className="t-cls">UserController</span>));{'\n'}
    <span className="t-kw">export default</span> app;
  </>
)

const AUTH_CODE = (
  <>
    <span className="t-dec">@Controller</span>(<span className="t-str">'/admin'</span>){'\n'}
    <span className="t-kw">class</span> <span className="t-cls">AdminController</span> {'{'}{'\n\n'}
    {'  '}<span className="t-cmt">// Require authentication</span>{'\n'}
    {'  '}<span className="t-dec">@Get</span>(<span className="t-str">'/dashboard'</span>) <span className="t-dec">@RequireAuth</span>(){'\n'}
    {'  '}<span className="t-kw">async</span> <span className="t-fn">dashboard</span>(<span className="t-dec">@User</span>() user: <span className="t-cls">AuthUser</span>) {'{'}{'\n'}
    {'    '}<span className="t-kw">return</span> {'{'} message: <span className="t-str">{`\`Welcome \${user.name}\``}</span> {'}'};{'\n'}
    {'  '}{'}'}{'\n\n'}
    {'  '}<span className="t-cmt">// Role-based access control</span>{'\n'}
    {'  '}<span className="t-dec">@Delete</span>(<span className="t-str">'/users/:id'</span>) <span className="t-dec">@RequireRole</span>(<span className="t-str">'admin'</span>){'\n'}
    {'  '}<span className="t-kw">async</span> <span className="t-fn">deleteUser</span>(<span className="t-dec">@Param</span>(<span className="t-str">'id'</span>) id: <span className="t-kw">string</span>) {'{'}{'\n'}
    {'    '}<span className="t-kw">return</span> this.userService.<span className="t-fn">delete</span>(id);{'\n'}
    {'  '}{'}'}{'\n\n'}
    {'  '}<span className="t-cmt">// Strict rate limit on login</span>{'\n'}
    {'  '}<span className="t-dec">@Post</span>(<span className="t-str">'/login'</span>){'\n'}
    {'  '}<span className="t-dec">@RateLimit</span>({'{'} max: <span className="t-num">5</span>, windowMs: <span className="t-num">15</span> * <span className="t-num">60_000</span> {'}'}){'\n'}
    {'  '}<span className="t-kw">async</span> <span className="t-fn">login</span>(<span className="t-dec">@Body</span>(<span className="t-cls">LoginSchema</span>) dto: <span className="t-kw">any</span>) {'{'}{'\n'}
    {'    '}<span className="t-kw">return</span> this.authService.<span className="t-fn">login</span>(dto);{'\n'}
    {'  '}{'}'}{'\n'}
    {'}'}
  </>
)

const REALTIME_CODE = (
  <>
    <span className="t-kw">import</span> {'{ '}<span className="t-cls">channels</span>, <span className="t-cls">SseChannelClient</span>{' }'} <span className="t-kw">from</span> <span className="t-str">'hono-forge'</span>;{'\n'}
    <span className="t-kw">import type</span> {'{ '}<span className="t-cls">SSEStreamingApi</span>{' }'} <span className="t-kw">from</span> <span className="t-str">'hono/streaming'</span>;{'\n\n'}
    <span className="t-dec">@Controller</span>(<span className="t-str">'/events'</span>){'\n'}
    <span className="t-kw">class</span> <span className="t-cls">EventController</span> {'{'}{'\n\n'}
    {'  '}<span className="t-cmt">// SSE: per-user event feed</span>{'\n'}
    {'  '}<span className="t-dec">@Sse</span>(<span className="t-str">'/user/:userId'</span>) <span className="t-dec">@RequireAuth</span>(){'\n'}
    {'  '}<span className="t-kw">async</span> <span className="t-fn">userFeed</span>({'\n'}
    {'    '}<span className="t-dec">@Param</span>(<span className="t-str">'userId'</span>) userId: <span className="t-kw">string</span>,{'\n'}
    {'    '}<span className="t-dec">@SseStream</span>() stream: <span className="t-cls">SSEStreamingApi</span>,{'\n'}
    {'    '}<span className="t-dec">@Ip</span>() ip: <span className="t-kw">string</span>,{'\n'}
    {'  '}) {'{'}{'\n'}
    {'    '}<span className="t-kw">const</span> client = <span className="t-kw">new</span> <span className="t-cls">SseChannelClient</span>(userId, stream);{'\n'}
    {'    '}<span className="t-kw">await</span> channels.<span className="t-fn">subscribe</span>(<span className="t-str">{`\`user:\${userId}\``}</span>, client);{'\n'}
    {'    '}stream.<span className="t-fn">onAbort</span>
    {'      '}channels.<span className="t-fn">unsubscribe</span>(<span className="t-str">{`\`user:\${userId}\``}</span>, userId));{'\n\n'}
    {'    '}<span className="t-kw">while</span> (!stream.closed) {'{'}{'\n'}
    {'      '}<span className="t-kw">await</span> stream.<span className="t-fn">sleep</span>(<span className="t-num">30_000</span>);{'\n'}
    {'      '}<span className="t-kw">await</span> stream.<span className="t-fn">writeSSE</span>({'{'} event: <span className="t-str">'ping'</span>, data: <span className="t-str">''</span> {'}'});{'\n'}
    {'    '}{'}'}{'\n'}
    {'  '}{'}'}{'\n'}
    {'}'}{'\n\n'}
    <span className="t-cmt">// Push from anywhere in the app</span>{'\n'}
    <span className="t-kw">await</span> channels.<span className="t-fn">publish</span>(<span className="t-str">'user:42'</span>, <span className="t-str">'order.created'</span>, {'{'} id: <span className="t-num">123</span> {'}'});
  </>
)

const ERRORS_CODE = (
  <>
    <span className="t-kw">import</span>{' '}<span className="t-str">'reflect-metadata'</span>;{' '}{'\n'}
    <span className="t-kw">import</span> {'{ '}<span className="t-cls">Controller</span>, <span className="t-cls">Get</span>, <span className="t-cls">Post</span>, <span className="t-cls">Param</span>, <span className="t-cls">Body</span>,{'\n'}
    {'  '}<span className="t-cls">HttpException</span>, <span className="t-cls">Injectable</span>, <span className="t-fn">getTraceId</span>{'\n'}
    {'}'} <span className="t-kw">from</span> <span className="t-str">'hono-forge'</span>;{' '}{'\n\n'}
    <span className="t-dec">@Injectable</span>(){'\n'}
    <span className="t-kw">class</span> <span className="t-cls">UserService</span> {'{'}{' '}{'\n'}
    {'  '}<span className="t-kw">async</span> <span className="t-fn">findById</span>(id: <span className="t-kw">string</span>) {'{'}{' '}{'\n'}
    {'    '}<span className="t-kw">const</span> user = <span className="t-kw">await</span> db.<span className="t-fn">find</span>(id);{'\n'}
    {'    '}<span className="t-kw">if</span> (!user) <span className="t-kw">throw</span> <span className="t-cls">HttpException</span>.<span className="t-fn">notFound</span>(<span className="t-str">'User not found'</span>);{'\n'}
    {'    '}<span className="t-kw">return</span> user;{'\n'}
    {'  '}{'}'}{' '}{'\n\n'}
    {'  '}<span className="t-kw">async</span> <span className="t-fn">create</span>(data: <span className="t-kw">any</span>) {'{'}{' '}{'\n'}
    {'    '}<span className="t-kw">const</span> exists = <span className="t-kw">await</span> db.<span className="t-fn">findByEmail</span>(data.email);{'\n'}
    {'    '}<span className="t-kw">if</span> (exists) <span className="t-kw">throw</span> <span className="t-cls">HttpException</span>.<span className="t-fn">conflict</span>(<span className="t-str">'Email already taken'</span>);{'\n'}
    {'    '}<span className="t-kw">return</span> db.<span className="t-fn">insert</span>(data);{'\n'}
    {'  '}{'}'}{' '}{'\n'}
    {'}'}{' '}{'\n\n'}
    <span className="t-cmt">{'// getTraceId() works anywhere — services, repos, loggers'}</span>{'\n'}
    <span className="t-dec">@Injectable</span>(){'\n'}
    <span className="t-kw">class</span> <span className="t-cls">AuditService</span> {'{'}{' '}{'\n'}
    {'  '}<span className="t-fn">log</span>(action: <span className="t-kw">string</span>) {'{'}{' '}{'\n'}
    {'    '}console.<span className="t-fn">log</span>({'{'} traceId: <span className="t-fn">getTraceId</span>(), action {'}'});{'\n'}
    {'  '}{'}'}{' '}{'\n'}
    {'}'}{' '}{'\n\n'}
    <span className="t-cmt">{'// HonoRouteBuilder auto-handles HttpException → structured JSON'}</span>{'\n'}
    <span className="t-cmt">{'// { status: "error", error: { code: "NOT_FOUND", message: "..." } }'}</span>
  </>
)

const DI_CODE = (
  <>
    <span className="t-kw">import</span> {'{ '}{'\n'}
    {'  '}<span className="t-cls">Injectable</span>, <span className="t-cls">Singleton</span>, <span className="t-cls">RequestScoped</span>,{'\n'}
    {'  '}<span className="t-cls">Stateless</span>, <span className="t-cls">OnInit</span>, <span className="t-cls">OnDestroy</span>,{'\n'}
    {'}'} <span className="t-kw">from</span> <span className="t-str">'hono-forge'</span>;{'\n\n'}
    <span className="t-cmt">// Singleton: one instance for the app lifecycle</span>{'\n'}
    <span className="t-dec">@Injectable</span>() <span className="t-dec">@Singleton</span>() <span className="t-dec">@Stateless</span>(){'\n'}
    <span className="t-kw">class</span> <span className="t-cls">ConfigService</span> <span className="t-cls">implements</span> <span className="t-cls">OnInit</span> {'{'}{'\n'}
    {'  '}<span className="t-kw">readonly</span> dbUrl = process.env.<span className="t-str">DATABASE_URL</span>!;{'\n'}
    {'  '}<span className="t-kw">readonly</span> redis = <span className="t-kw">new</span> <span className="t-cls">Redis</span>(process.env.<span className="t-str">REDIS_URL</span>!);{'\n'}
    {'  '}<span className="t-kw">async</span> <span className="t-fn">onInit</span>() {'{'}{'\n'}
    {'    '}<span className="t-kw">await</span> this.redis.<span className="t-fn">ping</span>();{'\n'}
    {'  '}{'}'}{'\n'}
    {'}'}{'\n\n'}
    <span className="t-cmt">// RequestScoped: new instance per HTTP request</span>{'\n'}
    <span className="t-dec">@Injectable</span>() <span className="t-dec">@RequestScoped</span>() <span className="t-cls">implements</span> <span className="t-cls">OnDestroy</span> {'{'}{'\n'}
    {'  '}<span className="t-kw">readonly</span> traceId = <span className="t-fn">getTraceId</span>();{'\n'}
    {'  '}<span className="t-fn">log</span>(msg: <span className="t-kw">string</span>) {'{'}{'\n'}
    {'    '}console.<span className="t-fn">log</span>(<span className="t-str">{`\`[\${this.traceId}] \${msg}\``}</span>);{'\n'}
    {'  '}{'}'}{'\n'}
    {'  '}<span className="t-kw">async</span> <span className="t-fn">onDestroy</span>() {'{'}{'\n'}
    {'    '}<span className="t-cmt">// cleanup: close DB connections, release locks</span>{'\n'}
    {'  '}{'}'}{'\n'}
    {'}'}{'\n\n'}
    <span className="t-dec">@Controller</span>(<span className="t-str">'/users'</span>){'\n'}
    <span className="t-kw">class</span> <span className="t-cls">UserController</span> {'{'}{'\n'}
    {'  '}constructor({'\n'}
    {'    '}<span className="t-kw">private</span> config: <span className="t-cls">ConfigService</span>,{'\n'}
    {'    '}<span className="t-kw">private</span> logger: <span className="t-cls">RequestLogger</span>,{'\n'}
    {'  '}) {'{}'}{'\n'}
    {'  '}<span className="t-dec">@Get</span>(<span className="t-str">'/:id'</span>) <span className="t-dec">@Public</span>(){'\n'}
    {'  '}<span className="t-kw">async</span> <span className="t-fn">get</span>(<span className="t-dec">@Param</span>(<span className="t-str">'id'</span>) id: <span className="t-kw">string</span>) {'{'}{'\n'}
    {'    '}this.logger.<span className="t-fn">log</span>(<span className="t-str">'Fetching user'</span>);{'\n'}
    {'    '}<span className="t-kw">return</span> {'{'} id, db: this.config.dbUrl {'}'};{'\n'}
    {'  '}{'}'}{'\n'}
    {'}'}{'\n'}
  </>
)

const CRUD_CODE = (
  <>
    <span className="t-kw">import</span> {'{ '}<span className="t-cls">Controller</span>, <span className="t-cls">Get</span>, <span className="t-cls">Post</span>, <span className="t-cls">Patch</span>, <span className="t-cls">Delete</span>, <span className="t-cls">Body</span>, <span className="t-cls">Param</span>, <span className="t-cls">Public</span>, <span className="t-cls">Injectable</span>, <span className="t-cls">HonoRouteBuilder</span>{' }'} <span className="t-kw">from</span> <span className="t-str">'hono-forge'</span>;{'\n'}
    <span className="t-kw">import</span> {'{ '}<span className="t-cls">users</span>, <span className="t-cls">db</span>{' }'} <span className="t-kw">from</span> <span className="t-str">'@/db/schema'</span>;{'\n'}
    <span className="t-kw">import</span> {'{ '}<span className="t-fn">z</span>{' }'} <span className="t-kw">from</span> <span className="t-str">'zod'</span>;{'\n\n'}
    <span className="t-cmt">// Drizzle schema</span>{'\n'}
    <span className="t-kw">const</span> <span className="t-cls">CreateUserSchema</span> = z.<span className="t-fn">object</span>(<span className="t-str">"&#123;"</span> name: z.<span className="t-fn">string</span>(), email: z.<span className="t-fn">string</span>() <span className="t-str">"&#125;"</span>);{'\n\n'}
    <span className="t-dec">@Injectable</span>(){'\n'}
    <span className="t-kw">class</span> <span className="t-cls">UserService</span> {'{'}{'\n'}
    {'  '}<span className="t-fn">getAll</span>() {'{'} <span className="t-kw">return</span> db.<span className="t-fn">select</span>().<span className="t-fn">from</span>(<span className="t-cls">users</span>); {'}'}{'\n'}
    {'  '}<span className="t-fn">getById</span>(id: <span className="t-kw">string</span>) {'{'} <span className="t-kw">return</span> db.<span className="t-fn">select</span>().<span className="t-fn">from</span>(<span className="t-cls">users</span>).<span className="t-fn">where</span>(<span className="t-cls">eq</span>(<span className="t-cls">users</span>.id, id)); {'}'}{'\n'}
    {'  '}<span className="t-fn">create</span>(data: <span className="t-kw">any</span>) {'{'} <span className="t-kw">return</span> db.<span className="t-fn">insert</span>(<span className="t-cls">users</span>).<span className="t-fn">values</span>(data); {'}'}{'\n'}
    {'  '}<span className="t-fn">update</span>(id: <span className="t-kw">string</span>, data: <span className="t-kw">any</span>) {'{'} <span className="t-kw">return</span> db.<span className="t-fn">update</span>(<span className="t-cls">users</span>).<span className="t-fn">set</span>(data).<span className="t-fn">where</span>(<span className="t-cls">eq</span>(<span className="t-cls">users</span>.id, id)); {'}'}{'\n'}
    {'  '}<span className="t-fn">delete</span>(id: <span className="t-kw">string</span>) {'{'} <span className="t-kw">return</span> db.<span className="t-fn">delete</span>(<span className="t-cls">users</span>).<span className="t-fn">where</span>(<span className="t-cls">eq</span>(<span className="t-cls">users</span>.id, id)); {'}'}{'\n'}
    {'}'}{'\n\n'}
    <span className="t-dec">@Controller</span>(<span className="t-str">'/users'</span>){'\n'}
    <span className="t-kw">class</span> <span className="t-cls">UserController</span> {'{'}{'\n'}
    {'  '}<span className="t-kw">constructor</span>(<span className="t-kw">private</span> service: <span className="t-cls">UserService</span>) {'{}'}{'\n'}
    {'  '}<span className="t-dec">@Get</span>() <span className="t-dec">@Public</span>() <span className="t-fn">list</span>() {'{'} <span className="t-kw">return</span> <span className="t-kw">this</span>.service.<span className="t-fn">getAll</span>(); {'}'}{'\n'}
    {'  '}<span className="t-dec">@Get</span>(<span className="t-str">'/:id'</span>) <span className="t-dec">@Public</span>() <span className="t-fn">get</span>(<span className="t-dec">@Param</span>(<span className="t-str">'id'</span>) id: <span className="t-kw">string</span>) {'{'} <span className="t-kw">return</span> <span className="t-kw">this</span>.service.<span className="t-fn">getById</span>(id); {'}'}{'\n'}
    {'  '}<span className="t-dec">@Post</span>() <span className="t-fn">create</span>(<span className="t-dec">@Body</span>(<span className="t-cls">CreateUserSchema</span>) body: <span className="t-kw">any</span>) {'{'} <span className="t-kw">return</span> <span className="t-kw">this</span>.service.<span className="t-fn">create</span>(body); {'}'}{'\n'}
    {'  '}<span className="t-dec">@Patch</span>(<span className="t-str">'/:id'</span>) <span className="t-fn">update</span>(<span className="t-dec">@Param</span>(<span className="t-str">'id'</span>) id: <span className="t-kw">string</span>, <span className="t-dec">@Body</span>() body: <span className="t-kw">any</span>) {'{'} <span className="t-kw">return</span> <span className="t-kw">this</span>.service.<span className="t-fn">update</span>(id, body); {'}'}{'\n'}
    {'  '}<span className="t-dec">@Delete</span>(<span className="t-str">'/:id'</span>) <span className="t-fn">remove</span>(<span className="t-dec">@Param</span>(<span className="t-str">'id'</span>) id: <span className="t-kw">string</span>) {'{'} <span className="t-kw">return</span> <span className="t-kw">this</span>.service.<span className="t-fn">delete</span>(id); {'}'}{'\n'}
    {'}'}{'\n\n'}
    <span className="t-kw">const</span> app = <span className="t-kw">new</span> <span className="t-cls">Hono</span>();{'\n'}
    app.<span className="t-fn">route</span>(<span className="t-str">'/'</span>, <span className="t-cls">HonoRouteBuilder</span>.<span className="t-fn">build</span>(<span className="t-cls">UserController</span>));{'\n'}
    <span className="t-kw">export default</span> app;
  </>
)

const MIDDLEWARE_CODE = (
  <>
    <span className="t-kw">import</span> {'{ '}<span className="t-cls">Middleware</span>, <span className="t-cls">Throttle</span>, <span className="t-cls">Memoize</span>, <span className="t-cls">Cors</span>{' }'} <span className="t-kw">from</span> <span className="t-str">'hono-forge'</span>;{'\n'}
    <span className="t-kw">import type</span> {'{ '}<span className="t-cls">Context</span>, <span className="t-cls">Next</span>{' }'} <span className="t-kw">from</span> <span className="t-str">'hono'</span>;{'\n\n'}
    <span className="t-cmt">// Custom middleware: request logging</span>{'\n'}
    <span className="t-kw">const</span> <span className="t-cls">requestLogger</span> = <span className="t-kw">async</span> (c: <span className="t-cls">Context</span>, next: <span className="t-cls">Next</span>) {'='}&gt; {'{'}{'\n'}
    {'  '}<span className="t-kw">const</span> start = <span className="t-fn">Date</span>.<span className="t-fn">now</span>();{'\n'}
    {'  '}<span className="t-kw">await</span> <span className="t-fn">next</span>();{'\n'}
    {'  '}console.<span className="t-fn">log</span>(<span className="t-str">{`\`\${c.req.method} \${c.req.path} \${Date.now() - start}ms\``}</span>);{'\n'}
    {'}'};{'\n\n'}
    <span className="t-dec">@Controller</span>(<span className="t-str">'/api'</span>){'\n'}
    <span className="t-dec">@Middleware</span>(<span className="t-cls">requestLogger</span>){'\n'}
    <span className="t-dec">@Cors</span>({'{'} origin: <span className="t-str">'*'</span> {'}'}){'\n'}
    <span className="t-kw">class</span> <span className="t-cls">ApiController</span> {'{'}{'\n\n'}
    {'  '}<span className="t-cmt">// Throttle expensive operations</span>{'\n'}
    {'  '}<span className="t-dec">@Get</span>(<span className="t-str">'/report'</span>) <span className="t-dec">@Public</span>() <span className="t-dec">@Throttle</span>(<span className="t-num">10_000</span>){'\n'}
    {'  '}<span className="t-kw">async</span> <span className="t-fn">generateReport</span>() {'{'}{'\n'}
    {'    '}<span className="t-cmt">// Heavy computation — only once per 10s per instance</span>{'\n'}
    {'    '}<span className="t-kw">return</span> this.<span className="t-fn">runHeavyQuery</span>();{'\n'}
    {'  '}{'}'}{'\n\n'}
    {'  '}<span className="t-cmt">// Memoize cache: global by default</span>{'\n'}
    {'  '}<span className="t-dec">@Get</span>(<span className="t-str">'/config'</span>) <span className="t-dec">@Public</span>(){'\n'}
    {'  '}<span className="t-dec">@Memoize</span>({'{'} ttl: <span className="t-num">60_000</span> {'}'}){'\n'}
    {'  '}<span className="t-kw">async</span> <span className="t-fn">getConfig</span>() {'{'}{'\n'}
    {'    '}<span className="t-cmt">// Fetch from DB only once per minute</span>{'\n'}
    {'    '}<span className="t-kw">return</span> <span className="t-kw">await</span> db.<span className="t-fn">getConfig</span>();{'\n'}
    {'  '}{'}'}{'\n\n'}
    {'  '}<span className="t-cmt">// Request-scoped memoize: per-user cache</span>{'\n'}
    {'  '}<span className="t-dec">@Get</span>(<span className="t-str">'/profile'</span>) <span className="t-dec">@RequireAuth</span>(){'\n'}
    {'  '}<span className="t-dec">@Memoize</span>({'{'} scope: <span className="t-str">'request'</span>, ttl: <span className="t-num">5_000</span> {'}'}){'\n'}
    {'  '}<span className="t-kw">async</span> <span className="t-fn">getProfile</span>(<span className="t-dec">@User</span>() user: <span className="t-cls">AuthUser</span>) {'{'}{'\n'}
    {'    '}<span className="t-cmt">// Cached per-request, per-user</span>{'\n'}
    {'    '}<span className="t-kw">return</span> <span className="t-kw">await</span> this.userService.<span className="t-fn">findById</span>(user.id);{'\n'}
    {'  '}{'}'}{'\n'}
    {'}'}{'\n'}
  </>
)

const TABS = [
  { id: 'basic', label: 'basic', code: BASIC_CODE },
  { id: 'di', label: 'di', code: DI_CODE },
  { id: 'auth', label: 'auth', code: AUTH_CODE },
  { id: 'middleware', label: 'middleware', code: MIDDLEWARE_CODE },
  { id: 'realtime', label: 'realtime', code: REALTIME_CODE },
  { id: 'errors', label: 'errors', code: ERRORS_CODE },
  { id: 'crud', label: 'crud', code: CRUD_CODE },
]

export default function CodeShowcase() {
  const [activeTab, setActiveTab] = useState('basic')
  const activeCode = TABS.find((t) => t.id === activeTab)?.code

  return (
    <section id="usage">
      <div className="section-label">quick start</div>
      <h2 className="section-title">From zero to API<br />in minutes.</h2>
      <p className="section-desc">
        Install one package, decorate your controllers, mount the routes.
      </p>

      <div className="code-section reveal">
        {/* Left col */}
        <div>
          <div>
            <div className="code-step-title">1. Install</div>
            <div className="code-window">
              <div className="code-window-header">
                <span className="dot dot-red" />
                <span className="dot dot-yellow" />
                <span className="dot dot-green" />
                <span className="code-filename">terminal</span>
              </div>
              <div className="code-body">
                <pre>
                  <span className="t-dec">$</span>{' bun add hono-forge hono zod\n'}
                </pre>
              </div>
            </div>
          </div>
          <div style={{ marginTop: '1.5rem' }}>
            <div className="code-step-title">2. Enable decorators</div>
            <div className="code-window">
              <div className="code-window-header">
                <span className="dot dot-red" />
                <span className="dot dot-yellow" />
                <span className="dot dot-green" />
                <span className="code-filename">tsconfig.json</span>
              </div>
              <div className="code-body">
                <pre>
                  {'{'}{'\n'}
                  {'  '}<span className="t-str">"compilerOptions"</span>: {'{'}{'\n'}
                  {'    '}<span className="t-str">"experimentalDecorators"</span>: <span className="t-kw">true</span>,{'\n'}
                  {'    '}<span className="t-str">"emitDecoratorMetadata"</span>: <span className="t-kw">true</span>{'\n'}
                  {'  '}{'}'}{'\n'}
                  {'}'}
                </pre>
              </div>
            </div>
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
              <span className="code-filename">controller.ts</span>
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
