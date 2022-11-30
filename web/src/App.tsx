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
    const isHome = location.pathname === '/';
    return (
        <div className="App">
            <header className={['header', isHome ? 'home' : ''].join(' ')}>
                <div className={['back-button', isHome ? 'hidden' : ''].join(' ')}>
                    <Link to="/" className="no-style">
                        <span className="material-symbols-outlined">arrow_back</span>
                    </Link>
                </div>
                <Link to="/" className="no-style">
                    <span className={['title', isHome ? 'large' : ''].join(' ')}>Beslis vis</span>
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
