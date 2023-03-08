const http = require('http');
const fs = require('fs');

/* ============================ SERVER DATA ============================ */
let artists = JSON.parse(fs.readFileSync('./seeds/artists.json'));
let albums = JSON.parse(fs.readFileSync('./seeds/albums.json'));
let songs = JSON.parse(fs.readFileSync('./seeds/songs.json'));

let nextArtistId = 2;
let nextAlbumId = 2;
let nextSongId = 2;

// returns an artistId for a new artist
function getNewArtistId() {
  const newArtistId = nextArtistId;
  nextArtistId++;
  return newArtistId;
}

// returns an albumId for a new album
function getNewAlbumId() {
  const newAlbumId = nextAlbumId;
  nextAlbumId++;
  return newAlbumId;
}

// returns an songId for a new song
function getNewSongId() {
  const newSongId = nextSongId;
  nextSongId++;
  return newSongId;
}

/* ======================= PROCESS SERVER REQUESTS ======================= */
const server = http.createServer((req, res) => {
  console.log(`${req.method} ${req.url}`);

  // assemble the request body
  let reqBody = "";
  req.on("data", (data) => {
    reqBody += data;
  });

  req.on("end", () => { // finished assembling the entire request body
    // Parsing the body of the request depending on the "Content-Type" header
    if (reqBody) {
      switch (req.headers['content-type']) {
        case "application/json":
          req.body = JSON.parse(reqBody);
          break;
        case "application/x-www-form-urlencoded":
          req.body = reqBody
            .split("&")
            .map((keyValuePair) => keyValuePair.split("="))
            .map(([key, value]) => [key, value.replace(/\+/g, " ")])
            .map(([key, value]) => [key, decodeURIComponent(value)])
            .reduce((acc, [key, value]) => {
              acc[key] = value;
              return acc;
            }, {});
          break;
        default:
          break;
      }
      console.log(req.body);
    }

    /* ========================== ROUTE HANDLERS ========================== */

    // Your code here
    res.statusCode = 200;
    res.setHeader('content-type', 'application/json')
    const splitUrl = req.url.split('/');

    //Get all the artists
    if (req.method === 'GET' && req.url === '/artists') {
      return res.end(JSON.stringify(Object.values(artists)));
    }

    //Get all albums
    if (req.method === 'GET' && req.url ==='/albums') {
      return res.end(JSON.stringify(Object.values(albums)));
    }

    //Get a specific artist's details based on artistId
    if (req.method === 'GET' && splitUrl.length === 3 && req.url.startsWith('/artists')) {
      let artistId = splitUrl[2];
      let artist = artists[artistId];
      if (artist) {
        const artistDetails  = {};
        artistDetails.artistId = artist.artistId;
        artistDetails.name = artist.name;
        artistDetails.albums = getAlbumsByArtist(artistId);
  
        return res.end(JSON.stringify(artistDetails))
      }
    }

    //Add an artist
    if (req.method === 'POST' && req.url ==='/artists') {
      if(req.body.name) {
        res.statusCode = 201;
        const artistId = getNewArtistId();
        artists[artistId] = {
          artistId: artistId,
          name: req.body.name
        };
        return res.end(JSON.stringify(artists[artistId]))
      }
    }

    //Edit a specified artist by artistId
    if ((req.method === 'PUT' || req.method === 'PATCH') && req.url.startsWith('/artists') && splitUrl.length === 3) {
      const artistId = splitUrl[2];
      const newName = req.body.name;
      let artist = artists[artistId];
      if (artist && newName) {
        artist.name = newName;
        artist.updatedAt = new Date().toJSON();
  
        return res.end(JSON.stringify(artist))
      }
    }

    //Delete a specified artist by artistId
    if (req.method === 'DELETE' && req.url.startsWith('/artists') && splitUrl.length === 3) {
      const artistId = splitUrl[2];
      if (artists[artistId]) {
        delete artists[artistId];
        return res.end(`{"Record successfully deleted"}`)
      }
    }

    //Get all albums of a specific artist based on artistId
    if (req.method === 'GET' && splitUrl[1] === 'artists' && splitUrl[3] === 'albums' && splitUrl.length === 4) {
      const artistId = splitUrl[2];
      const bandAlbums = getAlbumsByArtist(artistId);
      return res.end(JSON.stringify(bandAlbums))
    }

    //Get a specific album's details based on albumId
    if (req.method === 'GET' && req.url.startsWith('/albums') && splitUrl.length === 3) {
      const albumId = splitUrl[2];
      const album = albums[albumId]
      if (album){
        const albumDetails = {};
        for (const key in album) {
          albumDetails[key] = album[key];
        }
        albumDetails.artist = artists[album.artistId];
        albumDetails.songs = getSongsByAlbum(albumId);
        return res.end(JSON.stringify(albumDetails));
      }
    }

    //Add an album to a specific artist based on artistId
    if (req.method === 'POST' && splitUrl.length === 4 && splitUrl[1] === 'artists' && splitUrl[3] === 'albums') {
      const artistId = splitUrl[2];
      const artist = artists[artistId];
      const name = req.body.name;
      if (artist && name) {
        res.statusCode = 201;

        const album = {}
        album.albumId = getNewAlbumId();
        album.name = name;
        album.artistId = artistId;
        albums[album.albumId] = album;

        return res.end(JSON.stringify(album))
      }
    }

    //edit a specified album by albumID
    if (req.method === 'PATCH' || req.method === 'PUT' && splitUrl.length === 3 && splitUrl[1] === 'albums') {
      const album = albums[splitUrl[2]]
      if (album && req.body.name) {
        album.name = req.body.name;
        return res.end(JSON.stringify(album))
      }
    }

    //delete a specified album by albumId
    if (req.method === 'DELETE' && req.url.startsWith('/albums') && splitUrl.length === 3) {
      const albumId = splitUrl[2];
      if (albums[albumId]) {
        delete albums[albumId];
        return res.end(`{"Record successfully deleted"}`)
      }
    }

    // Get all songs of a specific artist based on artistId
    if (req.method === 'GET' && splitUrl.length === 4 && splitUrl[1] === 'artists' && splitUrl[3] === 'songs') {
      const artistId = splitUrl[2];
      const artist = artists[artistId];
      if (artist) {
        const albums = getAlbumsByArtist(artistId);
        const songs = [];
        albums.forEach(album => {
          const albumSongs = getSongsByAlbum(album.albumId);
          songs.push(...albumSongs);
        })
        
        return res.end(JSON.stringify(songs));
      }
    }

    // Get all songs of a specific album based on albumId

    // Get all songs of a specified trackNumber

    // Get a specific song's details based on songId

    // Add a song to a specific album based on albumId

    // Edit a specified song by songId

    // Delete a specified song by songId

    //endpoint not found
    res.statusCode = 404;
    res.setHeader('Content-Type', 'application/json');
    res.write(`{"Endpoint not found"}`);
    return res.end();
  });
});

function getAlbumsByArtist(artistId) {
  const bandAlbums = [];
  for (const album in albums) {
    if (albums[album].artistId == artistId) {
      bandAlbums.push(albums[album]);
    }
  }

  return bandAlbums
}

function getSongsByAlbum(albumId) {
  const albumSongs = [];
  for (const song in songs) {
    // console.log(song)
    if (songs[song].albumId == albumId) {
      albumSongs.push(songs[song]);
    }
  }

  return albumSongs;
}

const port = 5000;

server.listen(port, () => console.log('Server is listening on port', port));