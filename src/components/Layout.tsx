import { useLocation } from "react-router";
import Footer from "./Footer";
import Header from "./Header";
import { useEffect } from "react";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <ScrollToTop /> 
      
      <div className="bg-gradient-to-b from-[#233B5D] to-[#121C2E] min-h-[calc(100dvh-172px-96px)] px-10 sm:px-20">
        <main className="mx-auto max-w-5xl w-full">
          {children}
        </main>
      </div>

      <Footer />
    </>
  )
}