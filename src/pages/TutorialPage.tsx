import CodeBlock from "@/components/CodeBlock";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

const STEP1 = `bunx hono-forge init blog-api
cd blog-api
bun install
bun run dev`;

const STEP2 = `// src/post.service.ts
import { Injectable } from 'hono-forge'

@Injectable()
export class PostService {
  private posts = [
    { id: 1, title: 'Hello hono-forge' },
  ]

  list() { return this.posts }
  get(id: number) { return this.posts.find((p) => p.id === id) }
  create(title: string) {
    const post = { id: this.posts.length + 1, title }
    this.posts.push(post)
    return post
  }
}`;

const STEP3 = `// src/post.controller.ts
import { Controller, Get, Post, Body, Param, Injectable, Public } from 'hono-forge'
import { z } from 'zod'
import { PostService } from './post.service'

const CreatePostSchema = z.object({ title: z.string().min(1) })

@Controller('/posts')
@Injectable([PostService])
export class PostController {
  constructor(private postService: PostService) {}

  @Get() @Public()
  list() { return this.postService.list() }

  @Get('/:id')
  getOne(c: any) { return this.postService.get(Number(Param(c, 'id'))) }

  @Post()
  async create(c: any) {
    const dto = await Body(c, CreatePostSchema)
    return this.postService.create(dto.title)
  }
}`;

const STEP4 = `// src/app.module.ts
import { Module, createApp } from 'hono-forge'
import { PostController } from './post.controller'

@Module({ controllers: [PostController] })
class AppModule {}

export default await createApp(AppModule, { openapi: true })`;

const STEP5 = `bun test
# GET http://localhost:3000/posts        → 200
# POST http://localhost:3000/posts       → 201 (requires auth if guarded)
# GET http://localhost:3000/docs         → Scalar UI`;

const STEP6 = `bunx hono-forge client ./src/app.module.ts --out ./routes.gen.ts
# import type { AppRoutes } from './routes.gen'
# const api = createClient<AppRoutes>('http://localhost:3000')`;

const TODO_SERVICE = `// src/todo.service.ts
import { Injectable, Singleton } from 'hono-forge'

export interface Todo {
  id: number
  title: string
  done: boolean
  createdAt: string
}

@Injectable()
@Singleton()
export class TodoService {
  private todos: Todo[] = []
  private nextId = 1

  list(filter?: { done?: boolean }) {
    if (filter?.done === undefined) return this.todos
    return this.todos.filter((t) => t.done === filter.done)
  }

  get(id: number) {
    return this.todos.find((t) => t.id === id)
  }

  create(title: string) {
    const todo: Todo = {
      id: this.nextId++,
      title,
      done: false,
      createdAt: new Date().toISOString(),
    }
    this.todos.push(todo)
    return todo
  }

  update(id: number, data: { title?: string; done?: boolean }) {
    const todo = this.get(id)
    if (!todo) return undefined
    Object.assign(todo, data)
    return todo
  }

  remove(id: number) {
    const idx = this.todos.findIndex((t) => t.id === id)
    if (idx === -1) return false
    this.todos.splice(idx, 1)
    return true
  }
}`;

const TODO_CONTROLLER = `// src/todo.controller.ts
import type { Context } from 'hono'
import {
  Controller, Get, Post, Patch, Delete,
  Injectable, Validate, Status, NoContent,
  Body, Params, Query, HttpException,
  Public, RequireAuth,
} from 'hono-forge'
import { z } from 'zod'
import { TodoService } from './todo.service'

const CreateTodoSchema = z.object({
  title: z.string().min(1).max(200),
})

const UpdateTodoSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  done: z.boolean().optional(),
})

const ListQuerySchema = z.object({
  done: z.coerce.boolean().optional(),
})

const IdParamSchema = z.object({ id: z.coerce.number().int() })

@Controller('/todos')
@Injectable([TodoService])
export class TodoController {
  constructor(private todos: TodoService) {}

  @Get()
  @Public()
  @Validate({ query: ListQuerySchema })
  list(c: Context) {
    const { done } = Query<{ done?: boolean }>(c)
    return this.todos.list({ done })
  }

  @Get('/:id')
  @Public()
  @Validate({ params: IdParamSchema })
  getOne(c: Context) {
    const { id } = Params<{ id: number }>(c)
    const todo = this.todos.get(id)
    if (!todo) throw HttpException.notFound('Todo not found')
    return todo
  }

  @Post()
  @RequireAuth()
  @Status(201)
  @Validate({ body: CreateTodoSchema })
  async create(c: Context) {
    const body = await Body<z.infer<typeof CreateTodoSchema>>(c)
    return this.todos.create(body.title)
  }

  @Patch('/:id')
  @RequireAuth()
  @Validate({ params: IdParamSchema, body: UpdateTodoSchema })
  async update(c: Context) {
    const { id } = Params<{ id: number }>(c)
    const body = await Body<z.infer<typeof UpdateTodoSchema>>(c)
    const todo = this.todos.update(id, body)
    if (!todo) throw HttpException.notFound('Todo not found')
    return todo
  }

  @Delete('/:id')
  @RequireAuth()
  @NoContent()
  @Validate({ params: IdParamSchema })
  remove(c: Context) {
    const { id } = Params<{ id: number }>(c)
    if (!this.todos.remove(id)) throw HttpException.notFound('Todo not found')
  }
}`;

