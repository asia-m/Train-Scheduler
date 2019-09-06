var firebaseConfig = {
    apiKey: "AIzaSyCI7sTD1hDI0iOa-DHqfnqWDRha45-ca_g",
    authDomain: "train-scheduler-7f289.firebaseapp.com",
    databaseURL: "https://train-scheduler-7f289.firebaseio.com",
    projectId: "train-scheduler-7f289",
    storageBucket: "",
    messagingSenderId: "393279818744",
    appId: "1:393279818744:web:d5e803d36dd13a4f06a40d"
};

firebase.initializeApp(firebaseConfig);

var database = firebase.database();







$(document).ready(function () {
    // access firebase
    $("#save").on("click", function (e) {
        e.preventDefault();
        var trainName = $("#trainName").val().trim();
        var destination = $("#destination").val().trim();
        var firstTrain = $("#firstTrain").val().trim();
        var frequency = $("#frequency").val().trim();

        database.ref().push({
            trainName: trainName,
            destination: destination,
            firstTrain: firstTrain,
            frequency: frequency
        }).then(success => {
            $("#trainName").val(null);
            $("#destination").val(null);
            $("#firstTrain").val(null);
            $("#frequency").val(null);
            alert('Train Details are saved successfully');
        })
    });
    database.ref().on("child_added", function (snapshot) {
        var data = snapshot.val();
        if (!data) {
            return;
        }
        var firstTimeConverted = moment(data.firstTrain, "HH:mm").subtract(1, "years");
        var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
        var tRemainder = diffTime % data.frequency;
        var minutesAway = data.frequency - tRemainder;
        var nextArrival = moment().add(minutesAway, "minutes").format("hh:mm");
        var html = `<tr>
                    <td>${data.trainName}</td>
                    <td>${data.destination}</td>
                    <td>${data.frequency}</td>
                    <td>${nextArrival}</td>
                    <td>${minutesAway}</td>
                </tr>`
        $("#trainSection").append(html);
    })
});