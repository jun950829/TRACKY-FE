// import Header from "./components/Header";
import Routing from "./Routing";
import { Toaster } from "@/components/ui/toaster"
import Sidebar from "./components/Sidebar";

function App() {

  return (
    <div className="min-h-screen bg-background flex flex-col antialiased">
      <section className="w-full flex justify-between">
        <Sidebar />
        <main className="flex-1 pb-12">
          <Routing />
        </main>
      </section>
      <Toaster />
    </div>
  );
}

export default App;
