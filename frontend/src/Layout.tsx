import { Outlet } from 'react-router';

const Layout = () => (
  <div className="bg-echo-bg grain grain relative z-0 flex h-screen w-full justify-center overflow-hidden lg:flex">
    <div className="animate-orb-float pointer-events-none absolute -top-40 -left-40 h-150 w-150 rounded-full bg-[radial-gradient(circle,rgba(109,40,217,0.35)_0%,transparent_70%)] blur-[80px]" />
    <div className="animate-orb-float pointer-events-none absolute -bottom-60 left-1/4 h-150 w-150 rounded-full bg-[radial-gradient(circle,rgba(109,40,217,0.15)_0%,transparent_70%)] blur-[80px]" />
    <div className="animate-orb-float pointer-events-none absolute right-0 -bottom-20 h-100 w-100 rounded-full bg-[radial-gradient(circle,rgba(155,77,255,0.35)_0%,transparent_70%)] blur-[80px]" />
    <div className="animate-orb-float pointer-events-none absolute -top-30 -right-50 h-150 w-150 rounded-full bg-[radial-gradient(circle,rgba(155,77,255,0.25)_0%,transparent_70%)] blur-[80px]" />
    <Outlet />
  </div>
);

export default Layout;
