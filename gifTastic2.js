$(document).ready(function(){    //My JS starts past this point.

//Pseudocode, Instruction Notes, and checklist commentary: 
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
// 1 - Fully Responsive CSS. - Done
//     1a - The search bar should probably move to its own row underneath the topic row. - Done
//     1b - Maybe stop displaying the title and instead have placeholder text within the form that says the same thing as the title? - Nah. Unessesary.
// 2 - Allow Users to request additional gifs to be added to the page and NOT be overwritten. - (Done)
// 3 - Display additional information under the gif (title, tags, etc.) - (Done)
// CHALLENGE GOALS (To do if I acomplish everything else first)
// 4 - Light Challenge - Allow Users to add their favorite giffs to a favorites section. (which persists through topics). - (Done)
// 5 - CHALLENGE - Include a 1-click download button for each gif that works on any device. - (Halfway Done. Can it be done? Apparently not within the scope of this project.)
// 6 - LARGE CHALLENGE - Store the favorites section in localStorage or cookies so it persists even through page reloads. - DONE
// 7 - PIPE DREAM CHALLENGE - Integrate other APIs into this search. (Maybe see if review aggregator sites have an api for links to reviews from major sites? - Final Update: HA! No.)


//Responsiveness Function - Note to TAs: Don't worry, I'll not do it in the future. I just don't have the time to break and remold it again.
function moveTopicSubmission(){ //A function to change the placement of the answer image depending on viewport size. 
    if ($(window).width() < 600) { //When the window is smaller than 600px, change the column sizes of various buckets and move the favorites to above the gif bucket.
        $(".topicAdd").addClass("col-12").insertBefore($(".display-row")); 
        $(".gifBucket").addClass("col-12");
    } else { //If the window is equal to or larger than 600, reverse the process and move the content to their own columns again.
        if ($(window).width() >= 600) {
            $(".topicAdd").removeClass("col-12").appendTo($(".display-row")); 
            $(".gifBucket").removeClass("col-12");
        }
    }
}

moveTopicSubmission(); //Call the function for the initial sizing and adjustment.

//Global Variables, Objects, and Arrays
const topics = ["Super Mario Bros.", "The Legend of Zelda", "Starfox", "Uncharted", "Crash Bandicoot", "God of War", "Halo: Combat Evolved", "Gears of War", "Mass Effect", "Skyrim", "Portal"]; //Initial topics.
const displayedTopics =[]; //Array of all topics that are displayed. 
let favs = []; //Array for pushing and pulling favorites.
const addTopicBtn = $(".addTopicBtn"); //establish the topic button constant and its html connection.
let vgCardInfo = {}; //establish the empty object to hold all giphy nested card objects.

function populateFavs() { //A function that takes the favorites from local storage and turns them into cards.
    if (localStorage.getItem("favs") !== null){ //If there is something in the local storage under the key "favs"...
        favs = JSON.parse(localStorage.getItem("favs")); //...parse that info into an array.
        $(".favZone").empty(); //Empty out the favorites container if it already has something in it.
        favs.forEach( function(i){ //For each index of the favs array...
            i = JSON.parse(i); //...parse it into an object.
            //establish JQuery HTML objects.
            newGameCard = $("<figure>");
            cardImg = $("<img>");
            cardBody = $("<div>");
            cardTitle = $("<h5>");
            cardRating = $("<p>");
            innerRow = $("<div>");
            downloadBtn = $("<a>");
            favoriteBtn = $("<h6 class='col-6 favoriteThisText'>Favorite This:&nbsp;&nbsp;<i class='fas fa-star'></i></h6>") //Create the favorite button.
            newGameCard.attr("class", "card " + i.id).attr("id", i.id).attr("style", "width: 18rem").append(cardImg).append(cardBody); //create the core card framework.
            cardImg.attr("src", i.stillImg).attr("data-still", i.stillImg).attr("data-animate", i.runningImg).attr("data-state", "still").attr("class", "gif"); //establish the elements of the card image, including the still and animated versions, as well as data- to flip between the two states.
            cardBody.attr("class", "card-body").append(cardTitle).append(cardRating).append(innerRow); //stitch together the card body.
            innerRow.attr("class", "row card-inner-row").append(downloadBtn).append(favoriteBtn); //create the inner card content area and append the content. 
            //downloadBtn.attr("download", "").attr("href", i.directHref).attr("class","col-6 btn btn-primary downloadBtn").text("Download"); //Abandoned the on-click download button, but I felt I should leave the artifact for posterity, lol.
            cardRating.attr("class", "card-text").text("Gif Rating: " + i.rating); //Establish the rating data.
            cardTitle.attr("class", "card-title").text("Gif Title: " + i.title); //Establish the gif title data.
            $(".favZone").append(newGameCard); //append the card to the favorites container.
        });
    } else {
        console.log(false); //If local storage is empty, log false.
    }
};
populateFavs(); // call the function to create the initial favorites from local Storage.

const gifTasticFunctions ={ //Defined Page Functions
    populateTopics : function() { //A function that turns the topics into buttons.
        topics.forEach( function(topic){
            if (!displayedTopics.includes(topic)) { //If the displayed topics array doesn't include a topic in the topics array, make a button or it.
                const newTopicBtn = $("<button>");
                newTopicBtn.addClass("topicButton");
                newTopicBtn.attr("data-title", topic);
                newTopicBtn.text(topic);
                $(".topic-row").append(newTopicBtn);
                displayedTopics.push(topic); //finally, push the newly added topic to the displayed array to prevent duplicates.
            }
        });
    },
    createTopicObject : function(){ //A function to create the object data we will use to build the gif cards from Giphy.
        const searchTerm = selectedTopic.replace(/\s+/g,'+') //establish the search term for the query URL by taking the topic button and replacing any spaces with '+'.
        const queryURL = "https://api.giphy.com/v1/gifs/search?q=" + searchTerm + "&api_key=nyKGC9XA6dFscyXGENNUex91WkXUqco1&limit=10" //combine the search term into the giphy api query url.
        $.get(queryURL, function(data){ //call the giphy api for data.
            response = data.data; //narrow our variables for clarity by turning the incoming 'data' and its property also called 'data' into the response variable.
            response.forEach( function(gif){ //for each piece of data, capture a desired element into a variable.
                cardId = gif.id;
                vgCardPropName = cardId;
                gifTitle = gif.title
                gifRating = gif.rating;
                gifRunningImg = gif.images.fixed_height.url;
                gifStillImg = gif.images.fixed_height_still.url;
                tempCard = { //establish a temporary object that we can merge into our vgCardInfo object. Fill the object with keys and the values of strings we took from the giphy api.
                    };
                    tempCard[vgCardPropName] = {
                        id: cardId.toString(),
                        title: gifTitle.toString(),
                        rating: gifRating.toString(),
                        runningImg: gifRunningImg.toString(),
                        stillImg: gifStillImg.toString(),
                        directHref: "https://i.giphy.com/media/" + cardId.toString() + "/giphy.gif", //Establish a direct link to the image without going through giphy's framing and context. Was theoretically going to be used for a download button, but is now a relic.
                        displayed: false}
                $.extend(vgCardInfo, tempCard); //Merge the tempCard object with the vgCardInfo object.
            });
            gifTasticFunctions.createVideoGameCard(); //Call the function that builds the html framework for the cards that hold the data we just retrieved and organized. We do this here to avoid asynchronous issues from the Get function.
        });
    },
    createVideoGameCard : function(){ //Establish the function that builds the gif cards in the html.
            for(let card in vgCardInfo){ //For each property (card) of vgCardInfo...
                if (vgCardInfo[card].displayed !== true){ //...if the card is not already displayed...
                    vgCardInfo[card].displayed = true; //declare it displayed.
                    cardEnterSound = new sound("assets/sounds/soft_thud.mp3"); //Establish the new sound object that makes the thud sound.
                    cardEnterSound.play(); //Play the thud sound for when cards are built.
                    //create JQuery html objects:
                    newGameCard = $("<figure>");
                    cardImg = $("<img>");
                    cardBody = $("<div>");
                    cardTitle = $("<h5>");
                    cardRating = $("<p>");
                    innerRow = $("<div>");
                    downloadBtn = $("<a>");
                    //Basically the code below mirrors that in the populate favs function from above. 
                    favoriteBtn = $("<h6 class='col-6 favoriteThisText'>Favorite This:&nbsp;&nbsp;<i class='far fa-star'></i></h6>")
                    newGameCard.attr("class", "card " + vgCardInfo[card].id).attr("id", vgCardInfo[card].id).attr("style", "width: 18rem").append(cardImg).append(cardBody);
                    cardImg.attr("src", vgCardInfo[card].stillImg).attr("data-still", vgCardInfo[card].stillImg).attr("data-animate", vgCardInfo[card].runningImg).attr("data-state", "still").attr("class", "gif");
                    cardBody.attr("class", "card-body").append(cardTitle).append(cardRating).append(innerRow);
                    innerRow.attr("class", "row card-inner-row").append(downloadBtn).append(favoriteBtn);
                    //downloadBtn.attr("download", "").attr("href", vgCardInfo[card].directHref).attr("class","col-6 btn btn-primary downloadBtn").text("Download");
                    cardRating.attr("class", "card-text").text("Gif Rating: " + vgCardInfo[card].rating);
                    cardTitle.attr("class", "card-title").text("Gif Title: " + vgCardInfo[card].title);
                    $(".gifBucket").prepend(newGameCard); //At the end of it all, prepend the newly minted card to the gif container.
                };
        };
    },
};//End of Defined Page Functions

gifTasticFunctions.populateTopics(); //Populate our topics list with the basic array of pre-given topics.

//Event Capture Functions
addTopicBtn.click( function() { //What happens when the submit topic button is clicked.
    event.preventDefault(); // Prevent the page from refreshing on click.
    topics.push($("#topicAddField").val()); //push the topic that was submitted by the user into the topics array.
    gifTasticFunctions.populateTopics(); //populate the buttons row with the latest version of the topic array.
});

$(document).on("click", ".topicButton", function(event) { //What happens when a topic button is clicked.
    event.preventDefault(); // Prevent the page from refreshing on click.
    selectedTopic = $(this).attr("data-title").trim(); //Grab the clicked Topic's data value.
    gifTasticFunctions.createTopicObject(); //Call the function that will grab the object data from giphy and then the function that makes the cards.
});

//This event was outlined by Arun P Johny on Stack Overflow to solve the problem of clicking on populated objects. - Source: "https://stackoverflow.com/questions/16893043/jquery-click-event-not-working-after-adding-class"
$(document).on("click", ".gif", function() { //The click event that changes the still/animate toggle of the gifs.
    const state = $(this).attr("data-state"); //Capture the gif's current data state.
    if (state === "still") { //If the stae is still...
        $(this).attr("src", $(this).attr("data-animate")); //Change the picture source to the animated picture.
        $(this).attr("data-state", "animate"); //set the data status to animated.
    } else { //If it's not still...
        $(this).attr("src", $(this).attr("data-still")); //Change the img source to the still image...
        $(this).attr("data-state", "still"); // ... and change the status to still.
    }
});

$(document).on("click", ".fa-star", function(event) { //What happens when the favorite star is clicked.
    event.preventDefault(); // Prevent the page from refreshing on click.
    newFavCard = $(this).parent().parent().parent().parent(); //Identify the ouermost dom of the card.
    favId = $(newFavCard).attr("id") //Refer to the id of the card.
    thisCard = favId.replace(/clone/g,""); // Establish the absolute Id, regardless if it is a clone card or not.
    cloneId = "clone"+thisCard; //Establish what the clone Id would be for this card.
    if($(this).hasClass("far")){ //If the star is not filled in, then it is being made a favorite, so...
        if(!favs.includes(vgCardInfo[thisCard])){ //... if this card is not in the favs array...
            favs.push(JSON.stringify(vgCardInfo[thisCard])); //Stringify the nested object and pass that string to the favs array.
            stringedFavs = JSON.stringify(favs); //Stringify the favs array.
            localStorage.setItem("favs", stringedFavs); //Send the stringified array to Local Storage.
        }
        $(this).removeClass("far").addClass("fas"); // Then, fill in the favorite star by changing its class.
        newFavCard.clone().addClass("clone").attr("id", cloneId).appendTo($(".favZone")); //create a clone with a clone Id and put it in the favs container. It must have the "clone" class, and a clone Id.
        newFavCard.addClass("original"); //Establish the original card as being the original.
    } else { 
        if ($(this).hasClass("fas")) { //If the star is filled in when clicked then this function is to remove the favorite.
            const removeFavI = favs.indexOf(function(obj){ // use a function to find the index of the object in the favs array that matches the id oif the clicked star's card and put it in a variable.
                return obj.id === thisCard;
            });
            favs.splice(removeFavI, 1); //Splice that index from the favs array to get rid of the object.
            stringedFavs = JSON.stringify(favs); //Stringify the latest version of the array.
            localStorage.setItem("favs", stringedFavs); //Update the local storage of the array.
            $(".favZone").empty(); //Empty the favorites container.
            populateFavs(); //Call the function that populates the favorites container, this time with the most up to date data.
        } 
    }
});

//This is yet another artifact of the abandoned download button.
// $(".downloadBtn").click(function(event) { 
//     event.preventDefault();
//     window.location.href = $(this).downloadHref;
// });

//Responsiveness Events - On resize call the function that moves things around. 
$( window ).resize(function() {
    moveTopicSubmission();
});

//Constructors and Prototypes 
function sound(src) { //This makes the sound objects that are used when cards are made.
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