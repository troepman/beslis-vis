function setupBubblesAnimation(){
    const bubbles = Array.from(document.getElementsByClassName("bubble"));
    function generateState(i, init=false) {
        const paddingWidth = 50;
        const contentWidth = window.innerWidth - 2 * paddingWidth
        return [
            paddingWidth + (i + Math.random()) * (contentWidth / bubbles.length), 
            (init?Math.random():1) * window.innerHeight, 
            Math.random() * 50 + 50
        ];
    }
    const states = bubbles.map((_, i) =>  generateState(i, true))
    function animate() {
        bubbles.forEach((bubble, i) => {
            const state = states[i]
            state[1] -= 1;
            if (state[1] < -100) {
                const n = generateState(i);
                state[0] = n[0]
                state[1] = n[1];
            }
            bubble.style.top = state[1] + "px";
            bubble.style.left = (state[0] - state[2] / 2) + "px";
            bubble.style.width = bubble.style.height = state[2] + "px";
        });

        window.requestAnimationFrame(animate);
    }
    window.requestAnimationFrame(animate);
}



let applicationState = {
    state: "Question",
    question: null,
    videoFragment: null,
    videoReady: false,
    videoEnded: false,
}

const screens = {}

const NUMBER_OF_FRAGMENTS = 85;

const randomQuestions = ['Heb ik zin in koffie?', 'Trek ik een korte broek aan?', 'Ga ik uit vanavond?']

function showScreen(name){
    for (const screenName in screens){
        const screen = screens[screenName];
        screen.style.display = 'none';
    }
    screens[name].style.display = '';
}

function onEndOfSearchAnimation() {
    if (!applicationState.videoReady) {
        setTimeout(onEndOfSearchAnimation, 500);
        return;
    }
    newState({state:'Answer'})
}

function newState(modification) {
    const newState = {...applicationState, ...modification}
    switch (modification.state) {
        case "Question":
            showScreen("question");
        break;
        case "Feeding":
            showScreen("feeding");
            const videoElement = document.getElementById('video-answer');
            videoElement.src = newState.videoFragment
            videoElement.load();
            newState.videoReady = false;
            

            setTimeout(() => {
                onEndOfSearchAnimation();
            }, 6000);
            startSearchAnimation()
            document.getElementById('feeding-question').innerHTML = newState.question;
        break;
        case "Answer":
            stopSearchAnimation();
            showScreen("answer");
            document.getElementById('video-answer').play();
            setTimeout(() => {
                if (applicationState.state === 'Answer') { 
                    onVideoEnded(); 
                }
            }, 15100);
            document.getElementById('video-answer-question').innerText = newState.question;
            document.getElementById('video-overlay-yes').style.display = 'none';
            document.getElementById('video-overlay-no').style.display = 'none';
            document.getElementById('video-overlay-divider').style.opacity = 0;
            document.getElementById('video-overlay-divider').style.opacity;
            document.getElementById('answer-navigate').style.display = 'none';
            document.getElementById('video-answer-status').style.display = '';
            document.getElementById('video-answer-status').style.opacity = 1;

            setTimeout(() => {
                document.getElementById('video-overlay-divider').style.opacity = 1;
                document.getElementById('video-answer-status').style.opacity = 0;
            }, 8000)
        break;
        case "Done":
            document.getElementById('video-overlay-yes').style.display = '';
            document.getElementById('video-overlay-no').style.display = '';
            document.getElementById('answer-navigate').style.display = '';
            document.getElementById('video-answer-status').style.display = 'None';
        break;

    }
    applicationState = newState
}

function formatQuestion(q){
    if (!q.endsWith('?')){
        q += '?'
    }
    return q;
}

function onAskQuestion(ev, random=false) {
    const question = formatQuestion(
        random 
        ? randomQuestions[Math.round(Math.random() * (randomQuestions.length - 1))] 
        : document.getElementById('question-field').value
    );
    
    index = Math.floor(Math.random() * NUMBER_OF_FRAGMENTS);
    newState({state:"Feeding", question, videoFragment: `fragments/fragment${index}.mp4`});

    ev.preventDefault();
}

function onVideoReady() {
    if (applicationState.state !== 'Feeding') { 
        return;
    }

    newState({videoReady: true})
}

function onVideoEnded() {
    newState({state:'Done'})
}

function onGoHome(){
    newState({state:'Question'})
}

function onAskSameQuestion() {
    index = Math.floor(Math.random() * NUMBER_OF_FRAGMENTS);
    newState({state:"Feeding", videoFragment: `fragments/fragment${index}.mp4`});
}

function parseUrl(){
    const query = window.location.search.substring(1);
    const vars = query.split('&');
    const result = {}
    for (let i = 0; i < vars.length; i++) {
        const pair = vars[i].split('=');
        result[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
        
    }

    return result;
}

const searchSpans = {};

const searchAnimation = {
    [0]: () => {
        searchSpans['s1'].style.opacity = 1;
        searchSpans['s2'].style.opacity = 0;
        searchSpans['s3'].style.opacity = 0;
    },
    [2]: () => {
        searchSpans['s1'].style.opacity = 0;
        searchSpans['s2'].style.opacity = 1;
        searchSpans['s3'].style.opacity = 0;
    },
    [4]: () => {
        searchSpans['s1'].style.opacity = 0;
        searchSpans['s2'].style.opacity = 0;
        searchSpans['s3'].style.opacity = 1;
    }
}
let searchAnimationStart = 0;
let searchAnimationHandle;
function searchAnimationRunner() {
    const duration = (Date.now() - searchAnimationStart) / 1000;
    const key = Object.keys(searchAnimation).reduce((best, timestamp) => timestamp <= duration ? timestamp : best, undefined)
    if (key){
        searchAnimation[key]();
    }

    if (duration > 6){
        searchAnimationStart = Date.now();
    }
    searchAnimationHandle = requestAnimationFrame(searchAnimationRunner)
}

function startSearchAnimation(){
    searchAnimationStart = Date.now()
    searchAnimationRunner();
}
function stopSearchAnimation() {
    if (searchAnimationHandle){
        cancelAnimationFrame(searchAnimationHandle);
    }
}

window.addEventListener('DOMContentLoaded', () => {
    document.getElementById("go-button").addEventListener('click', onAskQuestion);
    document.getElementById("go-form").addEventListener('submit', onAskQuestion);
    document.getElementById("random-button").addEventListener('click', (ev) => onAskQuestion(ev, true))
    document.getElementById("video-answer").addEventListener('loadeddata', onVideoReady);
    document.getElementById('video-answer').addEventListener('ended', onVideoEnded);
    document.getElementById('back-button').addEventListener('click', onGoHome);
    document.getElementById('again-button').addEventListener('click', onAskSameQuestion);

    for (const screen of document.getElementsByTagName("screen")){
        screens[screen.id] = screen;
    }

    for (const searchSpan of document.getElementsByClassName("search")){
        searchSpans[searchSpan.id] = searchSpan;
    }

    setupBubblesAnimation();

    const query = parseUrl()
    if ('q' in query){
        const index = Math.round(Math.random() * 118);
        const fragment = query['a'] ?? `fragment${index}`
        
        newState({state:"Feeding", question: formatQuestion(query['q']), videoFragment: `fragments/${fragment}.mp4`});
    } else {
        newState({state:"Question"});
    }
})