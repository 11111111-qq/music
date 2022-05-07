$(() => {

    $.get('https://neteasecloudmusicapi.vercel.app/login/status', e => {
        console.log(e);
    })

})