var express= require('express')
var socketIO=require('socket.io')
var http = require('http')
var app = express()
var server= http.createServer(app)
var io=socketIO(server)
// var path = require('path')
var players=[]
var total_players=2
var startGame=0
app.use(express.static('static'))
app.get('/',function(req,res){
  // res.sendfile('index.html')
  res.sendFile(__dirname +'/index.html')
  // res.sendFile(__dirname +'/game.js')
})

var nsp = io.of('/space');

nsp.on('connection', function(socket) {
  console.log('someone connected');

  nsp.emit('totalPlayers',total_players)
  
  socket.on('data',(data)=>{
    console.log(data)
    nsp.emit('clickData',data)
  })

  socket.on('game_over',(data)=>{
    console.log('over')
    data--
    nsp.emit('game_over_res',players[data]+' is winner !!!')
    players=[]
    startGame=0
  })

  socket.on('newPlayer',(data)=>{
    if(data==undefined || data==''){
      players.push('unknown')
    }
    else{
      players.push(data) 
    }
    console.log(players.length)

    if(total_players==players.length){
      startGame=1
      nsp.emit('startGame',startGame)
    }
  })

  socket.on('playerColor',(data)=>{
    var loc=players.indexOf(data)
    var color
    if(loc==0)
    color='RED'
    else if(loc==1)
    color='GREEN'
    else if(loc==2)
    color='BLUE'
    else if(loc==3)
    color='YELLOW'

    socket.emit('playerColor',{color:color,no:loc})
  })
  
  socket.on('disconnect',()=>{
    console.log('disconnected')
  })
});

server.listen(5000,()=>{
  console.log('running')
})