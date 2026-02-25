import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
} from '@tanstack/react-router'
import { Toaster } from '@/components/ui/sonner'

import '../index.css'
import { Providers } from '@/providers'

export type RouterAppContext = Record<string, never>

export const Route = createRootRouteWithContext<RouterAppContext>()({
  component: RootComponent,
  head: () => ({
    meta: [
      {
        title: 'trator',
      },
      {
        name: 'description',
        content: 'trator is a web application',
      },
    ],
    links: [
      {
        rel: 'icon',
        href: '/favicon.ico',
      },
    ],
  }),
})

function RootComponent() {
  return (
    <>
      <HeadContent />
      <Providers>
        <div className="min-h-dvh w-screen transition-all">
          <Outlet />
        </div>
        <Toaster richColors />
      </Providers>
    </>
  )
}
