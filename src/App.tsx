import { Component } from "react";
import { BrowserRouter, Route, Routes } from "react-router";
import "./App.scss";
import { Home } from "./pages/home";

class App extends Component {
  state = {
    isOpen: false,
    disclaimerDismissed: false,
    displayText: false,
    displayImages: false,
    devTools: false,
    displayGatherer: false,
  };

  toggle = () => {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  };

  render() {
    return (
      <BrowserRouter>
        <div className="app text-light bg-dark col-md-8 offset-md-2 col-lg-8 offset-lg-2 col-xl-6 offset-xl-3">
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
