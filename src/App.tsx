// import Header from "./components/Header";
import Routing from "./components/routing/Routing";
import { Toaster } from "@/components/ui/toaster"

function App() {

  return (
    <div className="min-h-screen bg-background flex flex-col antialiased ">
      <section className="w-full flex justify-between">
        <main className="flex-1">
          <Routing />
        </main>
      </section>
      <Toaster />
    </div>
  );
}

export default App;
