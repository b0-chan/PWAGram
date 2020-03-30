import {prompt} from './app.js';
import {getAllDataFromDB} from './db.js';

//TODO: Added logic for creating post
const URL = 'https://pwagram-f2fd8.firebaseio.com/posts.json';

const shareImageButton = document.querySelector('#share-image-button');
const createPostArea = document.querySelector('#create-post');
const closeCreatePostModalButton = document.querySelector('#close-create-post-modal-btn');
const sharedMomentsArea = document.querySelector('#shared-moments');

shareImageButton.addEventListener('click', openCreatePostModal);
closeCreatePostModalButton.addEventListener('click', closeCreatePostModal);

(async () => await loadPosts())();


function openCreatePostModal() {
    createPostArea.style.display = 'block';
    handlePrompt();
}

function closeCreatePostModal() {
    createPostArea.style.display = 'none';
}

function renderCard(data) {
    const cardWrapper = document.createElement('div');
    cardWrapper.className = 'shared-moment-card mdl-card mdl-shadow--2dp';
    const cardTitle = document.createElement('div');
    cardTitle.className = 'mdl-card__title card-title';
    cardTitle.style.backgroundImage = `url(${data.image})`;
    cardWrapper.appendChild(cardTitle);
    const cardTitleTextElement = document.createElement('h2');
    cardTitleTextElement.className = 'mdl-card__title-text card-title-text';
    cardTitleTextElement.textContent = data.title;
    cardTitle.appendChild(cardTitleTextElement);
    const cardSupportingText = document.createElement('div');
    cardSupportingText.className = 'mdl-card__supporting-text card-supporting-text';
    cardSupportingText.textContent = data.location;
    cardWrapper.appendChild(cardSupportingText);
    componentHandler.upgradeElement(cardWrapper);
    sharedMomentsArea.appendChild(cardWrapper);
}

function clearCards() {
    while (sharedMomentsArea.hasChildNodes()) {
        sharedMomentsArea.removeChild(sharedMomentsArea.lastChild);
    }
}

function updateUI(data) {
    clearCards();

    data.forEach(renderCard);
}

async function loadPosts() {
    try {
        const res = await fetch(URL);
        const data = await res.json();

        updateUI(Object.values(data));
        console.log('data from web', data);
    } catch (e) {
        console.error('failed loading data from web');
        // Using cache
        // const data = await tryGetResFromCache();
        // updateUI(Object.values(data))

        // Using indexedDB
        const data = await tryGetDataFromDB();

        updateUI(data);
    }
}

async function tryGetResFromCache() {
    if ('caches' in window) {
        const response = await caches.match(URL);

        if (response) {
            return response.json();
        }
    }
}

async function tryGetDataFromDB() {
    if ('indexedDB' in window) {

        return getAllDataFromDB('posts');
    }

}

function handlePrompt() {
    if (prompt.isTriggered) {
        prompt.event.prompt();
        prompt.event
            .userChoice
            .then(({outcome}) => {
                if (outcome === 'dismissed') {
                    console.log('user choice dismissed');
                } else {
                    console.log('user choice add app to home screen');
                }

                prompt.isTriggered = false;
            });
    }
}