const TODO_MODULE = `// src/app.module.ts
import {
  Module, createApp, HonoRouteBuilder, HttpException,
} from 'hono-forge'
import { TodoController } from './todo.controller'
import { TodoService } from './todo.service'

// Demo guard — "Authorization: Bearer dev-token" passes, anything else → 401.
// Swap this for real JWT verification / session lookup in production.
HonoRouteBuilder.configure({
  guardExecutor: async (c) => {
    if (c.req.header('authorization') !== 'Bearer dev-token') {
      throw HttpException.unauthorized('Missing or bad token')
    }
    c.set('user', { id: 'dev', roles: ['admin'] })
    return true
  },
})

@Module({
  controllers: [TodoController],
  providers: [TodoService],
})
class AppModule {}

export default await createApp(AppModule, {
  openapi: { info: { title: 'Todo API', version: '1.0.0' } },
  health: true,        // GET /health
  metrics: true,       // GET /metrics (Prometheus)
  printRoutes: true,   // route table at startup
  shutdown: true,      // graceful SIGINT/SIGTERM
})`;

const TODO_TEST = `// src/todo.test.ts
import { describe, expect, it } from 'bun:test'
import './app.module' // applies the guardExecutor config
import { createTestingModule } from 'hono-forge'
import { TodoController } from './todo.controller'

const mod = createTestingModule({ controllers: [TodoController] }).compile()
const app = mod.createApp()

describe('todo api', () => {
  it('rejects unauthenticated writes', async () => {
    const res = await app.fetch(new Request('http://t/todos', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ title: 'x' }),
    }))
    expect(res.status).toBe(401)
  })

  it('creates, reads, updates and deletes a todo', async () => {
    const auth = {
      'content-type': 'application/json',
      authorization: 'Bearer dev-token',
    }

    const created = await app.fetch(new Request('http://t/todos', {
      method: 'POST', headers: auth,
      body: JSON.stringify({ title: 'write docs' }),
    }))
    expect(created.status).toBe(201)
    const todo = await created.json()

    const one = await app.fetch(new Request(\`http://t/todos/\${todo.id}\`))
    expect(one.status).toBe(200)

    const patched = await app.fetch(new Request(\`http://t/todos/\${todo.id}\`, {
      method: 'PATCH', headers: auth,
      body: JSON.stringify({ done: true }),
    }))
    expect(patched.status).toBe(200)

    const removed = await app.fetch(new Request(\`http://t/todos/\${todo.id}\`, {
      method: 'DELETE', headers: auth,
    }))
    expect(removed.status).toBe(204)
  })
})

mod.cleanup()`;

const TODO_CURL = `bun run dev

# public reads
curl http://localhost:3000/todos
curl "http://localhost:3000/todos?done=false"

# guarded writes — Bearer dev-token (see guardExecutor)
curl -X POST http://localhost:3000/todos \\
  -H "authorization: Bearer dev-token" \\
  -H "content-type: application/json" \\
  -d '{"title":"ship the docs"}'
# → 201 { "id": 1, "title": "ship the docs", "done": false, ... }

curl -X PATCH http://localhost:3000/todos/1 \\
  -H "authorization: Bearer dev-token" \\
  -H "content-type: application/json" \\
  -d '{"done":true}'

curl -X DELETE http://localhost:3000/todos/1 \\
  -H "authorization: Bearer dev-token"
# → 204 No Content

curl http://localhost:3000/docs          # Scalar UI
curl http://localhost:3000/openapi.json  # generated spec`;

