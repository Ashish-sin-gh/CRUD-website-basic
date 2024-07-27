const deleteBtn = document.querySelectorAll('.delete-button');
const likeBtn = document.querySelectorAll('.like-button');

Array.from(deleteBtn).forEach(element => {
    element.addEventListener('click', deleteFun);

})