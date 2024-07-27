import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Header from "./components/Header";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import AddTaskForm from "./pages/AddTaskForm";

function App() {
  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/add-task" element={<AddTaskForm />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
