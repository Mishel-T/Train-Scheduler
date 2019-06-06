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

    // Store everything in a variable.
  var trainName = childSnapshot.val().name;
  var destination = childSnapshot.val().destination;
  var firstTrain = childSnapshot.val().firstTrain;
  var frequency = childSnapshot.val().frequency;

//need to calculate nextArrival first = firstTrain + frequency converted to hh:mm a
  // firstTrain (pushed back 1 year to make sure it comes before current time)
  var firstTrainConverted = moment(firstTrain, "HH:mm").subtract(1, "years");
  console.log(firstTrainConverted);

  //not working - currently logging firstTrain as the nextArrival - fixed
  var nextArrival = moment(firstTrainConverted).add(frequency, "minutes").format("hh:mm a");
  console.log(nextArrival)

  var nextArrivalConverted = moment(nextArrival, "HH:mm").subtract(1, "years");



  // Difference between now and the next arrival to calculate minutes away of nextArrival
    var diffTime = moment().diff(moment(nextArrivalConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    // Time apart (remainder)
    var tRemainder = diffTime % frequency;
    console.log(tRemainder);

    // Minutes Until Train - not working - have no idea where it's calculating from  - working!
    var tMinutesTillTrain = frequency - tRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain)

    //working! next arrival calculated according to frequency and first train vs current time
    //but need to refresh page to show nextArrival
    var nextArrival = moment().add(tMinutesTillTrain, "minutes").format("hh:mm a");


  // Create the new row
  var newRow = $("<tr>").append(
    $("<td>").text(trainName),
    $("<td>").text(destination),
    $("<td>").text(frequency),
    $("<td>").text(nextArrival),
    $("<td>").text(tMinutesTillTrain),

    
 );

  // Append the new row to the table
  $("#train-schedule").append(newRow);

});
