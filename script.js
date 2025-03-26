$(document).ready(function () {
    // Ensure user is authenticated; if not, redirect to login page.
    firebase.auth().onAuthStateChanged(function(user) {
      if (!user) {
        window.location.href = "login.html";
      }
    });
  
    // Load a new question when the page is ready.
    fetchAsyncData();
  
    // Answer button click handler.
    $(".ans-btn").on('click', function (event) {
      if (event.target.getAttribute('data-answer') === answer) {
        $(this).addClass("correct-ans");
        $(".btn").attr('disabled', 'true');
        $(".py-5.text-center").css("cursor", "no-drop");
        $("#nxt-btn").css("display", "initial");
        $("#nxt-btn").removeAttr("disabled");
        $("#nxt-btn").text("Next");
  
        // Optional: Store correct answer in Firebase Database.
        /*
        var user = firebase.auth().currentUser;
        if (user) {
          firebase.database().ref('scores/' + user.uid).push({
            question: $("#country").text(),
            result: "correct",
            timestamp: Date.now()
          });
        }
        */
      } else {
        $(this).addClass("wrong-ans");
        $(".btn").attr('disabled', 'true');
        $(".py-5.text-center").css("cursor", "no-drop");
        $("#nxt-btn").css("display", "initial");
        $("#nxt-btn").removeAttr("disabled");
        $("#nxt-btn").text("Play Again");
  
        // Optional: Store wrong answer in Firebase Database.
        /*
        var user = firebase.auth().currentUser;
        if (user) {
          firebase.database().ref('scores/' + user.uid).push({
            question: $("#country").text(),
            result: "wrong",
            timestamp: Date.now()
          });
        }
        */
      }
    });
  
    // "Next" button click handler to fetch a new question.
    $("#nxt-btn").click(function () {
      fetchAsyncData();
      $(".btn").removeAttr('disabled');
      $(".py-5.text-center").css("cursor", "pointer");
      $(".opt").removeClass("correct-ans wrong-ans");
      $("#nxt-btn").text("Next");
      $(this).attr("disabled", "true");
    });
  });
  
  // Fetch data from data.json.
  function fetchData() {
    return new Promise((res, err) => {
      fetch("./data.json")
        .then(response => response.json())
        .then(data => res(data))
        .catch(error => err(error));
    });
  }
  
  // Generate random indexes for the country and correct/wrong answers.
  function gettingRandomNums(data) {
    const max = data.length;
    recData = data;
    // Generate a random index (ensure it's within bounds)
    const countryIndex = Math.floor(Math.random() * max);
    answer = recData[countryIndex].capital; // Global variable for correct answer
    const country = recData[countryIndex].country;
  
    $("#country").text(country);
  
    const wrongAns = [];
  
    // Get three wrong answers; if a duplicate occurs, try again.
    while (wrongAns.length < 3) {
      let wrongIndex = Math.floor(Math.random() * max);
      if (wrongIndex !== countryIndex && !wrongAns.includes(recData[wrongIndex].capital)) {
        wrongAns.push(recData[wrongIndex].capital);
      }
    }
  
    // Randomly insert the correct answer among the options.
    var correctIndex = Math.floor(Math.random() * 4);
    wrongAns.splice(correctIndex, 0, answer);
  
    // Update the answer buttons.
    const answerBox = document.getElementsByClassName("opt");
    for (let count = 0; count < answerBox.length; count++) {
      answerBox[count].innerHTML = wrongAns[count];
      answerBox[count].setAttribute("data-answer", wrongAns[count]);
    }
  }
  
  // Asynchronously fetch data and generate a new question.
  async function fetchAsyncData() {
    try {
      const data = await fetchData();
      gettingRandomNums(data);
    } catch (err) {
      console.log(err);
    }
  }
  