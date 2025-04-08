import Header from "./components/Header";
import Routing from "./Routing";

function App() {

  return (
    <div className="min-h-screen bg-background flex flex-col antialiased">
      <Header />
      <main className="flex-1 pb-12">
        <Routing />
      </main>
    </div>
  );
}

export default App;
