//相似歌曲
function getSimSongs(id) {
    let p = new Promise((v, f) => {
        $.post('https://mu-two.vercel.app/simi/song?id=' + id + '&limit=100', e => {
            v(e);
        });
    });
    return p;
}