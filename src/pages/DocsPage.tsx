import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import CodeBlock from '@/components/CodeBlock'

const INSTALL = `bun add hono-forge
# or
npm install hono-forge`

const SCAFFOLD = `bunx hono-forge init my-api
cd my-api
bun install
bun run dev`

const CONTROLLER = `import { Controller, Get, Post, Body, Param, Injectable, Public } from 'hono-forge'
import { z } from 'zod'

const CreateTodoSchema = z.object({
  title: z.string().min(1),
})

@Injectable()
class TodoService {
  private todos: { id: number; title: string }[] = []
  list() { return this.todos }
  create(title: string) {
    const todo = { id: this.todos.length + 1, title }
    this.todos.push(todo)
    return todo
  }
}

@Controller('/todos')
@Injectable([TodoService])
class TodoController {
  constructor(private todoService: TodoService) {}

  @Get() @Public()
  list() { return this.todoService.list() }

  @Post()
  async create(c: any) {
    const dto = await Body(c, CreateTodoSchema)
    return this.todoService.create(dto.title)
  }
}`

const APP = `import { Hono } from 'hono'
import { HonoRouteBuilder } from 'hono-forge'
import { TodoController } from './todo.controller'

const app = new Hono()
app.route('/', HonoRouteBuilder.build(TodoController))

export default app`

const MODULE = `import { Module } from 'hono-forge'
import { TodoController } from './todo.controller'

@Module({ controllers: [TodoController] })
class AppModule {}

const app = createApp(AppModule, { openapi: true })
// GET /docs    → Scalar interactive docs
// GET /openapi.json → OpenAPI 3.1 spec`

const CLI = `# OpenAPI spec
bunx hono-forge openapi ./src/app.module.ts

# Typed client for your frontend
bunx hono-forge client ./src/app.module.ts --out ./routes.gen.ts

# Static wiring check (CI guard)
bunx hono-forge doctor ./src/app.module.ts

# api-tester flows
bunx hono-forge flows ./src/app.module.ts --out ./flows`

const CLIENT = `import { createClient } from 'hono-forge'
import type { AppRoutes } from './routes.gen'

const api = createClient<AppRoutes>('http://localhost:3000')
const todos = await api('GET /todos')
//    ^ typed array of TodoService['list'] output`

const DECORATORS = `@Get() / @Post() / @Patch() / @Delete()
@Public()              // skip auth
@RequireAuth()         // require auth guard
@JwtAuth('secret')     // JWT middleware
@Validate()            // validate + coerce body/query/params
@Cache({ ttlMs: 5000 }) // response cache
@RateLimit({ max: 100, windowMs: 60_000 })
@Middleware(...)        // add Hono middleware to one route
@UseFilters(MyFilter)   // error filter
@OnEvent('user.created') // event listener`

const TEST = `import { createTestingModule } from 'hono-forge'

const { build } = createTestingModule({ controllers: [TodoController] })
const app = build()
const res = await app.request('/todos')
expect(res.status).toBe(200)`

const sections = [
  { id: 'install', label: 'Install', title: 'Install & scaffold' },
  { id: 'controller', label: 'Controllers', title: 'Controllers & routes' },
  { id: 'module', label: 'Modules', title: 'Modules, DI & OpenAPI' },
  { id: 'cli', label: 'CLI', title: 'CLI commands' },
  { id: 'decorators', label: 'Decorators', title: 'Decorator reference' },
  { id: 'client', label: 'Typed client', title: 'Typed fetch client' },
  { id: 'test', label: 'Testing', title: 'Testing' },
]

export default function DocsPage() {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: '80px' }}>
        <section>
          <div className="section-label">documentation</div>
          <h1 className="section-title">hono-forge docs</h1>
          <p className="section-desc">
            Batteries-included Hono framework built on TC39 decorators. Learn how to scaffold, build, and ship an API in minutes.
          </p>

          <nav className="decorator-list" style={{ marginTop: '2rem' }}>
            {sections.map((s) => (
              <a key={s.id} href={`#${s.id}`} className="group">
                <div style={{ padding: '1rem', border: '1px solid var(--border)', borderRadius: '4px', background: 'var(--surface)', transition: '0.2s' }}>
                  <span style={{ color: 'var(--accent)', fontFamily: 'var(--mono)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{s.label}</span>
                  <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--text)' }}>{s.title}</div>
                </div>
              </a>
            ))}
          </nav>
        </section>

        <section id="install">
          <div className="section-label">01</div>
          <h2 className="section-title">Install & scaffold</h2>
          <p className="section-desc">Add the package to an existing project, or let the CLI generate a runnable starter.</p>
          <CodeBlock filename="terminal">{INSTALL}</CodeBlock>
          <CodeBlock filename="terminal">{SCAFFOLD}</CodeBlock>
        </section>

        <section id="controller">
          <div className="section-label">02</div>
          <h2 className="section-title">Controllers & routes</h2>
          <p className="section-desc">A controller groups HTTP methods and injects services. Validation, auth, and middleware are decorators.</p>
          <CodeBlock filename="src/todo.controller.ts">{CONTROLLER}</CodeBlock>
          <CodeBlock filename="src/index.ts">{APP}</CodeBlock>
        </section>

        <section id="module">
          <div className="section-label">03</div>
          <h2 className="section-title">Modules, DI & OpenAPI</h2>
          <p className="section-desc">Use @Module to compose providers and controllers. One line turns metadata into OpenAPI + Scalar docs.</p>
          <CodeBlock filename="src/app.module.ts">{MODULE}</CodeBlock>
        </section>

        <section id="cli">
          <div className="section-label">04</div>
          <h2 className="section-title">CLI commands</h2>
          <p className="section-desc">The hono-forge CLI introspects your module and exports specs, clients, and tests without running the server.</p>
          <CodeBlock filename="terminal">{CLI}</CodeBlock>
        </section>

        <section id="decorators">
          <div className="section-label">05</div>
          <h2 className="section-title">Decorator reference</h2>
          <p className="section-desc">Common decorators available on classes and methods.</p>
          <CodeBlock filename="decorators">{DECORATORS}</CodeBlock>
        </section>

        <section id="client">
          <div className="section-label">06</div>
          <h2 className="section-title">Typed fetch client</h2>
          <p className="section-desc">Generate an AppRoutes interface from your controllers, then call endpoints with full TypeScript inference.</p>
          <CodeBlock filename="src/client.ts">{CLIENT}</CodeBlock>
        </section>

        <section id="test">
          <div className="section-label">07</div>
          <h2 className="section-title">Testing</h2>
          <p className="section-desc">Use createTestingModule to build an isolated app for Bun tests.</p>
          <CodeBlock filename="src/todo.test.ts">{TEST}</CodeBlock>
        </section>
      </main>
      <Footer />
    </>
  );
}
