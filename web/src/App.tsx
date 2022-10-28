import React, { useEffect } from 'react';
import './App.css';
import Screen from './components/screen';
import BubbleContainer from './components/bubble-container';

function formatQuestion(q: string) {
    q = q.trim();
    if (!q.endsWith('?')) {
        q += '?';
    }
    return q;
}

function generateRandomQuestion(): string {
    const randomQuestions = ['Heb ik zin in koffie?', 'Trek ik een korte broek aan?', 'Ga ik uit vanavond?'];
    return randomQuestions[Math.round(Math.random() * (randomQuestions.length - 1))];
}

function formatVideoUrl(fragment?: string) {
    if (fragment) {
        return `fragments/${fragment}.mp4`;
    } else {
        const n = Math.floor(85 * Math.random());
        return `fragments/fragment${n}.mp4`;
    }
}

function App() {
    const videoRef = React.useRef<HTMLVideoElement>(null);

    const [appState, setAppState] = React.useState<{
        question: string;
        videoFragment: string;
        videoReady: boolean;
        feedingAnimation: number;
        state: 'Question' | 'Loading' | 'Swimming' | 'Done';
    }>({
        question: '',
        videoFragment: '',
        videoReady: false,
        state: 'Question',
        feedingAnimation: 0,
    });

    const submitQuestion = React.useCallback(
        (q?: string) => {
            const question = formatQuestion(q ?? generateRandomQuestion());
            setAppState((c) => ({
                ...c,
                question,
                state: 'Loading',
                feedingAnimation: 0,
                videoFragment: formatVideoUrl(),
                videoReady: false,
            }));
        },
        [setAppState],
    );

    const onVideoReady = React.useCallback(() => {
        setAppState((c) => ({ ...c, videoReady: true }));
        console.log('VideoReady');
    }, [setAppState]);

    const onDifferentFish = React.useCallback(() => {
        setAppState((c) => ({
            ...c,
            state: 'Loading',
            feedingAnimation: 0,
            videoFragment: formatVideoUrl(),
            videoReady: false,
        }));
    }, [setAppState]);

    const onNewQuestion = React.useCallback(() => {
        setAppState((c) => ({
            ...c,
            state: 'Question',
        }));
    }, [setAppState]);

    useEffect(() => {
        if (appState.state === 'Loading' && videoRef.current) {
            videoRef.current.src = appState.videoFragment;
            videoRef.current.load();
            const handle = setInterval(
                () =>
                    setAppState((c) => ({
                        ...c,
                        feedingAnimation: c.feedingAnimation + 1,
                    })),
                2000,
            );
            return () => clearInterval(handle);
        }
        if (appState.state === 'Swimming' && videoRef.current) {
            videoRef.current.play();
            setTimeout(() => setAppState((c) => ({ ...c, state: 'Done' })), 15000);
        }
    }, [appState.state]);

    useEffect(() => {
        console.log(appState);
        if (appState.feedingAnimation > 2) {
            setAppState((c) => ({ ...c, state: 'Swimming' }));
        }
    }, [appState.feedingAnimation, appState.videoReady]);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.addEventListener('load', () => setAppState((c) => ({ ...c, videoReady: true })));
        }
    }, [videoRef.current]);

    return (
        <div className="App">
            <header id="header">
                <a href="/" className="no-style">
                    <h1>Beslis vis</h1>
                </a>
            </header>
            <div className="content">
                <Screen visible={['Question'].includes(appState.state)}>
                    <form
                        id="go-form"
                        onSubmit={(ev) => {
                            submitQuestion(appState.question);
                            ev.preventDefault();
                        }}
                    >
                        <p className="question-intro">Twijfel je tussen Ja of Nee?</p>
                        <p className="question-intro">Denk niet verder maar laat onze goudvis voor je kiezen!</p>
                        <div className="line vspace">
                            <input
                                className="text-input"
                                type="text"
                                id="question-field"
                                name="question"
                                placeholder="Ga ik ... Ja of Nee?"
                                value={appState.question}
                                onChange={(ev) => setAppState((c) => ({ ...c, question: ev.target.value }))}
                            />
                            <div className="go-button-wrapper">
                                <div
                                    className="go button primary"
                                    id="go-button"
                                    onClick={() => submitQuestion(appState.question)}
                                >
                                    {'>>'}
                                </div>
                            </div>
                        </div>
                        <p className="question-intro">Of... Stel een random vraag</p>
                        <div className="line vspace">
                            <div className="button" id="random-button" onClick={() => submitQuestion()}>
                                Verras me
                            </div>
                        </div>
                    </form>
                </Screen>
                <Screen
                    visible={['Loading'].includes(appState.state)}
                    style={{
                        alignItems: 'center',
                        flexDirection: 'column',
                        justifyContent: 'space-around',
                        display: 'flex',
                    }}
                >
                    <span className="feeding-question" id="feeding-question">
                        {appState.question}
                    </span>
                    <div className="search-wrapper">
                        <span
                            className="search opacity-fade05"
                            style={{ opacity: appState.feedingAnimation % 3 === 0 ? 1 : 0 }}
                        >
                            Vissenkom schoonmaken.
                        </span>
                        <span
                            className="search opacity-fade05"
                            style={{ opacity: appState.feedingAnimation % 3 === 1 ? 1 : 0 }}
                        >
                            Vis zoeken..
                        </span>
                        <span
                            className="search opacity-fade05"
                            style={{ opacity: appState.feedingAnimation % 3 === 2 ? 1 : 0 }}
                        >
                            Jouw vraag voeren...
                        </span>
                    </div>
                </Screen>
                <Screen
                    visible={['Swimming', 'Done'].includes(appState.state)}
                    style={{
                        justifyContent: 'space-around',
                        alignItems: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    <span className="video-answer-question" id="video-answer-question">
                        {appState.question}
                    </span>
                    <div className="video-answer-wrapper">
                        <video id="video-answer" ref={videoRef} muted onLoadedData={onVideoReady}></video>
                        <div className="video-answer-side no" id="video-overlay-no">
                            <span>Nee</span>
                        </div>
                        <div className="video-answer-divider" id="video-overlay-divider"></div>
                        <div className="video-answer-side yes" id="video-overlay-yes">
                            <span>Ja</span>
                        </div>
                    </div>
                    {appState.state === 'Swimming' && (
                        <span id="video-answer-status" className="opacity-fade05">
                            Verteren van de vraag, dit kost tijd...
                        </span>
                    )}
                    {appState.state === 'Done' && (
                        <div className="line" id="answer-navigate">
                            <div className="button primary" id="back-button" onClick={onNewQuestion}>
                                {'<< Stel nieuwe vraag!'}
                            </div>
                            <div className="button" id="again-button" onClick={onDifferentFish}>
                                Andere vis {'>>'}
                            </div>
                        </div>
                    )}
                </Screen>
            </div>
            <BubbleContainer />
        </div>
    );
}

export default App;
