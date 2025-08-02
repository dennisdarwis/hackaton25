import { API_URL } from '@/commons/urls'
import AttachmentIcon from '@/components/icons/attachment-icon'
import BackIcon from '@/components/icons/back-icon'
import CheckIcon from '@/components/icons/check-icon'
import MicrophoneIcon from '@/components/icons/microphone-icon'
import SendIcon from '@/components/icons/send-icon'
import SettingsIcon from '@/components/icons/settings-icon'
import XIcon from '@/components/icons/x-icon'
import { LoadingConvo, LoadingMessageReceive, LoadingMessageSend, ReceiveMessage, SendMessage } from '@/components/MessageBubbles'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useEffect, useState, useRef } from 'react'

export const Route = createFileRoute('/chat-interface')({
  component: RouteComponent,
})

const conversationJson = [
  { "type": "receive", "senderName": "ANZ Assistant", "message": "Hello, how can I assist you today?", "datetime": "2025-07-29T16:00:00Z" },
  { "type": "send", "message": "I need help with my account balance.", "datetime": "2025-07-29T17:00:00Z" },
  { "type": "receive", "senderName": "ANZ Assistant", "message": "Sure, I can help you with that. Please wait a moment while I retrieve your balance.", "datetime": "2025-07-29T17:00:10Z" },
  { "type": "receive", "senderName": "ANZ Assistant", "message": "Your current account balance is $2,500.00.", "datetime": "2025-07-29T17:00:15Z" },
  { "type": "send", "message": "Thank you!", "datetime": "2025-07-29T17:00:20Z" },
  { "type": "receive", "senderName": "ANZ Assistant", "message": "You're welcome! Is there anything else I can help you with?", "datetime": "2025-07-29T17:00:25Z" },
  { "type": "send", "message": "Can you show me my recent transactions?", "datetime": "2025-07-29T17:00:30Z" },
  { "type": "receive", "senderName": "ANZ Assistant", "message": "Of course. Here are your 3 most recent transactions:\n1. $50.00 - Grocery Store\n2. $120.00 - Online Shopping\n3. $2,000.00 - Salary Deposit", "datetime": "2025-07-29T17:00:35Z" },
  { "type": "send", "message": "Great, thanks. How do I transfer money to a friend?", "datetime": "2025-07-29T17:00:40Z" },
  { "type": "receive", "senderName": "ANZ Assistant", "message": "To transfer money, tap the 'Transfer' button below and follow the instructions. Would you like to start a transfer now?", "datetime": "2025-07-29T17:00:45Z" },
  { "type": "send", "message": "No, that's all for now.", "datetime": "2025-07-29T17:00:50Z" },
  { "type": "receive", "senderName": "ANZ Assistant", "message": "Alright! If you need anything else, just let me know. Have a great day!", "datetime": "2025-07-29T17:00:55Z" }
]

function renderConversation(convArray: any[]) {
  return convArray.map((msg: any, idx: number) => {
    const key = `conversation-${msg.type}-${idx}`;
    if (msg.type === 'receive') {
      return (
        <ReceiveMessage
          key={key}
          senderName={msg.senderName}
          message={msg.message}
          datetime={new Date(msg.datetime)}
          isAudio={msg.isAudio}
          audioURL={msg.audioURL}
        />
      );
    } else if (msg.type === 'send') {
      return (
        <SendMessage
          key={key}
          message={msg.message}
          datetime={new Date(msg.datetime)}
          isAudio={msg.isAudio}
          audioURL={msg.audioURL}
        />
      );
    }
    return null;
  });
}

