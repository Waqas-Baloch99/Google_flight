import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import hero from "../src/assets/hero.svg";
import SearchBar from "./components/SearchBar";
import Contact from "./components/Contact";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';  // Import necessary routing components

function App() {
  return (
    <Router>
      <div className="overflow-hidden">
        <div className="m-auto my-20">
          <h1 className="text-center font-normal text-6xl mt-[-50px] lg:mt-[-150px]">Flights</h1>
        </div>
        <SearchBar />
        
        {/* Define Routes for each page */}
        <Routes>
          {/* Home Route */}
          <Route path="/" element={<div></div>} />
          {/* Contact Route */}
          <Route path="/contact" element={<Contact />} />
        </Routes>

        {/* Footer - TODO: Add footer component here */}
      </div>
    </Router>
  );
}

export default App;
