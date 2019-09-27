let wins = 0;
let losses = 0;

let regionStart;
let regionQuestion;
let regionEnd;

let questionsPerRound = 10;
let questionNumber = 0;
let questionsCorrect = 0;

let questionInterval;
let reviewInterval;

let answerCorrect;
let answerUserSelected;













$(document).ready(function () {

    regionStart = $('#regionStart');
    regionQuestion = $('#regionQuestion');
    regionReview = $('#regionReview');

    // show overall W/L statistics (i.e. win:0, loss:0)
    renderWinLossTotals();
    $('.progressBarInner').addClass('progressBarTransition');

    /* ##########################################################
    - the game has three pages (start region, question region, review region) 
        that are swapped out to allow allow/prevent certain user inputs
    - the site loads with the start region and triggering #button-start begins a round of questions
    ########################################################## */
    $('#button-start').on('click', function (e) {
        questionNumber = 0;
        questionsCorrect = 0;

        regionStart.detach();
        // random order of questions
        shuffleArray(questionsArray);
        setupQuestions();
    });




    /* ##########################################################
    - the QUESTION REGION contains a countdown timer, image (optional), question, set of radio buttons and a progression button

    - detach the question page when progression button is triggered (via user input or countdown timer)
    - attach REVIEW REGION and show user the quiz outcome & correct answer
    - begin 5 second countdown timer for player to view REVIEW REGION
        - review timer timeout will trigger the a button to progress to the next question
    ########################################################## */
    $('#buttonCheck').on('click', function (e) {
        clearInterval(questionInterval);

        $('footer').text("");
        regionQuestion.detach();

        $('main').append(regionReview);
        if (answerUserSelected === answerCorrect) {
            questionsCorrect++;
            $('#pReviewInfo').text('Correct');
        } else {
            $('#pReviewInfo').text('Incorrect');
        }
        // clear the user selected answer after it is no longer used
        answerUserSelected == undefined;
        // show the correct answer
        $('#pReviewResult').text('The correct answer was: ' + answerCorrect);

        // setup countdown for review region
        let seconds = 5;
        reviewIntervalManager(seconds);
    });





    /* ##########################################################
    - the REVIEW REGION is used to display EITHER the result of the question OR final result for the question set
        - when already on the QUESTION review page, if the question count EQUALS question limit, 
            the next button will re-render the review page with END GAME details
        - else and question counter under limit, load next question
        - else and question counter over limit, go back to 'home page'
    ########################################################## */
    $('#buttonNext').on('click', function () {
        clearInterval(reviewInterval);

        if (questionNumber === questionsPerRound) {
            $('#pReviewInfo').text(questionsCorrect + ' Correct | ' + (questionsPerRound - questionsCorrect) + ' Incorrect');
            $('#pReviewResult').text((questionsCorrect > questionsPerRound / 2 ? "WINNER " : "LOSER ") + "( " + Math.round((questionsCorrect / questionsPerRound) * 100) + "% )");
            questionNumber++;

            // update overall W/L statistics
            questionsCorrect > questionsPerRound / 2 ? wins++ : losses++;

            // setup countdown for viewing review page
            let seconds = 5;
            reviewIntervalManager(seconds);
        } else {
            // remove REVIEW REGION 
            // and attach next question if question limit is not reached
            // else return back to "home" screen & update overall W/L statistics
            regionReview.detach();
            if (questionNumber < questionsPerRound) {
                setupQuestions();
            }
            else {
                $('main').append(regionStart);
                renderWinLossTotals();
            }
        }
    });




    /* ##########################################################
    - after loading index.html, hide all regions and attach the START REGION
    ########################################################## */
    $('.region').detach();
    $('main').append(regionStart);
});



















function renderWinLossTotals() {
    $('#pWins').text('Wins: ' + wins);
    $('#pLosses').text('Losses: ' + losses);
}

function shuffleArray(arr) {
    for (let i = 0; i < arr.length; i++) {
        let temp = arr[0];
        let randomIndex = Math.floor(Math.random() * arr.length);
        arr[0] = arr[randomIndex];
        arr[randomIndex] = temp;
    }
    return arr;
}

function setupQuestions() {
    $('main').append(regionQuestion);

    // the round initializes with 0 question count, 
        // increment the question count after the first question is appended
    questionNumber++;
    $('.progressBarInner').css('width', `${(questionNumber / questionsPerRound) * 100}%`);
    $('#buttonCheck').text('SKIP');

    // populate DOM with image, question and options
    $('input[type=radio]').prop('checked', false);
    $('#regionImage').html('<img class="img-fluid w-100" src="' + questionsArray[questionNumber - 1].imageURI + '" alt="">');
    $('#pQuestion').text(questionsArray[questionNumber - 1].question);
    answerCorrect = questionsArray[questionNumber - 1].answers[0];
    populateOptions(questionNumber);

    // record the option string whenever a radio button is selected
    $('input[type=radio]').on('change', function () {
        $('#buttonCheck').text('CHECK ANSWER');
        answerUserSelected = $(this).parent().find('span').text();
    });
    $('footer').text('ANSWER: ' + answerCorrect);

    // setup countdown for the question timer
    let seconds = 10;
    questionIntervalManager(seconds);
}

function populateOptions(count) {
    // question count is one higher than the question index thus reduce it by 1
    let tempArr = [questionsArray[count - 1].answers[0], questionsArray[count - 1].answers[1], questionsArray[count - 1].answers[2], questionsArray[count - 1].answers[3]];
    // render multiple choice in a random order
    tempArr = shuffleArray(tempArr);
    $('#radio-a').parent().find('span').text(tempArr[0]);
    $('#radio-b').parent().find('span').text(tempArr[1]);
    $('#radio-c').parent().find('span').text(tempArr[2]);
    $('#radio-d').parent().find('span').text(tempArr[3]);
}






function questionIntervalManager(sec) {
    // display countdown a <p>
    $('#pTime').text(formatSeconds(sec));

    questionInterval = setInterval(function () {
        sec--;
        $('#pTime').text(formatSeconds(sec));

        if (sec == 0) {
            clearInterval(questionInterval);
            $('#buttonCheck').trigger('click');
        }
    }, 1000);
}
function formatSeconds(x) {
    return '00:' + ((x < 10) ? '0' + x : x);
}

function reviewIntervalManager(sec) {
    $('#buttonNext').text(`NEXT (${sec})`);
    reviewInterval = setInterval(function () {
        sec--;
        // display countdown on the button
        $('#buttonNext').text(`NEXT (${sec})`);

        if (sec == 0) {
            clearInterval(reviewInterval);
            $('#buttonNext').trigger('click');
        }
    }, 1000);
}