﻿# NOTE

the depth in meters isn't the exact value of the actual depth

the general Idea pseudocode logic may have changed overtime
it is just meant to be the general structure in the beginning

easy
boss hp: 3, 4, 5
oxygenAdd: 5 - 15
allowedWordLength: 3 - 5

medium
boss hp: 3, 5, 7
oxygenAdd: 5 - 10
allowedWordLength: 4 - 5

hard
boss hp: 5, 7, 10
oxygenAdd: 5 - 10
allowedWordLength: 5

extreme:
boss hp: 5, 10, 15
oxygenAdd: 3 - 8
allowedWordLength: 5

# General Idea

User Creation:
	frontend: 
	 -socket.emit("create_user", {username, avatar})

	 -socket.on("login"):
	  -localStorage.setItem('instanceToken', jwt);
	  -{change buttons}

	backend:
	 -socket.on("create_user"):
	  -generate random instanceID
	  -jwt.sign({username, avatar, instanceID})
	  -socket.emit("login", {token, token});

Create:
	backend:
	 -genearate 5 long code
	 -create room obj in rooms[]

	  {
	   roomID: generatedCode
  	   started: false
	   oxygen: 100
	   timeStarted: 
	   wordsInputted: []
	   depth: 0
	   interval: setInterval(if started and has oxygen, go deeper by some px per second)
	  }

	frontend:
	 navigate(/lobby)

Join:
	backend:
	 -check	rooms[].roomID
	 -join corresponding code

	frontend:
	 navigate(/lobby)


Start:
	frontend:
	 emit(start, {roomID})
	 on begin:
		-animate drop
		-display:block UI
		-display:none title

	backend:
	 on start: 
	 	-to(roomID).emit(begin)
		-rooms[roomID].timeStarted:Date.now()//or something

player inputs word:
	frontend:
	 -check if real word with API
	 -emit(sendword, {word})
     
	 on(acceptWord):
		-bubble show word +5%	 

	backend:
	 on(sendword):
	 	-check if already in rooms[roomID].wordsInputted
		-if okay, add to rooms[roomID].wordsInputted
        -if okay, add 5 to rooms[roomID].oxygen
        -if okay, add 20 or smth to rooms[roomID].depth
		-emit(acceptWord, {word})
        


oxygen runs out(inside the setInterval of the roomID):
	backend:
	 to(roomID).emit("noO2")

	frontend:
	 on("noO2"):
	  - show play again UI


# Game Handling

anyone can create their own room/crew at any time

but only the host can can start the game

once a room/crew has started new users that try to join won't be able to
