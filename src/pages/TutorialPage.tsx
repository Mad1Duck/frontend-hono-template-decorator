import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import CodeBlock from '@/components/CodeBlock'

const STEP1 = `bunx hono-forge init blog-api
cd blog-api
bun install
bun run dev`

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
}`

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
}`

const STEP4 = `// src/app.module.ts
import { Module, createApp } from 'hono-forge'
import { PostController } from './post.controller'

@Module({ controllers: [PostController] })
class AppModule {}

export default createApp(AppModule, { openapi: true })`

const STEP5 = `bun test
# GET http://localhost:3000/posts        → 200
# POST http://localhost:3000/posts       → 201 (requires auth if guarded)
# GET http://localhost:3000/docs         → Scalar UI`

const STEP6 = `bunx hono-forge client ./src/app.module.ts --out ./routes.gen.ts
# import type { AppRoutes } from './routes.gen'
# const api = createClient<AppRoutes>('http://localhost:3000')`

const steps = [
  {
    num: '01',
    title: 'Scaffold',
    body: 'Generate a ready-to-run project with the CLI, install dependencies, and start the dev server.',
    code: STEP1,
    filename: 'terminal',
  },
  {
    num: '02',
    title: 'Create a service',
    body: 'Write an injectable service that holds business logic and state.',
    code: STEP2,
    filename: 'src/post.service.ts',
  },
  {
    num: '03',
    title: 'Create a controller',
    body: 'Map HTTP verbs to methods and validate the body with Zod.',
    code: STEP3,
    filename: 'src/post.controller.ts',
  },
  {
    num: '04',
    title: 'Wire the app',
    body: 'Export the app from a module. OpenAPI docs and Scalar are generated automatically.',
    code: STEP4,
    filename: 'src/app.module.ts',
  },
  {
    num: '05',
    title: 'Run & test',
    body: 'Start the server, open /docs, run the included tests, and call endpoints with curl or api-tester.',
    code: STEP5,
    filename: 'terminal',
  },
  {
    num: '06',
    title: 'Typed client',
    body: 'Generate a typed route map so your frontend gets autocomplete and compile-time API safety.',
    code: STEP6,
    filename: 'terminal',
  },
]

export default function TutorialPage() {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: '80px' }}>
        <section>
          <div className="section-label">tutorial</div>
          <h1 className="section-title">Build a blog API in 5 minutes</h1>
          <p className="section-desc">
            A step-by-step guide from zero to a typed, documented, testable Hono API.
          </p>
        </section>

        {steps.map((step, i) => (
          <section key={i} id={`step-${step.num}`}>
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
