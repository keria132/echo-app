import { patchChatViewed } from '@/api/chat.api';
import { setChatViewedMessageCache, setViewedMessageCache } from '@/lib/cache';
import type { MessageStatus } from '@/types/message.types';
import { useCallback, useEffect, useRef } from 'react';

const DEBOUNCE_MS = 500;

interface UseMessageObserverParameters {
  observerRootRef: React.RefObject<HTMLDivElement | null>;
  currentUserId: string;
  partnerId?: string;
  chatId?: string;
}

interface RefCallbackParameters {
  element: HTMLDivElement;
  _id: string;
  senderId: string;
  status: MessageStatus;
}

export const useMessageObserver = ({
  observerRootRef,
  currentUserId,
  partnerId,
  chatId,
}: UseMessageObserverParameters) => {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null);
  const viewedQueueRef = useRef<Set<string>>(new Set());
  const messagesMapRef = useRef<Map<Element, string>>(new Map());

  const viewedFlush = useCallback(async () => {
    if (!viewedQueueRef.current.size || !partnerId || !chatId) return;
    const messageIds = Array.from(viewedQueueRef.current);

    viewedQueueRef.current.clear();

    setViewedMessageCache(partnerId, messageIds);
    setChatViewedMessageCache(currentUserId, chatId, messageIds.length);

    try {
      await patchChatViewed(chatId, { messageIds });
    } catch (error) {
      console.error('Failed to mark messages as viewed:', error);
    }
  }, [chatId, partnerId, currentUserId]);

  useEffect(() => {
    if (!chatId || !partnerId) return;

    const viewedQueue = viewedQueueRef.current;
    const messagesMap = messagesMapRef.current;

    observerRef.current = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const messageId = messagesMap.get(entry.target);

            //TODO: CONSIDER THROWIG ERROR IN THESE CASES
            if (!messageId) return;

            viewedQueue.add(messageId);
            observerRef.current?.unobserve(entry.target);
            messagesMap.delete(entry.target);

            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            timeoutRef.current = setTimeout(viewedFlush, DEBOUNCE_MS);
          }
        });
      },
      {
        threshold: 1,
        root: observerRootRef.current,
      },
    );

    return () => {
      observerRef.current?.disconnect();
      observerRef.current = null;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      viewedQueue.clear();
      messagesMap.clear();
    };
  }, [chatId, viewedFlush, observerRootRef, partnerId]);

  const refCallback = useCallback(
    ({ element, _id, senderId, status }: RefCallbackParameters) => {
      if (senderId !== currentUserId && status !== 'viewed' && observerRef.current && element) {
        messagesMapRef.current.set(element, _id);
        observerRef.current.observe(element);
      }
    },
    [currentUserId],
  );

  return { refCallback };
};
