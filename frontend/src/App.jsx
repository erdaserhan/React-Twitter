import { Routes } from "react-router-dom";

function App() {
  return (
    <div className="flex max-w-6xl mx-auto">
      <Routes>
        <Route path='/' element={<Homepage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/signup' element={<SignUpPage />} />
      </Routes>
    </div>
  );
}

export default App;
