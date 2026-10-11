import ChangelogPage from '#/pages/ChangelogPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/changelog')({ component: ChangelogPage })
