const http = require('http');
const fs = require('fs');

const { Player } = require('./game/class/player');
const { World } = require('./game/class/world');

const worldData = require('./game/data/basic-world-data');

let player;
let world = new World();
world.loadWorld(worldData);

const server = http.createServer((req, res) => {

  /* ============== ASSEMBLE THE REQUEST BODY AS A STRING =============== */
  let reqBody = '';
  req.on('data', (data) => {
    reqBody += data;

  });

  req.on('end', () => { // After the assembly of the request body is finished
    /* ==================== PARSE THE REQUEST BODY ====================== */
    if (reqBody) {
      req.body = reqBody
        .split("&")
        .map((keyValuePair) => keyValuePair.split("="))
        .map(([key, value]) => [key, value.replace(/\+/g, " ")])
        .map(([key, value]) => [key, decodeURIComponent(value)])
        .reduce((acc, [key, value]) => {
          acc[key] = value;
          return acc;
        }, {});
    }

    /* ======================== ROUTE HANDLERS ========================== */
    console.log(req.method, req.url)
    // Phase 1: GET /
    if (req.method === 'GET' && req.url === '/') {
      res.setHeader('Content-Type', 'text/html');
      res.statusCode = 200;

      const htmlString = fs.readFileSync('./views/new-player.html', 'utf-8');
      const htmlPage = htmlString.replace(/#{availableRooms}/g, world.availableRoomsToString());
      return res.end(htmlPage);      
    }

    // Phase 2: POST /player
    if (req.method === 'POST' && req.url.startsWith('/player') === true) {
      res.statusCode = 302;

      // console.log(req.body)
      let startingRoom = world.rooms[req.body.roomId];
      player = new Player (req.body.name, startingRoom);

      res.setHeader('location', `/rooms/${startingRoom.id}`);
      console.log(`adding ${player.name} in ${player.currentRoom.id}`);
      return res.end();
    }

    if (player === undefined) {
      res.statusCode = 302;
      res.setHeader('location', '/');
      return res.end();
    }

    // Phase 3: GET /rooms/:roomId
    if (req.method === 'GET' && req.url.startsWith('/rooms')) {

      //checks if requested room is same as players current room
      const roomId = req.url.split('/')[2];
      if (roomId != player.currentRoom.id) {
        //redirects to the correct room if not
        res.statusCode = 302;
        res.setHeader('location', `/rooms/${player.currentRoom.id}`)
        return res.end();
      }

      //checks if url is requesting a room
      if (req.url.split('/').length === 3) {
        res.statusCode = 200;
        res.setHeader('content-type', 'text/html');
        const htmlString = fs.readFileSync('./views/room.html', 'utf-8');
        const room = player.currentRoom;
        const htmlPage = htmlString
          .replace(/#{roomName}/g, room.name)
          .replace(/#{inventory}/g, player.inventoryToString())
          .replace(/#{roomItems}/g, room.itemsToString())
          .replace(/#{exits}/g, room.exitsToString());
        return res.end(htmlPage);
      }
    }

    // Phase 4: GET /rooms/:roomId/:direction
    if (req.method === 'GET' && req.url.startsWith('/rooms')) {
      //checks if requested room is same as players current room
      const roomId = req.url.split('/')[2];
      if (roomId != player.currentRoom.id) {
        //redirects to the correct room if not
        res.statusCode = 302;
        res.setHeader('location', `/rooms/${player.currentRoom.id}`)
        return res.end();
      }

      if (req.url.split('/').length === 4) {
        let direction = req.url.split('/')[3][0].toLocaleLowerCase();
        try {
          player.move(direction)
          console.log(`moved to ${player.currentRoom.id}`);
        } catch {
          console.log(`Error: redirecting to room ${player.currentRoom.id}`)
        }
        
        res.statusCode = 302;
        res.setHeader('location', `/rooms/${player.currentRoom.id}`)
        return res.end();
      }
    }

    // Phase 5: POST /items/:itemId/:action
    if (req.method === 'POST' && req.url.startsWith('/items')) {
      let itemId = req.url.split('/')[2];
      let action = req.url.split('/')[3];
      console.log(itemId, action)
      try {
        switch (action) {
          case 'take':
            console.log(`player took an item`)
            player.takeItem(itemId);
            break;
          case 'drop':
            console.log(`player dropped an item`)
            player.dropItem(itemId);
            break;
          case 'eat':
            console.log(`player ate an item`)
            player.eatItem(itemId);
            break;
        }
      } catch (error) {
        console.log(`action failed: redirecting`, error.message)
        const htmlString = fs.readFileSync('./views/error.html', 'utf-8');
        const htmlPage = htmlString
          .replace(/#{errorMessage}/g, error.message)
          .replace(/#{roomId}/, player.currentRoom.id);
          res.statusCode = 404;
          res.setHeader('content-type', 'text/html');
          return res.end(htmlPage);
      }

      res.statusCode = 302;
      res.setHeader('location', `/rooms/${player.currentRoom.id}`)
      return res.end();
    }
    // Phase 6: Redirect if no matching route handlers
    res.statusCode = 302;
    res.setHeader('location', `/rooms/${player.currentRoom.id}`);
    return res.end();
  })
});

const port = 5000;

server.listen(port, () => console.log('Server is listening on port', port));