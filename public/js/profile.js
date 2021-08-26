$(document).ready(() => {

    loadPosts();
})

async function loadPosts(){

    const tweets = await axios.get('/api/post',{
        params: {postedBy:profileUserId}
    });

    for(let post of tweets.data){

        console.log(post);
        const html = createPostHtml(post);

        $('.userPostsContainer').prepend(html);
    }
}
