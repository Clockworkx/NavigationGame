io.on('connection', socket => {
    
    socket.emit('INVITE_RECEIVED', "Invite_received")
    console.log('user connected', socket.id)
    socket.on('disconnect', () => {
        console.log('disconnect')
    })
    socket.on('location_request', (object) => {
        console.log('emit from location_request', object[0])
        
        console.log('asd', getLocations())
        socket.emit('locations_send', getLocations())
        // getLocations().then(location => {
        //     console.log('Locations from getLocations()', location)
        //     socket.emit('locations_send', location)
        // }) 
        
    })
    socket.onAny((eventName, ...args) => {
        console.log(eventName)
      });
      socket.on('connect_error', function(err) {
        console.log("client connect_error: ", err);
    });
    
    socket.on('connect_timeout', function(err) {
        console.log("client connect_timeout: ", err);
    });

})