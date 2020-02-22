if ('serviceWorker' in navigator) {
    navigator
        .serviceWorker
        .register('/sw.js')
        .then(() => console.log('service worker registered'))
}

export const prompt = {isTriggered: false};

window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault();
    prompt.isTriggered = true;
    prompt.event = e;
});
