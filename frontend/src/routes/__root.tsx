// src/routes/__root.tsx
/// <reference types="vite/client" />
import type { ReactNode } from 'react'
import {
  Outlet,
  createRootRoute,
  HeadContent,
  Scripts,
} from '@tanstack/react-router'

import appCss from "@/styles/app.css?url"

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'FABRIQ',
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  component: RootComponent,
  // Removed loader, will check sessionStorage in client-side effect
})

import { useEffect } from 'react';
import { useRouter } from '@tanstack/react-router';

function RootComponent() {
  const router = useRouter();
  useEffect(() => {
    // Only run in browser
    if (typeof window !== 'undefined') {
      const username = sessionStorage.getItem('username');
      const accessToken = sessionStorage.getItem('access_token');

      // Helper to decode JWT and get exp
      function getTokenExp(token) {
        if (!token) return null;
        try {
          const payload = token.split('.')[1];
          const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
          return decoded.exp;
        } catch {
          return null;
        }
      }

      const exp = getTokenExp(accessToken);
      const now = Math.floor(Date.now() / 1000);

      if (!username && window.location.pathname !== '/login') {
        router.navigate({ to: '/login' });
      } else if (exp && now > exp) {
        sessionStorage.clear();
        router.navigate({ to: '/login' });
      }
    }
  }, [router]);
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  )
}