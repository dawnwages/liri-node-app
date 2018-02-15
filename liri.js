require("dotenv").config();


const fs = require('fs');
// pull from your document keys js
var keys = require('./keys.js');
var userInput = process.argv[2];
var searchInput = "";


//Set requirements
const twitter = require('twitter');
const spotify = require('node-spotify-api');
const request = require('request');


// THE GOOD STUFF WHERE WE INTERACT WITH THE CONSOLE
//Command line commands
if (userInput === "my-tweets") {
    tweetSearch();
} else if (userInput === "spotify-this-song") {
    spotifySearch(searchInput);
} else if (userInput === "movie-this") {
    movieSearch(searchInput);
} else if (userInput === "do-what-it-says") {
    userAction();
} else {
    console.log("Liri supports twitter, spotify, omdb or do-what-it-says");
};


function tweetSearch() {
    //do this within the function like spotify
    var client = new twitter(keys.twitter);

    var params = {
        screen_name: 'd4wn_michelle',
        count: 20
    };

    client.get('statuses/user_timeline', params, function (error, tweets, response) {
        if (error) {
            var errMessage = "OOPS! We weren't able to grab those tweets. " + error;
            console.log(errMessage);
            return;
        } else {
            var displayTweet = function (data){
                for (var i = 0; i < tweets.length; i++) {
                    displayTweet += 'Date: ' + tweets[i].created_at + '\n' +
                        'tweet: ' + tweets[i].text + '\n' +
                        'handle: ' + tweets[i].screen_name + '\n' +
                        '--------------------\n';
                }
            }


            console.log(displayTweet);
        }
    });
};

function spotifySearch(searchInput) {
    //I want to do this within the function 
    var spotify = new spotify(keys.spotify);


    if (searchInput === "") {
        searchInput = "The Sign Ace of Base";
    };

    spotify.search({ type: "track", query: searchInput }, function (error, data) {
        if (error) {
            console.log("Error: "+ error);
            return;
        } else {
            var userSong = data.tracks.items[0];

            var printSong = '--------------------\n' +
                'Here is your Spotified Song:\n' +
                '--------------------\n\n' +
                'Title: ' + userSong.name + '\n' +
                'Artist: ' + userSong.artists[0].name + '\n' +
                'Album: ' + userSong.album.name + '\n' +
                'Preview: ' + userSong.preview_url + '\n';

            console.log(printSong);
        }
    });
};

function movieSearch(searchInput) {

    if (searchInput === "") {
        searchInput = "Mr. Nobody";
    };

    searchInput = searchInput.split(' ').join('+');

    var queryURL = "http://omdbapi.com/?t=" + searchInput + "&plot=full&tomatoes=true&apikey=88b9de6e";

    request(queryURL, function (error, data, body) {
        if (error) {
            console.log("Error: "+error);
            return;
        } 
        else {
            printMovie = '--------------------\n' +
                'Movie Information:\n' +
                '--------------------\n\n' +
                'Title: ' + JSON.parse(body).Title + '\n' +
                'Year: ' + JSON.parse(body).Released + '\n' +
                'Produced In: ' + JSON.parse(body).Country + '\n' +
                'Language: ' + JSON.parse(body).Language + '\n' +
                'Plot: ' + JSON.parse(body).Plot + '\n';
                'Rotton Tomatoes Rating: ' + JSON.parse(body).tomatoRating + '\n' + 
                'IMDB Rating: ' + JSON.parse(body).imdbRating + '\n' +
                'Actors: ' + JSON.parse(body).Actors + '\n' +
            console.log(printMovie);
        }
    });
};

function userAction() {
    fs.readFile('./random.txt', 'utf8', function (error, data) {
        if (error) {
            return console.log("Error: "+error);
        } else {
            var data = data.split(",");
            console.log(data[1]);
            spotifySearch(data[1]);
        }

    })
};


