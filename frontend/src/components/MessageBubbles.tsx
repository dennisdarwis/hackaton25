import { Card } from '@/components/ui/card';
import { Skeleton } from './ui/skeleton';
import { renderWithLineBreaks } from '../lib/utils';

export const ReceiveMessage = ({ senderName, message, datetime }: { senderName: string, message: string, datetime: Date }) => {
    return (
        <div className="flex flex-row mt-4">
            <Card className='bg-[#f3f4f6] p-4 max-w-[70%] gap-0'>
                <div className="text-xs font-medium">{senderName}</div>
                <div className='whitespace-normal break-words'>
                    {renderWithLineBreaks(message)}
                </div>
                <div className="text-xs">{datetime.toLocaleDateString()} {datetime.toLocaleTimeString()}</div>
            </Card>
        </div>
    )
}

export const SendMessage = ({ message, datetime }: { message: string, datetime: Date }) => {
    return (
        <div className="flex flex-row justify-end mt-4">
            <Card className='p-4 max-w-[70%] gap-0'>
                <div className='whitespace-normal break-words'>
                    {renderWithLineBreaks(message)}
                </div>
                <div className="text-xs">{datetime.toLocaleDateString()} {datetime.toLocaleTimeString()}</div>
            </Card>
        </div>
    )
}

export const LoadingMessageReceive = () => {
    return (
        <div className="flex flex-row mt-4">
            <Skeleton className="bg-[#f3f4f6] p-4 min-w-[70%] min-h-[80px] gap-0" />
        </div>
    )
}

export const LoadingMessageSend = () => {
    return (
        <div className="flex flex-row justify-end mt-4">
            <Skeleton className="bg-[#f3f4f6] p-4 min-w-[70%] min-h-[80px] gap-0" />
        </div>
    )
}

export const LoadingConvo = () => {
    return (
        <div className="flex flex-col gap-4 px-8 min-w-[50%] pb-2">
            <LoadingMessageReceive />
            <LoadingMessageSend />
            <LoadingMessageReceive />
            <LoadingMessageSend />
            <LoadingMessageReceive />
        </div>
    )
}
