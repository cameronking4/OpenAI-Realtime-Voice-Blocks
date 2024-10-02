"use client";

import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cn } from "@/lib/utils";

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
      className
    )}
    {...props}
  />
));
Avatar.displayName = AvatarPrimitive.Root.displayName;

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn("aspect-square h-full w-full", className)}
    {...props}
  />
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-muted",
      className
    )}
    {...props}
  />
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

function Transcriber({ conversation }: { conversation: Array<{ role: string; text: string; timestamp: string; isFinal: boolean }> }) {
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [conversation]);

  return (
    <div className="flex flex-col size-full max-w-full mx-auto bg-background rounded-lg shadow-lg overflow-hidden dark:bg-background">
      <div className="bg-secondary px-4 py-3 flex items-center justify-between dark:bg-secondary">
        <div className="font-medium text-foreground dark:text-foreground">Live Transcript</div>
      </div>
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 z-50">
        {conversation.map((message, index) => (
          <div key={index} className={`flex items-start gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}>
            {message.role === 'assistant' && (
              <Avatar className="w-8 h-8 shrink-0">
                <AvatarImage src="/placeholder-user.jpg" />
                <AvatarFallback>AI</AvatarFallback>
              </Avatar>
            )}
            <div className={`bg-${message.role === 'user' ? 'primary' : 'secondary'} px-4 py-1 rounded-lg max-w-[70%] ${message.role === 'user' ? 'text-background' : 'dark:text-foreground'}`}>
              <p>{message.text}</p>
              <div className="text-xs text-secondary">{message.timestamp}</div>
            </div>
            {message.role === 'user' && (
              <Avatar className="w-8 h-8 shrink-0">
                <AvatarImage src="/placeholder-user.jpg" />
                <AvatarFallback>You</AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Transcriber;
export { Avatar, AvatarImage, AvatarFallback };
