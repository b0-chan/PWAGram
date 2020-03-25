import {prompt} from './app.js';

//TODO: Added logic for creating post

const shareImageButton = document.querySelector('#share-image-button');
const createPostArea = document.querySelector('#create-post');
const closeCreatePostModalButton = document.querySelector('#close-create-post-modal-btn');

shareImageButton.addEventListener('click', openCreatePostModal);

closeCreatePostModalButton.addEventListener('click', closeCreatePostModal);


function openCreatePostModal() {
    createPostArea.style.display = 'block';
    handlePrompt();
}

function closeCreatePostModal() {
    createPostArea.style.display = 'none';
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
