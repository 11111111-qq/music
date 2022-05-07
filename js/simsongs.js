function simsongs(id) {
    let q = getSimSongs(id).then(data => {
        let p = new Promise((v, f) => {
            v(songFn(data.songs, 'songs3'));
        });
        return p;
    });
    return q;
};