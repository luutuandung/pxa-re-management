import type { FC } from 'react';
import { Outlet } from 'react-router';
// import { useLanguageActions } from '@/store/languages';
import Footer from '../organisms/Footer';
import Header from '../organisms/Header';
import StickyMessageContainer from '../organisms/StickyMessageContainer';

const MainLayout: FC = () => {
  // const { fetchLanguages } = useLanguageActions();
  // useEffect(() => {
  //   const asyncFunc = async () => {
  //     await fetchLanguages();
  //   };
  //   asyncFunc();
  // }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="w-full py-8 flex-grow">
        <Outlet />
      </main>
      <Footer />
      <StickyMessageContainer />
    </div>
  );
};

export default MainLayout;
