$(document).ready(function(){    //My JS starts past this point.

//Pseudocode and Instruction Notes: 
// 1 - create a topics Array based on video games theme.
// 2 - grab the topics in the array...
// 3 - ...and create buttons in my html (in the topic-row).
// 4 - When a user clicks a title button...
// 5 - ...the page makes a call to giphy api...
// 6 - ...grabs 10 static, non-animated gif images...
// 7 - ... and appends them to the gifBucket.
//     7a - Under the gif, display its rating.
//     challenge 1 - appends each image after a TINY delay...
//     challenge 2 - ... and makes a quick shuffle sound when it does.
// 8 - When the user clicks on one of the still images...
// 9 - ...the gif should animate...
// 10 - ...and if clicked again, it should stop playing.
// 11 - Add a form to the page...
// 12 - ...which takes the value from the user input box...
// 13 - ...and adds it into the topics array...
// 14 - ...and then remakes the buttons on the page.

// Additional Goals:
// 1 - Fully Responsive CSS.
//     1a - The search bar should probably move to its own row underneath the topic row. 
//     1b - Maybe stop displaying the title and instead have placeholder text within the form that says the same thing as the title?
// 2 - Allow Users to request additional gifs to be added to the page and NOT be overwritten.
// 3 - Display additional information under the gif (title, tags, etc.)
// CHALLENGE GOALS (To do if I acomplish everything else first)
// 4 - Light Challenge - Allow Users to add their favorite giffs to a favorites section. (which persists through topics).
// 5 - CHALLENGE - Include a 1-click download button for each gif that works on any device.
// 6 - LARGE CHALLENGE - Store the favorites section in localStorage or cookies so it persists even through page reloads.
// 7 - PIPE DREAM CHALLENGE - Integrate other APIs into this search. (Maybe see if review aggregator sites have an api for links to reviews from major sites?)

//API Query Creation

//Global Variables and Arrays
const topics = ["Super Mario Bros.", "The Legend of Zelda", "Starfox", "Uncharted", "Crash Bandicoot", "God of War", "Halo: Combat Evolved", "Gears of War", "Mass Effect", "Skyrim", "Portal"];
const displayedTopics =[];
const displayedGifs = [];
const addTopicBtn = $(".addTopicBtn");

const gifTasticFunctions ={ //Defined Page Functions
    populateTopics : function() { //A function that turns the topics into buttons.
        topics.forEach( function(topic){
            if (!displayedTopics.includes(topic)) {
                const newTopicBtn = $("<button>");
                newTopicBtn.addClass("topicButton");
                newTopicBtn.attr("data-title", topic);
                newTopicBtn.text(topic);
                $(".topic-row").append(newTopicBtn);
                displayedTopics.push(topic);
            }
        });
    },
    createTopicBucket : function() {
        if(!displayedGifs.includes(selectedTopic)){
            const gifBucket = $(".gifBucket");
            const topicBucket = $("<div>");
            const topicBucketTitle = $("<h2>");
            currentTopicClass = selectedTopic + "Bucket";
            topicBucketTitle.attr("class", "row subBucketTitle").text(selectedTopic + "Gifs");
            currentTopicClass = currentTopicClass.replace(/\s+/g,''); //This function to cut out all whitespace from a string came from Henrik Andersson at Stack Overflow - Source: "https://stackoverflow.com/questions/10800355/remove-whitespaces-inside-a-string-in-javascript"
            currentTopicClass = currentTopicClass.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]+/g,'');
            topicBucket.attr("class", currentTopicClass + " row subBucket").append(topicBucketTitle);
            gifBucket.prepend(topicBucket);
            displayedGifs.push(selectedTopic);
        }
    },
    createVideoGameCard : function(){
        const searchTerm = selectedTopic.replace(/\s+/g,'+')
        const queryURL = "https://api.giphy.com/v1/gifs/search?q=" + searchTerm + "&api_key=nyKGC9XA6dFscyXGENNUex91WkXUqco1&limit=10"
        let downloadHref;
        $.get(queryURL, function(data){
            response = data.data;
            console.log(response);
            response.forEach( function(gif){
                title = gif.title;
                rating = gif.rating;
                runningImg = gif.images.fixed_height.url;
                stillImg = gif.images.fixed_height_still.url;
                originHref = gif.images.original.url;
                coreHref = originHref.match("/media/(.*).gif");
                downloadHref = "https://i.giphy.com/media/" + coreHref[1] + ".gif";
                newGameCard = $("<figure>");
                cardImg = $("<img>");
                cardBody = $("<div>");
                cardTitle = $("<h5>");
                cardRating = $("<p>");
                downloadBtn = $("<a>");
                newGameCard.attr("class", "card").attr("style", "width: 18rem").append(cardImg).append(cardBody);
                cardImg.attr("src", stillImg).attr("data-still", stillImg).attr("data-animate", runningImg).attr("data-state", "still").attr("class", "gif");
                cardBody.attr("class", "card-body").append(cardTitle).append(cardRating).append(downloadBtn);
                downloadBtn.attr("download", "").attr("href", downloadHref).attr("class","btn btn-primary downloadBtn").text("Download");
                cardRating.attr("class", "card-text").text("Gif Rating: " + rating);
                cardTitle.attr("class", "card-title").text("Gif Title: " + title);
                $("." + currentTopicClass).append(newGameCard);
                console.log($(".gif"));
            });
        });

    },
};//End of Defined Page Functions


//Page Load Calls
gifTasticFunctions.populateTopics();

//Event Capture Functions
addTopicBtn.click( function() { //What happens when the submit topic button is clicked.
    event.preventDefault();
    console.log("yo");
});

$(".addTitle").click( function(event) { //What happens when a topic button is clicked.
    event.preventDefault();
    console.log("yo");
});

$(".topicButton").click( function(event) { //What happens when a topic button is clicked.
    event.preventDefault();
    selectedTopic = $(this).attr("data-title").trim(); //Grab the clicked Topic's data value.
    let currentTopicClass;
    gifTasticFunctions.populateTopics(); //populate the buttons row with the latest version of the topic array.
    gifTasticFunctions.createTopicBucket(); //create the field where the image cards will be displayed.
    gifTasticFunctions.createVideoGameCard();
});

//This event and how its delegated was solved by Arun P Johny on Stack Overflow - Source: "https://stackoverflow.com/questions/16893043/jquery-click-event-not-working-after-adding-class"
$(document).on("click", ".gif", function() {
    const state = $(this).attr("data-state");
    if (state === "still") {
        $(this).attr("src", $(this).attr("data-animate"));
        $(this).attr("data-state", "animate");
    } else {
        $(this).attr("src", $(this).attr("data-still"));
        $(this).attr("data-state", "still");
    }
});

$(".downloadBtn").click(function(event) { 
    event.preventDefault();
    window.location.href = $(this).downloadHref;
});

//Constructors and Prototypes
function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
        this.sound.play();
    }
    this.stop = function(){
        this.sound.pause();
    }
} 


//My JS Ends beyond this point.
});

// rough draft area