function RouteComponent() {
  const router = useRouter()
  const username = sessionStorage.getItem('username');
  const [convArray, setConvArray] = useState<any[]>([]);
  const [isReceiveLoading, setIsReceiveLoading] = useState(false);
  const [isSendLoading, setIsSendLoading] = useState(false);
  const [isConvoLoading, setIsConvoLoading] = useState(false);


  useEffect(() => {
    fetchMessages({ isStartup: true });
  }, [])

  useEffect(() => {
    if (convArray.length > 0) {
      const chatContent = document.getElementById('chat-content');
      if (chatContent) {
        chatContent.scrollTo({
          top: chatContent.scrollHeight,
          behavior: 'auto',
        });
      }
    }
  }, [isReceiveLoading, convArray])


  // Fetch messages from backend
  const fetchMessages = async (options: { isStartup?: boolean, isReceive?: boolean, isSend?: boolean }) => {
    if (options.isStartup) {
      setIsConvoLoading(true);
    }
    if (options.isReceive) {
      setIsReceiveLoading(true);
    }
    if (options.isSend) {
      setIsSendLoading(true);
    }
    try {
      const res = await fetch(`${API_URL}/api/messages`, {
        headers: {
          ...(username ? { 'username': username } : {})
        }
      });
      const data = await res.json();
      setConvArray(data);
    } catch (err) {
      // Optionally handle error
    }
    setIsConvoLoading(false);
    setIsReceiveLoading(false);
    setIsSendLoading(false);
  }

  // Handler functions for chat input buttons
  const handleAttachmentClick = () => {
    // TODO: Implement attachment logic

  };


  const handleSendClick = async () => {
    const inputEl = document.getElementById('input-form') as HTMLInputElement | null;
    if (!inputEl || !inputEl.value) return;
    const messageValue = inputEl.value;
    inputEl.value = '';
    setConvArray(prev => [...prev, { type: 'send', message: messageValue, datetime: new Date().toISOString() }]);
    setIsReceiveLoading(true);
    const newMsg = {
      type: 'send',
      message: messageValue,
      datetime: new Date().toISOString()
    };
    try {
      const res = await fetch(`${API_URL}/api/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(username ? { 'username': username } : {}) },
        body: JSON.stringify(newMsg)
      });
      if (res.ok) {
        await fetchMessages({ isReceive: true });
      }
    } catch (err) {
      // Optionally handle error
    }
    setIsReceiveLoading(false);
  };

  return <div className='flex flex-col h-screen'>
    {/* Top Nav bar */}
    <div id='navbar' className="flex-none bg-[#013d83] grid grid-cols-10 py-2 px-4 text-white">
      <div className="col-span-1 text-white flex items-center justify-center">
        <div className="cursor-pointer">
          <BackIcon onClick={() => {
            router.navigate({ to: '/' });
          }} />
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

    {/* chat messages */}
    <div id='chat-content' className="flex flex-col grow mx-auto w-full overflow-y-auto items-center">
      {!isConvoLoading && <div className="px-8 w-full max-w-[800px] pb-2">
        {renderConversation(convArray)}
        {isReceiveLoading && <LoadingMessageReceive />}
        {isSendLoading && <LoadingMessageSend />}
      </div>}
      {isConvoLoading && <LoadingConvo />}
    </div>

    {/* chat box */}
    <div id='chat-input' className="flex-none bg-[#ffffff] border-1 border-t-[#eeeeee]-500 grid grid-cols-10 py-2 px-4 text-black">
      <div className="col-span-1 text-white flex items-center justify-center">
        <div className="cursor-pointer">
          <AttachmentIcon id='attachment-button' color="#000000" onClick={handleAttachmentClick} />
        </div>
      </div>
      <div className="col-span-8 flex flex-row items-center">
        <Input
          id='input-form'
          onKeyDown={e => {
            if (e.key === 'Enter') {
              if (e.shiftKey) {
                // Insert line break at cursor position
                const input = e.target as HTMLInputElement;
                const start = input.selectionStart || 0;
                const end = input.selectionEnd || 0;
                const value = input.value;
                input.value = value.slice(0, start) + '\n' + value.slice(end);
                // Move cursor after the line break
                setTimeout(() => {
                  input.selectionStart = input.selectionEnd = start + 1;
                }, 0);
                e.preventDefault();
              } else {
                e.preventDefault();
                handleSendClick();
              }
            }
          }}
        />
      </div>
      <div className="col-span-1 flex items-center justify-center gap-4">
        <div className="cursor-pointer">
          <SendIcon id='send-button' color="#000000" onClick={handleSendClick} />
        </div>
      </div>
    </div>
  </div>
}
