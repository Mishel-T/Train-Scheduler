//closing notes, need to study moment.js to take HH:mm and convert to something moment can use
//then need to use firstTrain Time and frequency to calculate next arrival and minutes away - use train-example file
var config = { 
    apiKey: "AIzaSyCLYXKAmcgK4-KmIm_hke-cTmoWLmGqFE0",
    authDomain: "fir-click-counter-7cdb9.firebaseapp.com",
    databaseURL: "https://mtfirstdb.firebaseio.com/",
    storageBucket: "gs://mtfirstdb.appspot.com/"
  };
  
firebase.initializeApp(config);

var database = firebase.database();

//on click event to capture and store values
$("#add-train-btn").on("click", function(event) {
    event.preventDefault();
    console.log("on click event running")

    //store values from form input
      var trainName = $("#name-input").val().trim();      
      var destination = $("#destination-input").val().trim();      
      var firstTrainTime = moment($("#time-input").val().trim(), "HH:mm").format("HH:mm");
      var frequencyMin = $("#frequency-input").val().trim();    
      console.log(trainName, destination, firstTrainTime, frequencyMin); 
      
    // Create local "temporary" object for holding input data
    var newTrain = {
        name: trainName,
        destination: destination,
        firstTrain: firstTrainTime,
        frequency: frequencyMin,
    };
  console.log(newTrain)

  //upload object to the database
    database.ref().push(newTrain);

    // Clear all of the fields
    $("#name-input").val("");
    $("#destination-input").val("");
    $("#time-input").val("");
    $("#frequency-input").val("");

});

database.ref().on("child_added", function(childSnapshot) {

    // Log everything that's coming out of snapshot
    console.log(childSnapshot.val());

    // Store everything into a variable.
  var trainName = childSnapshot.val().name;
  var destination = childSnapshot.val().destination;
  var firstTrain = childSnapshot.val().firstTrain;
  var frequency = childSnapshot.val().frequency;

  // Create the new row
  var newRow = $("<tr>").append(
    $("<td>").text(trainName),
    $("<td>").text(destination),
    //next arrival    
    $("<td>").text(frequency),
 );

  // Append the new row to the table
  $("#train-schedule").append(newRow);

});
