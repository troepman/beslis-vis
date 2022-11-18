import React from 'react';
import './App.css';
import BubbleContainer from './components/bubble-container';

import { Link, Outlet, useLocation } from 'react-router-dom';
import GoogleAnalyticEvents from './services/ga4';

function App() {
    const location = useLocation();
    React.useEffect(() => {
        if (location.pathname === '/answer') {
            GoogleAnalyticEvents.navigation.websiteLoad('with_question');
        } else {
            GoogleAnalyticEvents.navigation.websiteLoad('no_question');
        }
    }, []);
    return (
        <div className="App">
            <header id="header">
                <Link to="/" className="no-style">
                    <h1>Beslis vis</h1>
                </Link>
            </header>
            <div className="content">
                <Outlet />
            </div>
            <BubbleContainer />
        </div>
    );
}

export default App;
