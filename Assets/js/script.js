// Wrap all code that interacts with the DOM in a call to jQuery to ensure that
// the code isn't run until the browser has finished rendering all the elements
// in the html.

var allHours = $(".time-block"); //Array of all the time-block class elements
var allEvents = $("#calEventsContainer");
var timeArray = [];
// var eventObject = {
//   timeSlot: "placeholder",
//   eventText: "placeholder",
// };

$(function () {
  console.log(dayjs().format());
  $("#currentDay").text(dayjs().format("dddd, MMMM DD YYYY")); //displays the current time in the header
  allHours.addClass("present"); // Set a default time state on load. I chose present because you should live in the present to stay mentally healthy

  if (localStorage.getItem("savedEvents") == null) {
    console.log("No save history, generating blank calendar");
    for (i = 0; i < allHours.length; i++) {
      // console.log("iteration " + i);
      // I would normally do a 2D array of data for this, but I need to practice working with objects, so here's an array of event objects
      timeArray[i] = {
        timeSlotID: $(allHours[i]).attr("id"),
        hourNum: $(allHours[i]).attr("data-hourNum"),
        eventText: "",
      };
    }
    localStorage.setItem("savedEvents", JSON.stringify(timeArray));
  } else {
    console.log("There is saved history, getting it from history");
    timeArray = JSON.parse(localStorage.getItem("savedEvents"));
  }

  setUpCurrentTimeDisplay();
  populateCalender();

  // console.log(timeArray);

  // TODO: Add a listener for click events on the save button. This code should
  // use the id in the containing time-block as a key to save the user input in
  // local storage. HINT: What does `this` reference in the click listener
  // function? How can DOM traversal be used to get the "hour-x" id of the
  // time-block containing the button that was clicked? How might the id be
  // useful when saving the description in local storage?
  //
  // TODO: Add code to apply the past, present, or future class to each time
  // block by comparing the id to the current hour. HINTS: How can the id
  // attribute of each time-block be used to conditionally add or remove the
  // past, present, and future classes? How can Day.js be used to get the
  // current hour in 24-hour time?
  //
  // TODO: Add code to get any user input that was saved in localStorage and set
  // the values of the corresponding textarea elements. HINT: How can the id
  // attribute of each time-block be used to do this?
  //
  // TODO: Add code to display the current date in the header of the page.
});

allEvents.on("click", ".saveBtn", function (event) {
  event.preventDefault();
  var thisTimeElement = $(this).parent(); //convenience variable
  var thisTimeNum = $(thisTimeElement).attr("data-hourNum");
  // console.log(thisTimeNum);
  var eventTextToSave = thisTimeElement.find(".description").val(); //This saves the value typed within the calendar event into the variable calendarEvent. this.parent goes up from the clicked button to the parent div element, then .find(".description")

  //okay, this variable was way overkill. I could have just assumed the size of the calendar would remain the same forever, and that I could always point to an index and always point to the same spot, but I kind of wanted this to be dynamic so that a future programmer could just add more hours to the calendar in the future and not really have to change the js code at all. As long as the coder adds the element with the data attribute of its hour number, this js should never have to be touched. I also can't help but think that there was probably a more direct way of doing this, and that I'll facepalm when I realize it. Hey, I learned about maps and got practice, so isn't that the most important thing?
  //This variable gets the index number of the array of event objects that corresonds to the hour number of that calendar event by using the data attribute of the parent of the clicked button to look it up
  var saveIndex = timeArray
    .map(function (eventObj) {
      return eventObj.hourNum;
    })
    .indexOf(thisTimeNum);

  console.log("Will save " + saveIndex + " and text: " + eventTextToSave);

  saveEventToLocal(saveIndex, eventTextToSave);
});

function setUpCurrentTimeDisplay() {
  allHours.removeClass("past present future"); //Clear out the calendar of time placement to rebuild again
  for (i = 0; i < allHours.length; i++) {
    var currentHour = dayjs().format("H"); //This reduces calls to the dayJS api and also makes sure that in the unlikely event of the hour turning over while looping there will be no ambiguity
    // console.log("loop #" + i);
    if (i + 9 < currentHour) {
      $(allHours[i]).addClass("past");
    } else if (i + 9 == currentHour) {
      $(allHours[i]).addClass("present");
    } else if (i + 9 > currentHour) {
      $(allHours[i]).addClass("future");
    }
  }
}

function saveEventToLocal(saveIndex, eventTextToSave) {
  timeArray[saveIndex].eventText = eventTextToSave;
  console.log(JSON.stringify(timeArray));
  localStorage.setItem("savedEvents", JSON.stringify(timeArray));
}

function populateCalender() {
  var eventToFill;
  for (i = 0; i < timeArray.length; i++) {
    eventToFill = $("#" + timeArray[i].timeSlotID).find(".description");
    $(eventToFill).text(timeArray[i].eventText);
  }
}
