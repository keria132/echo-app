import { useAuthStore } from '@/store/useAuthStore';

const ProfilePage = () => {
  const { user } = useAuthStore();

  return (
    <div>
      <h1>Profile</h1>
      <p>My handle: {user?.handle}</p>
      <p>My email: {user?.email}</p>
    </div>
  );
};

export default ProfilePage;
