import DocsPage from '#/pages/DocsPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/docs')({ component: DocsPage })
