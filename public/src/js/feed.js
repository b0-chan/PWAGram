import {prompt} from './app.js';

const shareImageButton = document.querySelector('#share-image-button');
const createPostArea = document.querySelector('#create-post');
const closeCreatePostModalButton = document.querySelector('#close-create-post-modal-btn');

function openCreatePostModal() {
    createPostArea.style.display = 'block';

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

function closeCreatePostModal() {
    createPostArea.style.display = 'none';
}

shareImageButton.addEventListener('click', openCreatePostModal);

closeCreatePostModalButton.addEventListener('click', closeCreatePostModal);
