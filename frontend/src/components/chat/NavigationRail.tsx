import { LogOut, MessageCircle, Settings, User, Volume2, VolumeOff } from 'lucide-react';
import EchoLogo from '../EchoLogo';
import NavigationItem from '../NavigationItem';
import { useAuthStore } from '@/store/useAuthStore';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../ui/alert-dialog';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store/useAppStore';
import { NavLink } from 'react-router';
import type { Dispatch, SetStateAction } from 'react';
import { VisuallyHidden } from 'radix-ui';
import notificationSound from '@/assets/sounds/notification.mp3';

const notificationsOnSound = new Audio(notificationSound);

const NavigationRail = ({
  setIsConversationsPanelOpen,
  className,
}: {
  setIsConversationsPanelOpen: Dispatch<SetStateAction<boolean>>;
  className?: string;
}) => {
  const { logout } = useAuthStore();
  const { isSoundEnabled, toggleSound } = useAppStore();

  return (
    <aside
      className={cn(
        'bg-echo-surface border-echo-border sticky left-0 flex w-17 shrink-0 flex-col items-center gap-y-2 border-r py-4',
        className,
      )}
    >
      <EchoLogo className="size-10 rounded-lg shadow-[0_0_22px_var(--echo-p)]/38" iconClassName="size-5" />
      {/* TODO: A BETTER APPROACH OF CLOSING THE PANEL WHEN MESSAGE TAB IS NOT ACTIVE */}
      <NavLink to="/">
        {({ isActive }) => (
          <NavigationItem
            className={cn('mt-4')}
            notification="1"
            icon={MessageCircle}
            iconClassName={cn('p-2.5')}
            onClick={() => setIsConversationsPanelOpen(prev => !prev)}
            isActive={isActive}
          />
        )}
      </NavLink>
      <NavLink to="/profile">
        {({ isActive }) => (
          <NavigationItem icon={User} isActive={isActive} onClick={() => setIsConversationsPanelOpen(false)} />
        )}
      </NavLink>
      <NavLink to="/settings" className="mt-auto">
        {({ isActive }) => (
          <NavigationItem icon={Settings} isActive={isActive} onClick={() => setIsConversationsPanelOpen(false)} />
        )}
      </NavLink>
      <NavigationItem
        icon={isSoundEnabled ? Volume2 : VolumeOff}
        onClick={() => {
          if (!isSoundEnabled) {
            notificationsOnSound.currentTime = 0;
            notificationsOnSound.play().catch(error => console.error('Notification sound error: ', error));
          }
          toggleSound();
        }}
      />
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <NavigationItem icon={LogOut} />
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Do you want to log out of the account?</AlertDialogTitle>
          </AlertDialogHeader>
          <VisuallyHidden.Root>
            <AlertDialogDescription>Confirm logging out of your account.</AlertDialogDescription>
          </VisuallyHidden.Root>
          <AlertDialogFooter className="py-2">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => logout()}>Log out</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </aside>
  );
};

export default NavigationRail;
