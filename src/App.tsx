// import Header from "./components/Header";
import Routing from "./components/routing/Routing";
import { Toaster } from "@/components/ui/toaster"
import { useEffect, useState } from "react";

function App() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 480);
    };

    handleResize(); // 초기 체크
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col antialiased">
      <section className="w-full flex justify-between">
        <main className={`flex-1 ${isMobile ? 'mt-16' : ''}`}>
          <Routing />
        </main>
      </section>
      <Toaster />
    </div>
  );
}

export default App;
