import React from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import AppA from './projects/AppA';
import AppB from './projects/AppB';

const projectList = [
  { name: 'App A', path: '/app-a', element: <AppA /> },
  { name: 'App B', path: '/app-b', element: <AppB /> },
];

const Home: React.FC = () => (
  <div>
    <h1>Catchall - My React Projects</h1>
    <ul>
      {projectList.map((project, index) => (
        <li key={index}>
          <Link to={project.path}>{project.name}</Link>
        </li>
      ))}
    </ul>
  </div>
);

const App: React.FC = () => {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          {projectList.map((project, index) => (
            <Route key={index} path={project.path} element={project.element} />
          ))}
        </Routes>
      </div>
    </Router>
  );
};

export default App;