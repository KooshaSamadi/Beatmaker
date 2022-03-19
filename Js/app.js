class Bumper {
  constructor() {
    this.pads = document.querySelectorAll(".pad");
    this.playbtn = document.querySelector(".playbtn");
    this.playbtnchild = document.querySelector(".playbtnchild");
    this.kickaudio = document.querySelector(".kicksound");
    this.snareaudio = document.querySelector(".snaresound");
    this.trapaudio = document.querySelector(".trapsound");
    this.index = 0;
    //Beat Per Minute
    this.bpm = 150;
    this.isPlaying = null;
    //select all the option
    this.selects = document.querySelectorAll("select");
    this.mutebtns = document.querySelectorAll(".mute");
    this.temposlider = document.querySelector(".tempo-slider");
  }
  toggleAtviepad() {
    this.classList.toggle("active");
  }
  repeat() {
    let step = this.index % 8;
    //Grab all pads which is referre to our three beats- b0=>snare + trap + kick
    const activePad = document.querySelectorAll(`.b${step}`);
    //foreach on activepad because it contains 3 pads
    activePad.forEach((bar) => {
      bar.style.animation = `playpad 0.3s alternate ease-in-out 2`;
      //Check if active class is enabled or not
      if (bar.classList.contains("active")) {
        //check specific pad through 3 pads
        if (bar.classList.contains("kickpad")) {
          this.kickaudio.currentTime = 0;
          this.kickaudio.play();
        }
        if (bar.classList.contains("snarepad")) {
          this.snareaudio.currentTime = 0;
          this.snareaudio.play();
        }
        if (bar.classList.contains("trappad")) {
          this.trapaudio.currentTime = 0;
          this.trapaudio.play();
        }
      }
    });
    this.index++;
  }
  start() {
    //Calculate tempo
    const interval = (60 / this.bpm) * 1000;
    //Check if it's playing
    if (this.isPlaying == null) {
      //isPlaying will get a random number
      this.isPlaying = setInterval(() => {
        this.repeat();
      }, interval);
    } else {
      clearInterval(this.isPlaying);
      this.isPlaying = null;
    }
  }
  updatepalybtn() {
    if (this.isPlaying) {
      this.playbtnchild.innerHTML = "Pause";
    } else {
      this.playbtnchild.innerHTML = "Play";
    }
  }
  changesound(event) {
    const selectname = event.target.name;
    const selectvalue = event.target.value;

    switch (selectname) {
      case "kick-select":
        this.kickaudio.src = selectvalue;
        break;

      case "trap-select":
        this.trapaudio.src = selectvalue;
        break;
      case "snare-select":
        this.snareaudio.src = selectvalue;
        break;
    }
  }
  Btnmute(event) {
    const muteindex = event.target.getAttribute("data-track");
    event.target.classList.toggle("active");
    if (event.target.classList.contains("active")) {
      switch (muteindex) {
        case "0":
          this.kickaudio.volume = 0;
          break;
        case "1":
          this.trapaudio.volume = 0;
          break;
        case "2":
          this.snareaudio.volume = 0;
          break;
      }
    } else {
      switch (muteindex) {
        case "0":
          this.kickaudio.volume = 1;
          break;
        case "1":
          this.trapaudio.volume = 1;
          break;
        case "2":
          this.snareaudio.volume = 1;
          break;
      }
    }
  }
  changetempo(event) {
    const temponumber = document.querySelector(".tempo-number");
    temponumber.innerText = event.target.value;
  }
  updatetempo(event) {
    this.bpm = event.target.value;
    clearInterval(this.isPlaying);
    this.isPlaying = null;
    if (this.playbtnchild.innerHTML == "Pause") {
      this.start();
    }
  }
}

//New object
const bumper = new Bumper();

//selector
const playbtnchild = document.querySelector(".playbtn").childNodes[1];

//Eventlisners
window.addEventListener("DOMContentLoaded", getfromlocalst());
bumper.playbtnchild.addEventListener("click", function () {
  bumper.start();
  bumper.updatepalybtn();
});

bumper.pads.forEach((pad) => {
  pad.addEventListener("click", bumper.toggleAtviepad);
  pad.addEventListener("animationend", function () {
    this.style.animation = "";
  });
});

bumper.selects.forEach((sel) => {
  sel.addEventListener("change", function (event) {
    bumper.changesound(event);
    savetolocalst(event);
  });
});

bumper.mutebtns.forEach((mbtn) => {
  mbtn.addEventListener("click", function (event) {
    bumper.Btnmute(event);
  });
});

bumper.temposlider.addEventListener("input", function (event) {
  bumper.changetempo(event);
});
bumper.temposlider.addEventListener("change", function (event) {
  bumper.updatetempo(event);
});

function savetolocalst(event) {
  const selectname = event.target.name;
  const selectvalue = event.target.value;
  const selectindex = event.target.selectedIndex;
  //check if there is local storage
  //droplist=>key
  let droplist = [];
  droplist[0] = selectvalue;
  droplist[1] = selectindex;
  localStorage.setItem(selectname, JSON.stringify(droplist));
}
function getfromlocalst() {
  const kicksel = document.querySelector("#kick-select");
  const snaresel = document.querySelector("#snare-select");
  const trapsel = document.querySelector("#trap-select");
  kickst = JSON.parse(localStorage.getItem("kick-select"));
  snarest = JSON.parse(localStorage.getItem("snare-select"));
  trapst = JSON.parse(localStorage.getItem("trap-select"));
  if (kickst != null) {
    kicksel.selectedIndex = kickst[1];
  }
  if (snarest != null) {
    snaresel.selectedIndex = snarest[1];
  }
  if (trapst != null) {
    trapsel.selectedIndex = trapst[1];
  }
}
