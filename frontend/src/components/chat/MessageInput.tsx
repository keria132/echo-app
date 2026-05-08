import { ImagePlus, Send, Smile, X } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useEffect, useRef, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { useAuthStore } from '@/store/useAuthStore';
import { imageToBase64 } from '@/lib/utils';
import { useMessageMutation } from '@/hooks/useMessageMutation';

const MessageInput = ({ userId }: { userId: string }) => {
  const [text, setText] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { user } = useAuthStore();
  const messageMutation = useMessageMutation(user!._id, userId);

  const previewUrl = image ? URL.createObjectURL(image) : null;

  useEffect(
    () => () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    },
    [previewUrl],
  );

  const handleSend = async () => {
    if (!text.trim() && !image) return;

    const payload = {
      text: text.trim(),
      ...(image && { image: await imageToBase64(image) }),
    };

    setText('');
    handleRemoveImage();

    messageMutation.mutate(payload);
  };

  const handleRemoveImage = () => {
    setImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="bg-echo-surface border-echo-border border-t">
      {previewUrl && (
        <div className="flex items-center gap-2 px-4 pt-3">
          <div className="relative">
            <Avatar size="lg" className="rounded-md">
              <AvatarImage src={previewUrl} className="object-cover" />
              <AvatarFallback>
                <ImagePlus className="size-4" />
              </AvatarFallback>
            </Avatar>
            <Badge
              variant="destructive"
              className="absolute -top-1.5 -right-1.5 flex size-4 cursor-pointer items-center justify-center rounded-full p-0"
              onClick={handleRemoveImage}
            >
              <X className="size-2.5" />
            </Badge>
          </div>
          <p className="text-echo-t3 max-w-30 truncate text-xs">{image?.name}</p>
        </div>
      )}
      <div className="flex items-center gap-2 p-4">
        <Input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept="image/*"
          onChange={event => setImage(event.target.files?.[0] ?? null)}
        />
        <Button
          variant="ghost"
          className="text-echo-t3 hover:text-echo-t2 rounded-md"
          size="icon-lg"
          onClick={() => fileInputRef.current?.click()}
        >
          <ImagePlus className="size-5" />
        </Button>
        <Input
          placeholder="Write a message"
          type="text"
          onChange={event => setText(event.target.value)}
          onKeyDown={event => event.key === 'Enter' && !event.shiftKey && handleSend()}
          value={text}
        />
        <Button variant="ghost" className="text-echo-t3 hover:text-echo-t2 rounded-md" size="icon-lg">
          <Smile className="size-5" />
        </Button>
        <Button variant="primary" size="icon-xl" onClick={handleSend}>
          <Send className="size-5" />
        </Button>
      </div>
    </div>
  );
};

export default MessageInput;
