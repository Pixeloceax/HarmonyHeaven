import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  Outlet,
  Link,
} from "react-router-dom";
import Test from "./components/test";

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(<Route path="/test" element={<Test />}></Route>)
  );
  return (
    <>
      <div>
        <Link to="/">Home</Link>
        <Link to="/test">Test</Link>
      </div>
      <div>
        <Outlet />
      </div>
    </>
  );
}

export default App;
