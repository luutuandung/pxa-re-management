import type { FC } from 'react';
import { Outlet } from 'react-router';
import Footer from '../organisms/Footer';
import Header from '../organisms/Header';
import StickyMessageContainer from '../organisms/StickyMessageContainer';
import Backdrop from '@/components/molecules/Backdrop.tsx'
import ConfirmationDialog from '@/components/organisms/ConfirmationDialog.tsx';


const MainLayout: FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="w-full py-8 flex-grow">
        <Outlet />
      </main>
      <Footer />
      <ConfirmationDialog />
      <StickyMessageContainer />
      <Backdrop />
    </div>
  );
};

export default MainLayout;
