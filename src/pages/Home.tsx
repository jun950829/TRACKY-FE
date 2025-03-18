import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="text-center">
      <h1 className="text-3xl font-bold">🏡 Home Page</h1>
      <button
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        onClick={() => navigate("/about")}
      >
        About
      </button>

<button
        className="mt-4 px-4 py-2 bg-green-500 text-white rounded"
        onClick={() => navigate("/login")}
      >
        Login
      </button>
    </div>
  );
}

export default Home;
