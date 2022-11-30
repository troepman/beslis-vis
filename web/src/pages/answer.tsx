import * as React from 'react';
import { useLoaderData, useNavigate, LoaderFunctionArgs, redirect } from 'react-router-dom';
import Button from '../components/button';
import ShareButtons from '../components/share-buttons';
import GoogleAnalyticEvents from '../services/ga4';
import './answer.css';

type LoaderData = {
    question: string;
    videoUrl: string;
    answer: string;
};
function formatVideoUrl(fragment: string) {
    return `fragments/${fragment}.mp4`;
}
function formatVideoFragment(fragment: string | null) {
    if (fragment && /^fragment[0-9]+$/.test(fragment)) {
        return fragment;
    } else {
        return undefined;
    }
}

function generateRandomFragment() {
    const n = Math.floor(85 * Math.random());
    return `fragment${n}`;
}

export async function answerLoader({ request }: LoaderFunctionArgs) {
    const url = new URL(request.url);
    console.log(request);
    const q = url.searchParams.get('q');
    const a = formatVideoFragment(url.searchParams.get('a'));

    if (!q) {
        return redirect('/');
    }

    if (!a || a === '') {
        return redirect(`/answer?q=${encodeURIComponent(q)}&a=${encodeURIComponent(generateRandomFragment())}`);
    }

    const videoUrl = formatVideoUrl(a as string);

    return {
        question: q,
        answer: a,
        videoUrl,
    };
}

export default function AnswerPage() {
    const { question, answer, videoUrl } = useLoaderData() as LoaderData;
    const navigate = useNavigate();
    const [state, setState] = React.useState<{
        state: 'Loading' | 'Feeding' | 'Swimming' | 'Done';
        videoReady: boolean;
        animationTime: number;
    }>({ state: 'Loading', videoReady: false, animationTime: 0 });
    const videoRef = React.useRef<HTMLVideoElement>(null);
    React.useEffect(() => {
        // reset animation state
        setState({ state: 'Loading', videoReady: false, animationTime: 0 });
        GoogleAnalyticEvents.navigation.fishAnsweredStarted();
        videoRef.current?.load();
        const interval = setInterval(() => {
            setState((c) => {
                switch (c.state) {
                    case 'Loading':
                        if (c.videoReady && c.animationTime > 2000) {
                            return { ...c, animationTime: 0, state: 'Feeding' };
                        }
                        break;
                    case 'Feeding':
                        if (c.animationTime > 2000) {
                            videoRef.current?.play();
                            return { ...c, animationTime: 0, state: 'Swimming' };
                        }
                        break;
                    case 'Swimming':
                        if (c.animationTime > 10000) {
                            videoRef.current?.pause();
                            GoogleAnalyticEvents.navigation.fishAnsweredFinished();
                            return { ...c, animationTime: 0, state: 'Done' };
                        }
                        break;
                }
                return {
                    ...c,
                    animationTime: c.animationTime + 100,
                };
            });
        }, 100);

        return () => clearInterval(interval);
    }, [question, answer]);

    const onVideoReady = React.useCallback(() => {
        setState((c) => ({ ...c, videoReady: true }));
    }, []);

    const opacities = {
        digesting: state.state === 'Swimming' ? 1 : 0,
        feeding: state.state === 'Feeding' ? 1 : 0,
        searching: state.state === 'Loading' ? 1 : 0,
        videoHider: state.state === 'Loading' ? 1 : 0,
        videoDivider: (state.state === 'Swimming' && state.animationTime > 5000) || state.state === 'Done' ? 1 : 0,
        videoSides: state.state === 'Done' ? 1 : 0,
    };

    return (
        <div className="answer-content">
            <span className="vspace text-align-center">{question}</span>
            <div className="answer-video-wrapper">
                <video className="answer-video" ref={videoRef} muted onLoadedData={onVideoReady} src={videoUrl}></video>
                <div
                    className={['answer-video-hider', state.state === 'Loading' ? 'no-transition' : ''].join(' ')}
                    style={{ opacity: opacities.videoHider, MozOpacity: opacities.videoDivider }}
                ></div>
                <div
                    className="answer-video-side no"
                    style={{ opacity: opacities.videoSides, MozOpacity: opacities.videoSides }}
                >
                    <span>Nee</span>
                </div>
                <div
                    className={['answer-video-divider', state.state === 'Loading' ? 'no-transition' : ''].join(' ')}
                    style={{ opacity: opacities.videoDivider, MozOpacity: opacities.videoDivider }}
                ></div>
                <div
                    className="answer-video-side yes"
                    style={{ opacity: opacities.videoSides, MozOpacity: opacities.videoSides }}
                >
                    <span>Ja</span>
                </div>
            </div>
            {state.state !== 'Done' && (
                <div className="answer-status-container">
                    <span
                        className="text-align-center opacity-fade05"
                        style={{ opacity: opacities.searching, MozOpacity: opacities.searching }}
                    >
                        Schoonmaken van de vissen kom.
                    </span>
                    <span
                        className="text-align-center opacity-fade05"
                        style={{ opacity: opacities.feeding, MozOpacity: opacities.feeding }}
                    >
                        Voeren van jouw vraag..
                    </span>
                    <span
                        className="text-align-center opacity-fade05"
                        style={{ opacity: opacities.digesting, MozOpacity: opacities.digesting }}
                    >
                        Verteren van de vraag, dit kost tijd...
                    </span>
                </div>
            )}
            {state.state === 'Done' && (
                <>
                    <div className="line">
                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'stretch' }}>
                            <Button primary onClick={() => navigate('/')}>
                                {'<<'}
                            </Button>
                            <Button onClick={() => navigate('/answer?q=' + encodeURIComponent(question))}>
                                <span className="material-symbols-outlined">refresh</span>
                            </Button>
                        </div>
                        <span>Deel: </span>
                        <ShareButtons question={question} answer={answer} />
                    </div>
                </>
            )}
        </div>
    );
}
