import TutorialPage from '#/pages/TutorialPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/tutorial')({ component: TutorialPage })
