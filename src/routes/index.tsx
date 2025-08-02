// src/routes/index.tsx
import * as fs from 'node:fs'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card } from '@/components/ui/card'


const filePath = 'count.txt'

async function readCount() {
  return parseInt(
    await fs.promises.readFile(filePath, 'utf-8').catch(() => '0'),
  )
}

const getCount = createServerFn({
  method: 'GET',
}).handler(() => {
  return readCount()
})

const updateCount = createServerFn({ method: 'POST' })
  .validator((d: number) => d)
  .handler(async ({ data }) => {
    const count = await readCount()
    await fs.promises.writeFile(filePath, `${count + data}`)
  })

export const Route = createFileRoute('/')({
  component: Home,
  loader: async () => await getCount(),
})

function Home() {
  const router = useRouter()
  const state = Route.useLoaderData()

  return (
    <div className='flex flex-col h-screen'>
      <div id='navbar' className="flex-none bg-[#013d83] grid grid-cols-10 py-2 px-4 text-white">
        <div className="col-span-1 text-white flex items-center justify-center"></div>
        <div className="col-span-9 flex flex-row items-center">
          <div className="col-span-10 text-white flex items-center">
            <div className="mr-4">
              <Avatar>
                <AvatarImage src="" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </div>
            <div className="flex flex-col pb-2">
              <div className="text-lg font-semibold">Support Centre</div>
              <small className="text-sm leading-none font-medium">We're here to help</small>
            </div>
          </div>
        </div>
        <div className="col-span-1 text-white flex items-center justify-center"></div>
        <div className="col-span-9 flex flex-row items-center">
          <Card className='bg-[#2A518A] p-4 max-w-[80%] gap-0 border-0'>
            <div className="text-xs font-medium text-white">Welcome back, user</div>
            <div className="text-xs text-white">Last contact: Card replacement inquiry (5 days ago)</div>
          </Card>
        </div>
      </div>
      <div id='menu' className="flex flex-col grow mx-auto w-full overflow-y-auto py-16 items-center">
        <div className="px-4 max-w-[1000px] pb-2 grid grid-cols-12">
          {[
            { label: "Live Chat", description: "Chat with our support team", icon: "💬", onClick: () => router.navigate({to: '/chat-interface'}) },
            { label: "Phone Support", description: "Call us directly", icon: "📞", onClick: () => router.navigate({to: '/chat-interface'}) },
            { label: "Email Support", description: "Send us a message", icon: "✉️", onClick: () => router.navigate({to: '/chat-interface'}) },
          ].map((card) => (
            <Card
              key={card.label}
              className="col-span-10 xs:col-span-12 sm:col-span-6 lg:col-span-3 m-2 flex flex-col items-start p-6 hover:shadow-lg transition-shadow"
              onClick={card.onClick} style={{ cursor: 'pointer' }}
            >
              <div className="text-3xl mb-2">{card.icon}</div>
              <div className="font-semibold text-lg mb-1">{card.label}</div>
              <div className="text-sm text-muted-foreground mb-4">{card.description}</div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}