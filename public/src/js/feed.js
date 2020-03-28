import {prompt} from './app.js';

//TODO: Added logic for creating post

const shareImageButton = document.querySelector('#share-image-button');
const createPostArea = document.querySelector('#create-post');
const closeCreatePostModalButton = document.querySelector('#close-create-post-modal-btn');
const sharedMomentsArea = document.querySelector('#shared-moments');

shareImageButton.addEventListener('click', openCreatePostModal);

closeCreatePostModalButton.addEventListener('click', closeCreatePostModal);


function openCreatePostModal() {
    createPostArea.style.display = 'block';
    handlePrompt();
}

function closeCreatePostModal() {
    createPostArea.style.display = 'none';
}

function createCard(data) {
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

    data.forEach(createCard);
}


const url = 'https://pwagram-f2fd8.firebaseio.com/posts.json';
fetch(url)
    .then(res => res.json())
    .then(data => {
        console.log('data from web', data);
        const posts = Object.values(data);

        updateUI(posts);
    });



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
