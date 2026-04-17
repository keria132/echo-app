import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/useAuthStore';

const ChatPage = () => {
  const { logout } = useAuthStore();

  return (
    <div>
      <h1>Chat Page</h1>
      <Button onClick={() => logout()}>Logout</Button>
    </div>
  );
};

export default ChatPage;
