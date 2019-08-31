let wins = 0;
let losses = 0;

let regionStart;
let regionQuestion;
let regionEnd;

let questionsPerRound = 5;
let questionNumber = 0;
let questionsCorrect = 0;

let questionInterval;
let reviewInterval;

let answerCorrect;
let answerUser;


$(document).ready(function () {

    regionStart = $('#regionStart');
    regionQuestion = $('#regionQuestion');
    regionReview = $('#regionReview');

    renderWinLossTotals();


    $('.progressBarInner').addClass('progressBarTransition');



    ////////////////////////////////////////////////////////////////
    //click to start the questions
    ////////////////////////////////////////////////////////////////
    $('#button-start').on('click', function (e) {
        questionNumber = 0;
        questionsCorrect = 0;

        regionStart.detach();
        setupQuestions();
    });




    ////////////////////////////////////////////////////////////////
    //click to submit answer and process
    ////////////////////////////////////////////////////////////////
    $('#buttonCheck').on('click', function (e) {
        clearInterval(questionInterval);

        $('footer').text("");
        regionQuestion.detach();


        $('main').append(regionReview);
        if (answerUser === answerCorrect) {
            questionsCorrect++;
            $('#pReviewInfo').text('Correct');
        } else {
            $('#pReviewInfo').text('Incorrect');
        }
        $('#pReviewResult').text('The correct answer was: ' + answerCorrect);

        //review phase countdown manager
        let seconds = 5;
        reviewIntervalManager(seconds);
    });


    ////////////////////////////////////////////////////////////////
    //click to start questions OR go back to start
    ////////////////////////////////////////////////////////////////
    $('#buttonNext').on('click', function () {
        clearInterval(reviewInterval);

        if (questionNumber === questionsPerRound) {
            $('#pReviewInfo').text(questionsCorrect + ' Correct | ' + (questionsPerRound - questionsCorrect) + ' Incorrect');
            $('#pReviewResult').text((questionsCorrect > questionsPerRound / 2 ? "WINNER " : "LOSER ") + "( " + Math.round((questionsCorrect / questionsPerRound) * 100) + "% )");
            questionNumber++;

            //calculate final win loss tally
            questionsCorrect > questionsPerRound / 2 ? wins++ : losses++;

            //review phase countdown manager
            let seconds = 5;
            reviewIntervalManager(seconds);
        } else {
            regionReview.detach();
            if (questionNumber < questionsPerRound) {
                setupQuestions();
            } 
            //after final win/loss result is shown, return back to the start phase
            else {
                $('main').append(regionStart);
                renderWinLossTotals();
            }
        }
    });


    //used to remove all game phase regions and attach the first game phase region
    $('.region').detach();
    $('main').append(regionStart);
});























function setupQuestions() {
    $('main').append(regionQuestion);

    questionNumber++;
    $('.progressBarInner').css('width', `${(questionNumber / questionsPerRound) * 100}%`);
    $('#buttonCheck').text('SKIP');

    //populate DOM with image, question and options
    $('input[type=radio]').prop('checked', false);
    $('#regionImage').html('<img class="img-fluid w-100" src="' + questionsArray[questionNumber - 1].imageURI + '" alt="">');
    $('#pQuestion').text(questionsArray[questionNumber - 1].question);
    answerCorrect = questionsArray[questionNumber - 1].answers[0];
    populateOptions(questionNumber);
    $('input[type=radio]').on('change', function () {
        $('#buttonCheck').text('CHECK ANSWER');
        answerUser = $(this).parent().find('span').text();
    });
    $('footer').text('ANSWER: ' + answerCorrect);


    //question phase countdown manager
    let seconds = 10;
    questionIntervalManager(seconds);
}

function populateOptions(x) {
    let tempArr = [questionsArray[x - 1].answers[0], questionsArray[x - 1].answers[1], questionsArray[x - 1].answers[2], questionsArray[x - 1].answers[3]];
    tempArr = shuffleArray(tempArr);
    $('#radio-a').parent().find('span').text(tempArr[0]);
    $('#radio-b').parent().find('span').text(tempArr[1]);
    $('#radio-c').parent().find('span').text(tempArr[2]);
    $('#radio-d').parent().find('span').text(tempArr[3]);
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

function questionIntervalManager(sec) {
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
        $('#buttonNext').text(`NEXT (${sec})`);

        if (sec == 0) {
            clearInterval(reviewInterval);
            $('#buttonNext').trigger('click');
        }
    }, 1000);
}

function renderWinLossTotals() {
    $('#pWins').text('Wins: ' + wins);
    $('#pLosses').text('Losses: ' + losses);
}