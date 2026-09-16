import AppRoutes from "./routes/AppRoutes";
import Navbar from "./components/layout/Navbar";

function App() {
  return (
    <>
      <Navbar />

      <main>
        <AppRoutes />
      </main>
    </>
  );
}

export default App;