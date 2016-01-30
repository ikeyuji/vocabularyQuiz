
$(function(){

  'use strict';

  var voices;
  var audio = new Audio();
  // audio.src = "seikai.mp3";
  var play = document.getElementById('playBtn');
  var next = document.getElementById('nextBtn');
  var question = document.getElementById('question').innerHTML;
  var utterance = new SpeechSynthesisUtterance();
      utterance.volume = 1;
      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.lang = 'en-US';

  var randomResponses = function(){
    var responses = [
    "goodjob",
    "youdidit",
    "fantastic",
    "blavo",
    ];
    var rnd = Math.floor( Math.random() * responses.length );
    console.log(responses[rnd]);
    audio.src = responses[rnd] + ".mp3";
    audio.play();
  }

  var randomWrongAnswer = function(){
    var responses = [
    "oops",
    "uhoh",
    ];
    var rnd = Math.floor( Math.random() * responses.length );
    console.log(responses[rnd]);
    audio.src = responses[rnd] + ".mp3";
    audio.play();
  }


  var soundPlay = function(word){
    audio.src = word + ".mp3";
    audio.play();
  }

  var loadVoices = function() {
    voices = speechSynthesis.getVoices();
  }
 
  var playActive = function(){
    $('#playBtn').removeClass('disabled');
    $('#playBtn').addClass('active');    
  }
  
  // voices[19] = trinose

  var bothActive = function(){
    $('.answer').removeClass('disabled');
    $('#playBtn').removeClass('disabled');
  }

  var bothDisabled = function(){
    $('.answer').addClass('disabled');    
    $('#playBtn').addClass('disabled');
  }

  var quizSpeech = function(word){
      loadVoices();
      utterance.voice = voices[1];
      utterance.text = word;      
      speechSynthesis.speak(utterance);
  }

  var answer;

  //answer の check
  var nowPlaying = 0;

  $('.answer').on('click', function() {

    if($('.answer').hasClass('disabled')) {
      return
    }

    bothDisabled();
    var selected = $(this);
    console.log(selected);
    answer = selected[0].name;
    selected.addClass('click');
    quizSpeech(answer);
    utterance.onend = function(){
      if (question == answer) {
        soundPlay("seikai");randomWrongAnswer
        setTimeout(randomResponses, 800);
        audio.onended = function() {
          quizSpeech(answer);          
        }
        utterance.onend = function(){
          setTimeout(nextQuestion, 1000);
        }
      } else {
        soundPlay("zannen");
        setTimeout(randomWrongAnswer, 500);
        audio.onended = function() {
          quizSpeech(answer);          
        }
        utterance.onend = function(){
          setTimeout(nextQuestion, 1000);
        }
      }    
    }
  });

  var nextQuestion = function() {
    $.post('_next.php', {
       answer: answer
    }).done(function() {
      console.log();
      location.reload();
    });
  }

  var speakOut = function() {
    loadVoices();
    utterance.voice = voices[1];
    utterance.text = question;
    speechSynthesis.speak(utterance);
  }

  $('#playBtn').on('click',function(){
    choicesPlay();
  });

  var playOnce = function() {
    // ボタンがすでに押されているか、問題が取得できてない場合
    if($('#playBtn').hasClass('disabled') || nowPlaying ==1) {
      return
    }  
    bothDisabled()
    $('.effectBtn').addClass('click');
    setTimeout(speakOut, 500);
    setTimeout(removeEffect, 1600);
    setTimeout(bothActive, 1600);
  }

  var init = function (){
    loadVoices();
    utterance.volume = 0;
    utterance.text = 'page loaded';
    speechSynthesis.speak(utterance);
    utterance.onend = function(){
      utterance.volume = 1;
      playOnce();
      utterance.onend = function(){
        setTimeout(choicesPlay, 1000);     
      }
    }
  }

  var choicesPlay = function(){
    loadVoices();
    var choices = $("#choices td:nth-child(1) img");
    var execute = function(){
      var choice = choices[0].name;
      quizSpeech(choice);
      choices.addClass('click');
    }
    execute();
    utterance.onend = function (){
      choices.removeClass('click');      
      choices = $("#choices td:nth-child(2) img");
      setTimeout(execute, 700);
      utterance.onend = function (){
        choices.removeClass('click');      
        choices = $("#choices td:nth-child(3) img");
        setTimeout(execute, 700);
        utterance.onend = function (){
          choices.removeClass('click');      
        }
      }
    }
  }

  init();

  var removeEffect = function() {
    $('.effectBtn').removeClass('click');
  }

 });