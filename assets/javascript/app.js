//List of starting topics
var topics = ["T-Rex", "Velociraptor", "Dilophosaurus", "Brontosaurus", "Pterodactyl", "Triceratops", "Samuel L Jackson"]

//Empty variable for search request.
var searchTopic = 0

//Creates the first set of buttons
buttonMaker();

//Function that creates buttons and deals with button behavior.
function buttonMaker() {
    $('.buttonArea').html("")
    for (var i = 0; i < topics.length; i++) {
        $('.buttonArea').append('<div class="button">' + topics[i] + '</div>')
    }
    $('.button').click(function() {
        $('.button').removeClass('active')
        $(this).addClass('active')
        searchTopic = $(this).text()
        giphyRequest()
    })
}

//The main AJAX call
function giphyRequest() {

//Sets the search target.
    var queryURL = "https://api.giphy.com/v1/gifs/search?q=" + searchTopic + "&limit=10&api_key=dc6zaTOxFJmzC";

//Calls for the JSON object and clears the GIF area.
    $.ajax({ url: queryURL, method: "GET" }).done(function(response) {
        clearArea();

//Generates the individual GIF containers and rating bars.
        for (var i = 0; i < response.data.length; i++) {
            $('.gifArea').append('<div class="gifContainer"><div class="ratingBar ' + i + '"> Rating: ' + response.data[i].rating + '</div><img class="gif" playback="false" index="' + i + '" src="' + response.data[i].images.original_still.url + '"></div>')
        }
        $('.gif').click(function() {
            if ($(this).attr('playback') === "false") {
                $(this).attr('src', response.data[$(this).attr('index')].images.original.url)
                $(this).attr('playback', 'true')
                $("." + $(this).attr('index')).fadeTo("fast", 0)
            } else {
                $(this).attr('src', response.data[$(this).attr('index')].images.original_still.url)
                $(this).attr('playback', 'false')
                $("." + $(this).attr('index')).fadeTo("fast", 1)
            }
        })

//Checks if the search returns any results.         
        if (response.data.length === 0) {
            topics.pop();
            buttonMaker();
            $('.search').val("SORRY! NO RESULTS. TRY AGAIN.")
            $('.search').addClass('glowRed')
            $('.error').html('<div class="errorMessage">SORRY! NO RESULTS. TRY AGAIN.</div>')
        } else {
            $('.error').text("")
            $('.search').val("WHAT WOULD YOU LIKE TO ADD?")
            $('.search').removeClass('glowRed')
        }
    });
}


//Search button behavior
$('.submit').click(function() { submitSearch() })
$(document).keypress(function(event) {
    if (event.keyCode == '13') {
        submitSearch();
    }
})

//Removes text from the search field on focus.
$('.search  ').focus(function() {
    $(this).val("")
    $('.search').removeClass('glowRed')
})

//Deals with the input of the search bar results and generates buttons.
function submitSearch() {
    var searchText = $('.search').val()
    if (searchText === "WHAT WOULD YOU LIKE TO ADD?" || searchText === "" || searchText === "TYPE HERE FIRST" || searchText === "SORRY! NO RESULTS. TRY AGAIN.") {
        $('.search').val("TYPE HERE FIRST")
        $('.search').addClass('glowRed')
    } else {
        buttonsFromSearch()
        buttonMaker()
        $('.search').val("WHAT WOULD YOU LIKE TO ADD?")
    }
}

//Adds the result from the search to the topics array.
function buttonsFromSearch() {
    topics.push($('.search').val())
}

//Clears the Gif area.
function clearArea() {
    $('.gifArea').html("")
}