const blogSteps = [
	{
		num: "01",
		title: "Scaffold",
		body: "Generate a ready-to-run project with the CLI, install dependencies, and start the dev server.",
		code: STEP1,
		filename: "terminal",
	},
	{
		num: "02",
		title: "Create a service",
		body: "Write an injectable service that holds business logic and state.",
		code: STEP2,
		filename: "src/post.service.ts",
	},
	{
		num: "03",
		title: "Create a controller",
		body: "Map HTTP verbs to methods and validate the body with Zod.",
		code: STEP3,
		filename: "src/post.controller.ts",
	},
	{
		num: "04",
		title: "Wire the app",
		body: "Export the app from a module. OpenAPI docs and Scalar are generated automatically.",
		code: STEP4,
		filename: "src/app.module.ts",
	},
	{
		num: "05",
		title: "Run & test",
		body: "Start the server, open /docs, run the included tests, and call endpoints with curl or api-tester.",
		code: STEP5,
		filename: "terminal",
	},
	{
		num: "06",
		title: "Typed client",
		body: "Generate a typed route map so your frontend gets autocomplete and compile-time API safety.",
		code: STEP6,
		filename: "terminal",
	},
];

const todoSteps = [
	{
		num: "01",
		title: "The service",
		body: "An in-memory store behind an @Injectable @Singleton — every injected consumer shares the same instance.",
		code: TODO_SERVICE,
		filename: "src/todo.service.ts",
	},
	{
		num: "02",
		title: "The controller",
		body: "Full CRUD. @Validate declares each input schema once — it validates before the handler runs AND feeds the OpenAPI spec. Reads are @Public, writes need auth. HttpException.notFound maps missing rows to a structured 404.",
		code: TODO_CONTROLLER,
		filename: "src/todo.controller.ts",
	},
	{
		num: "03",
		title: "Module, guard & bootstrap",
		body: "A demo guardExecutor so guarded routes have an auth decision, then createApp wires health, metrics, OpenAPI docs, and graceful shutdown in one call.",
		code: TODO_MODULE,
		filename: "src/app.module.ts",
	},
	{
		num: "04",
		title: "Test it",
		body: "createTestingModule builds an isolated app — no port needed. The test covers auth rejection and the full CRUD cycle.",
		code: TODO_TEST,
		filename: "src/todo.test.ts",
	},
	{
		num: "05",
		title: "Run it",
		body: "Everything is exercised with curl — reads are public, writes send the dev-token Bearer header.",
		code: TODO_CURL,
		filename: "terminal",
	},
];

export default function TutorialPage() {
	return (
		<>
			<Navbar />
			<main style={{ paddingTop: "80px" }}>
				<section id="guide-blog">
					<div className="section-label">tutorial</div>
					<h1 className="section-title">Build a blog API in 5 minutes</h1>
					<p className="section-desc">
						A step-by-step guide from zero to a typed, documented, testable Hono
						API.
					</p>
					<div
						className="docs-mobile-toc"
						style={{
							display: "flex",
							marginTop: "0.5rem",
							marginBottom: "1rem",
						}}
					>
						<a href="#guide-blog" className="docs-chip">
							01 — blog api quickstart
						</a>
						<a href="#guide-todo" className="docs-chip">
							02 — example: todo app backend
						</a>
					</div>
				</section>

				{blogSteps.map((step) => (
					<section key={step.num} id={`blog-step-${step.num}`}>
						<div className="section-label">{step.num}</div>
						<h2 className="section-title">{step.title}</h2>
						<p className="section-desc">{step.body}</p>
						<CodeBlock filename={step.filename}>{step.code}</CodeBlock>
					</section>
				))}

				<div className="divider" />

				<section id="guide-todo">
					<div className="section-label">example — full code</div>
					<h1 className="section-title">Todo app backend, step by step</h1>
					<p className="section-desc">
						A complete, copy-pasteable backend: service with DI, validated CRUD
						routes, auth guards, OpenAPI docs, tests, and curl commands to prove
						it works.
					</p>
				</section>

				{todoSteps.map((step) => (
					<section key={step.num} id={`todo-step-${step.num}`}>
						<div className="section-label">{step.num}</div>
						<h2 className="section-title">{step.title}</h2>
						<p className="section-desc">{step.body}</p>
						<CodeBlock filename={step.filename}>{step.code}</CodeBlock>
					</section>
				))}
			</main>
			<Footer />
		</>
	);
}
