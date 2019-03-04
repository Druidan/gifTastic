$(document).ready(function(){    //My JS starts past this point.

//Pseudocode and Instruction Notes: 
// 1 - create a topics Array based on video games theme. - (Done)
// 2 - grab the topics in the array... - (Done)
// 3 - ...and create buttons in my html (in the topic-row). - (Done)
// 4 - When a user clicks a title button... - (Done)
// 5 - ...the page makes a call to giphy api... - (Done)
// 6 - ...grabs 10 static, non-animated gif images... - (Done)
// 7 - ... and appends them to the gifBucket. - (Done)
//     7a - Under the gif, display its rating. - (Done)
//     challenge 1 - appends each image after a TINY delay... - (Done)
//     challenge 2 - ... and makes a quick shuffle sound when it does. - (Done)
// 8 - When the user clicks on one of the still images... - (Done)
// 9 - ...the gif should animate... - (Done)
// 10 - ...and if clicked again, it should stop playing. - (Done)
// 11 - Add a form to the page... - (Done)
// 12 - ...which takes the value from the user input box... - (Done)
// 13 - ...and adds it into the topics array... - (Done)
// 14 - ...and then remakes the buttons on the page. - (Done)

// Additional Goals:
// 1 - Fully Responsive CSS.
//     1a - The search bar should probably move to its own row underneath the topic row. 
//     1b - Maybe stop displaying the title and instead have placeholder text within the form that says the same thing as the title?
// 2 - Allow Users to request additional gifs to be added to the page and NOT be overwritten. - (Done)
// 3 - Display additional information under the gif (title, tags, etc.) - (Done)
// CHALLENGE GOALS (To do if I acomplish everything else first)
// 4 - Light Challenge - Allow Users to add their favorite giffs to a favorites section. (which persists through topics). - (Done)
// 5 - CHALLENGE - Include a 1-click download button for each gif that works on any device. - (Halfway Done. Can it be done?)
// 6 - LARGE CHALLENGE - Store the favorites section in localStorage or cookies so it persists even through page reloads.
// 7 - PIPE DREAM CHALLENGE - Integrate other APIs into this search. (Maybe see if review aggregator sites have an api for links to reviews from major sites?)


//Responsiveness Function
function moveTopicSubmission(){ //A function to change the placement of the answer image depending on viewport size. 
    if ($(window).width() < 600) {
        $(".topicAdd").removeClass("col-4").addClass("col-12").appendTo($(".mainContent")); 
        $(".gifBucket").removeClass("col-8").addClass("col-12");
    } else {
        if ($(window).width() >= 600) {
            $(".topicAdd").addClass("col-4").removeClass("col-12").appendTo($(".display-row")); 
            $(".gifBucket").addClass("col-8").removeClass("col-12");
        }
    }
}

moveTopicSubmission();

//Global Variables, Objects, and Arrays
const topics = ["Super Mario Bros.", "The Legend of Zelda", "Starfox", "Uncharted", "Crash Bandicoot", "God of War", "Halo: Combat Evolved", "Gears of War", "Mass Effect", "Skyrim", "Portal"];
const displayedTopics =[];
let favs = [];
const addTopicBtn = $(".addTopicBtn");
let vgCardInfo = {};

function populateFavs() { //A function that takes the favorites from local storage and turns them into cards.
    favs = localStorage.getItem("favs");
    favsObject = JSON.parse(favs);
    console.log(favs);
    favsObject.forEach()
    // topics.forEach( function(topic){
    //     if (!displayedTopics.includes(topic)) {
    //         const newTopicBtn = $("<button>");
    //         newTopicBtn.addClass("topicButton");
    //         newTopicBtn.attr("data-title", topic);
    //         newTopicBtn.text(topic);
    //         $(".topic-row").append(newTopicBtn);
    //         displayedTopics.push(topic);

};
populateFavs();

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
    createTopicObject : function(){
        const searchTerm = selectedTopic.replace(/\s+/g,'+')
        const queryURL = "https://api.giphy.com/v1/gifs/search?q=" + searchTerm + "&api_key=nyKGC9XA6dFscyXGENNUex91WkXUqco1&limit=10"
        $.get(queryURL, function(data){
            response = data.data;
            response.forEach( function(gif){
                cardId = gif.id;
                vgCardPropName = cardId;
                gifTitle = gif.title
                gifRating = gif.rating;
                gifRunningImg = gif.images.fixed_height.url;
                gifStillImg = gif.images.fixed_height_still.url;
                tempCard = {
                    };
                    tempCard[vgCardPropName] = {
                        id: cardId.toString(),
                        title: gifTitle.toString(),
                        rating: gifRating.toString(),
                        runningImg: gifRunningImg.toString(),
                        stillImg: gifStillImg.toString(),
                        directHref: "https://i.giphy.com/media/" + cardId.toString() + "/giphy.gif",
                        displayed: false}
                $.extend(vgCardInfo, tempCard);
            });
            gifTasticFunctions.createVideoGameCard();
        });
    },
    createVideoGameCard : function(){
            for(let card in vgCardInfo){
                if (vgCardInfo[card].displayed !== true){
                setTimeout( function(){
                    vgCardInfo[card].displayed = true;
                    cardEnterSound = new sound("assets/sounds/soft_thud.mp3");
                    cardEnterSound.play();
                    newGameCard = $("<figure>");
                    cardImg = $("<img>");
                    cardBody = $("<div>");
                    cardTitle = $("<h5>");
                    cardRating = $("<p>");
                    innerRow = $("<div>");
                    downloadBtn = $("<a>");
                    favoriteBtn = $("<h6 class='col-6 favoriteThisText'>Favorite This:&nbsp;&nbsp;<i class='far fa-star'></i></h6>")
                    newGameCard.attr("class", "card " + vgCardInfo[card].id).attr("id", vgCardInfo[card].id).attr("style", "width: 18rem").append(cardImg).append(cardBody);
                    cardImg.attr("src", vgCardInfo[card].stillImg).attr("data-still", vgCardInfo[card].stillImg).attr("data-animate", vgCardInfo[card].runningImg).attr("data-state", "still").attr("class", "gif");
                    cardBody.attr("class", "card-body").append(cardTitle).append(cardRating).append(innerRow);
                    innerRow.attr("class", "row card-inner-row").append(downloadBtn).append(favoriteBtn);
                    downloadBtn.attr("download", "").attr("href", vgCardInfo[card].directHref).attr("class","col-6 btn btn-primary downloadBtn").text("Download");
                    cardRating.attr("class", "card-text").text("Gif Rating: " + vgCardInfo[card].rating);
                    cardTitle.attr("class", "card-title").text("Gif Title: " + vgCardInfo[card].title);
                    $(".gifBucket").append(newGameCard);
                },100);
            };
        };
    },
};//End of Defined Page Functions


//Page Load Calls
gifTasticFunctions.populateTopics();

//Event Capture Functions
addTopicBtn.click( function() { //What happens when the submit topic button is clicked.
    event.preventDefault();
    const newTopic = $("#topicAddField").val();
    topics.push($("#topicAddField").val());
    console.log(topics);
    gifTasticFunctions.populateTopics(); //populate the buttons row with the latest version of the topic array.
});

$(document).on("click", ".topicButton", function(event) { //What happens when a topic button is clicked.
    event.preventDefault();
    selectedTopic = $(this).attr("data-title").trim(); //Grab the clicked Topic's data value.
    gifTasticFunctions.createTopicObject();
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

$(document).on("click", ".fa-star", function(event) { //What happens when the favorite star is clicked.
    event.preventDefault();
    newFavCard = $(this).parent().parent().parent().parent();
    favId = $(newFavCard).attr("id")
    thisCard = favId.replace(/clone/g,"");
    cloneId = "clone"+thisCard;
    if($(this).hasClass("far")){
        if(!favs.includes(vgCardInfo[thisCard])){
            favs.push(vgCardInfo[thisCard]);
            stringedFavs = JSON.stringify(favs);
            localStorage.setItem("favs", stringedFavs);
        }
        console.log(favs);
        $(this).removeClass("far").addClass("fas");
        newFavCard.clone().addClass("clone").attr("id", cloneId).appendTo($(".favZone"));
        newFavCard.addClass("original");
    } else {
        if ($(this).hasClass("fas")) {
            favs.splice(vgCardInfo[thisCard], 1);
            console.log(favs);
            localStorage.setItem("favs", favs);
            $(".card").each(function(){
                if ($(this).attr("id") === cloneId){
                    $("#"+cloneId).remove();
                } else {
                    $("#"+thisCard).find("i").removeClass("fas").addClass("far");
                }
            }); 
        } 
    }
});

$(".downloadBtn").click(function(event) { 
    event.preventDefault();
    window.location.href = $(this).downloadHref;
});

//Responsiveness Events
$( window ).resize(function() {
    moveTopicSubmission();
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

// htmlString = $(".card-body").html();
// console.log(htmlString);