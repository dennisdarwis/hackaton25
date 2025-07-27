import AttachmentIcon from '@/components/icons/attachment-icon'
import BackIcon from '@/components/icons/back-icon'
import MicrophoneIcon from '@/components/icons/microphone-icon'
import SendIcon from '@/components/icons/send-icon'
import SettingsIcon from '@/components/icons/settings-icon'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/chat-interface')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div className='flex flex-col h-screen'>
    {/* Top Nav bar */}
    <div id='navbar' className="flex-none bg-[#013d83] grid grid-cols-10 py-2 px-4 text-white">
      <div className="col-span-1 text-white flex items-center justify-center">
        <div className="cursor-pointer">
          <BackIcon onClick={() => { }} />
        </div>
      </div>
      <div className="col-span-8 flex flex-row items-center">
        <div className="mr-4">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
        <div className="flex flex-col pb-2">
          <div className="text-lg font-semibold">ANZ Assistant</div>
          <small className="text-sm leading-none font-medium">Your personal banking assistant</small>
        </div>
      </div>
      <div className="col-span-1 flex items-center justify-center">
        <div className="cursor-pointer">
          <SettingsIcon className="cursor-pointer hover:bg-gray-100" />
        </div>
      </div>
    </div>
    <div id='chat-content' className="grow">

    </div>
    <div id='chat-input' className="flex-none bg-[#ffffff] border-1 border-t-[#eeeeee]-500 grid grid-cols-10 py-2 px-4 text-black">
      <div className="col-span-1 text-white flex items-center justify-center">
        <div className="cursor-pointer">
          <AttachmentIcon color="#000000" onClick={() => { }} />
        </div>
      </div>
      <div className="col-span-8 flex flex-row items-center">
        <Input />
      </div>
      <div className="col-span-1 flex items-center justify-center gap-4">
        <div className="cursor-pointer">
          <MicrophoneIcon color="#000000" onClick={() => { }} />
        </div>
        <div className="cursor-pointer">
          <SendIcon color="#000000" onClick={() => { }} />
        </div>
      </div>
    </div>
  </div>
}
