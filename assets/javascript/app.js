	 var config = {
	     apiKey: "AIzaSyACcWze1CjyJ8GGs9YunRmDveuK0fgcS_o",
	     authDomain: "fir-test-project-d7e37.firebaseapp.com",
	     databaseURL: "https://fir-test-project-d7e37.firebaseio.com",
	     storageBucket: "fir-test-project-d7e37.appspot.com",
	     messagingSenderId: "100732280601"
	 };
	 firebase.initializeApp(config);

	 var database = firebase.database();

	 var playerName = ""
	 var playerChoice = 15
	 var playerActive = false;
	 var playerWins = 0
	 var playerLoses = 0
	 var playerTies = 0
	 var playerID = 0
	 var playNum
	 var player1name = "Waiting for Players"
	 var player2name = "Waiting for Players"
	 var player1score = 0;
	 var player2score = 0;
	 var myName



	 $('#name-input').on('click', function() {
	     $(this).val("")
	 })

	 $('#submit-button').on('click', function() {
	     playerName = $('#name-input').val().trim()
	     playerSet();
	     newPlayer();
	     $('.nameBox').html("")


	 })


	 $('.pickButton').on('click', function() {

	     playerChoice = $(this).text()
	     if (playNum === 1) {
	         $('.pick1').html(playerChoice)
	     } else {
	         $('.pick2').html(playerChoice)
	     }
	     playerChoose();


	 })



	 function newPlayer() {
	     console.log('sending')
	     var playerPush = database.ref("players").push()
	     playerPush.set({
	         name: playerName,
	         wins: playerWins,
	         loses: playerLoses,
	         ties: playerTies,
	         playerNumber: playNum
	     });

	     playerID = playerPush.key

	     playerPush.onDisconnect().remove()

	     if (playNum === 1) {
	         database.ref('game/').update({
	             p1name: playerName
	         });
	         database.ref('game/p1name').onDisconnect().remove()
	     } else {
	         database.ref('game/').update({
	             p2name: playerName
	         });
	         database.ref('game/p2name').onDisconnect().remove()
	     }
	 }

	 function playerChoose() {
	     if (playNum === 1) {
	         database.ref('game/choice').update({
	             player1choice: playerChoice
	         });
	     } else {
	         database.ref('game/choice').update({
	             player2choice: playerChoice

	         })
	     }
	 }

	 var playersRef = firebase.database().ref("players");

	 playersRef.on("value", function(snapshot) {
	     //This does nothing, but everything breaks if I get rid of it.
	 });

	 function playerSet() {
	     playersRef.once("value", function(snap) {
	         console.log(snap.val())
	         if (snap.numChildren() === 0 && !playNum) {
	             playNum = 1;
	             $('.p1btn').removeClass('disabled')
	             $('.chatDiv').removeClass('disabled')
	         } else if (snap.numChildren() === 1 && !playerID) {
	             playNum = 2;
	             $('.p2btn').removeClass('disabled')
	             $('.chatDiv').removeClass('disabled')
	         }

	     })

	 }

	 database.ref("game").on("value", function(snap) {
	     console.log('go')
	     if (snap.hasChild("p1name")) {
	         player1name = snap.val().p1name
	     } else {
	         player1name = "Waiting for Players"
	     }

	     if (snap.hasChild("p2name")) {
	         player2name = snap.val().p2name
	     } else {
	         player2name = "Waiting for Players"
	     }


	     $('.p1name').text(player1name)
	     $('.p2name').text(player2name)

	 })


	 database.ref("game").on("value", function(snap) {
	     if (snap.hasChild("choice")) {
	         //Compares player choices

	         if (snap.child("choice").numChildren() === 2) {
	             console.log('comapare')
	             var p1Choice = snap.child("choice").val().player1choice
	             var p2Choice = snap.child("choice").val().player2choice

	             if (p1Choice === p2Choice) {
	                 tie();
	             } else if (p1Choice === "Scissors" && p2Choice === "Rock") {
	                 player2Win();
	             } else if (p1Choice === "Paper" && p2Choice === "Scissors") {
	                 player2Win();
	             } else if (p1Choice === "Rock" && p2Choice === "Paper") {
	                 player2Win();
	             } else {
	                 player1Win();
	             }
	         }
	     }
	 })


	 function player1Win() {
	     player1score++
	     $('#middle').html(player1name + " Wins!")
	     $('.p1score').html("Wins : " + player1score)
	     removeChoice();
	 }

	 function player2Win() {
	     player2score++
	     $('#middle').html(player2name + " Wins!")
	     $('.p2score').html("Wins : " + player2score)
	     removeChoice();
	 }

	 function tie() {
	     $('#middle').html("Tie!")
	     removeChoice();
	 }

	 function removeChoice() {
	     setTimeout(function() {
	         $('#middle').html("")
	         $('.pick1').html("")
	         $('.pick2').html("")
	     }, 1000)
	     database.ref('game/').child('choice').remove()
	 }

	 $('.chatSend').on('click', function() {
	 		sendChat();
		})

	 $(document).on('keypress', function(e){
	 	if(e.keyCode === 13){
	 		sendChat();
	 	}
	 })

	 function sendChat() {
	     if ($('.chatInput').val() !== "") {
	         database.ref("chat").push({
	             text: playerName + ": " + $('.chatInput').val()
	         });
	     }
	 }

	 database.ref("chat").on("child_added", function(snap) {
	     $('.chatBox').append(snap.val().text + "<br>")
	     $('.chatBox').scrollTop($('.chatBox')[0].scrollHeight);
	 })

	 database.ref("players").on("value", function(snap) {
	     if (snap.numChildren() === 0) {
	         database.ref('chat/').remove()
	     }
	 })
