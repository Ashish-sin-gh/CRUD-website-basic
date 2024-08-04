document.addEventListener('DOMContentLoaded', ()=>{
    const deleteBtn = document.querySelectorAll('.delete-button');
    const likeBtn = document.querySelectorAll('.like-button');

    deleteBtn.forEach(element => {
        element.addEventListener('click', deleteFun);
    });

    likeBtn.forEach(element => {
        element.addEventListener('click', addLikeFun);
    });

    async function deleteFun(event){
        const delBtnIndex = event.target.getAttribute('data-index');
        const nameStr = document.querySelectorAll('.name-span')[delBtnIndex].innerText;
        const quoteStr = document.querySelectorAll('.quote-span')[delBtnIndex].innerText;
        const likesStr = Number(document.querySelectorAll('.like-span')[delBtnIndex].innerText);
        
        console.log(delBtnIndex);

        try{
            const response = await fetch('/delete', {
                method : 'delete',
                headers : {'content-Type' : 'application/json'},
                body : JSON.stringify({
                    'nameD' : nameStr,
                    'quoteD' : quoteStr,
                    'likeD' : likesStr
                })
            });
            const data = await response.json;
            console.log(data);
            location.reload();
        }
        catch(err){
            return console.error(err);
        }
    }

    async function addLikeFun(event){
        const likeBtnIdx = event.target.getAttribute('data-index');
        const nameStr = document.querySelectorAll('.name-span')[likeBtnIdx].innerText;
        const quoteStr = document.querySelectorAll('.quote-span')[likeBtnIdx].innerText;
        const likesStr = Number(document.querySelectorAll('.like-span')[likeBtnIdx].innerText);
        
        console.log(likeBtnIdx);

        try{
            const response = await fetch('/addLike', {
                method: 'put',
                headers: {'Content-Type' : 'application/json'},
                body: JSON.stringify({ // for sending JSON data to server
                    'nameIs' : nameStr,
                    'quoteIs' : quoteStr,
                    'likeIs' : likesStr
                })
            })
            const result = await response.json();
        }
        catch(err){
            return console.error(err);
        }
    }
});

