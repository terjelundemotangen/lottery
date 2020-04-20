
const btnMix = document.querySelector('#mix');
const btnDelete = document.querySelector('#delete');
const btnAdd = document.querySelector('#add');
const btnSaveSettings = document.querySelector('#save-settings');
const nameInput = document.querySelector('#name');
const participants = document.querySelector('#participants');
const showTickets = document.querySelector('#tickets-show');

const winners = document.querySelector('#winners');
const numberWinners = document.querySelector('#number-winners');
const numberOfWins = document.querySelector('#number-of-wins');

// const form = document.querySelector('#participant-form');
// const formSettings = document.querySelector('#form-settings');
const donateInput = document.querySelector('#donated-amount');

// Global variables
let count = 0;
let newWinner = [];

loadEventListeners();

// Load all event listeners
function loadEventListeners() {
  btnMix.addEventListener('click', mixTickets);
  // DOM load event
  document.addEventListener('DOMContentLoaded', showParticipants);
  // Show tickets already in the system
  document.addEventListener('DOMContentLoaded', mixTickets);
  // Get donatedFactor
  document.addEventListener('DOMContentLoaded', getSettings);
  // Clear participants
  btnDelete.addEventListener('click', emptyList);
  // Add participant
  btnAdd.addEventListener('click', addName);
  // Check a ticket
  showTickets.addEventListener('click', checkTickets);
  // Delete participant
  participants.addEventListener('click', deleteNames);
  // Save settings
  btnSaveSettings.addEventListener('click', saveSettings);
}

// Get participants from local storage
function showParticipants() {
  // Empty the list before populating again
  while (participants.firstChild) {
    participants.removeChild(participants.lastChild);
  }
  let allNames;
  if(localStorage.getItem('allNames') === null) {
    allNames = [];
  } else {
    allNames = JSON.parse(localStorage.getItem('allNames'));
  }
  allNames.forEach(function(name) {
    const li = document.createElement('li');

    li.className = 'participant-name';
    li.appendChild(document.createTextNode(name));
    const link = document.createElement('a');
    link.className = 'delete-name';
    link.innerHTML = '<span class="float-right delete"></span>';
    // link.innerHTML = '<span class="delete"></span>';
    li.appendChild(link);
    participants.appendChild(li);
  });
}

// Should be called via "mix"
function makeTickets(everyTicket) {
  // Clean up before making the boxes
  while (showTickets.firstChild) {
    showTickets.removeChild(showTickets.lastChild);
  }

  let i = 1;
  if(localStorage.getItem('allTickets') !== null) {
    everyTicket.forEach(function(name) {
      const newTicket = document.createElement('div');
      newTicket.className = 'ticket fresh';
      newTicket.setAttribute('id', i);
      newTicket.setAttribute('name', name);
      newTicket.innerHTML = `<h2>${i}</h2><br><p>${name}</p>`;
      showTickets.appendChild(newTicket);
      i++;
    });
    // total number of tickets
    let allTickets = document.querySelector('#tickets-show').lastElementChild.getAttribute('id');
  }
}

// Check what is clicked
function checkTickets(e) {
  let clickName;
  let clickID;
  const allTickets = document.querySelectorAll('.ticket');
  let numberWinners;
  let numberOfWins;

  // Get number of winners
  if(localStorage.getItem('numberWinners') === null) {
    numberWinners = 1;
  } else {
    numberWinners = localStorage.getItem('numberWinners');
  }
  // Get number of wins per person
  if(localStorage.getItem('numberOfWins') === null) {
    numberOfWins = 1;
  } else {
    numberOfWins = localStorage.getItem('numberOfWins');
  }

  if(e.target.parentElement.classList.contains('ticket')) {
    clickName = e.target.parentElement.getAttribute('name');
    clickID = e.target.parentElement.getAttribute('id');
    clickClass = e.target.parentElement.getAttribute('class');
  } else {
    clickName = e.target.getAttribute('name');
    clickID = e.target.getAttribute('id');
    clickClass = e.target.getAttribute('class');
  }

  // If name is not null
  if(clickName != null) {

    let numberOfTickets = document.querySelector('#tickets-show').lastElementChild.getAttribute('id');
    const li = document.createElement('li');
    if(numberWinners > count) {
      li.className = 'winners';
      li.appendChild(document.createTextNode(clickName));
      winners.insertBefore(li, winners.firstChild);
      allTickets[clickID - 1].className = 'ticket finished winner-ticket';
    }
    // Add winner to array
    newWinner.push(clickName);
    if(getOccurrence(newWinner, clickName) >= numberOfWins) {
      // Turn all tickets for this name
      let ticketName = document.querySelectorAll('[name=' + clickName + ']');
      for(let i = 0; i < ticketName.length; i++) {
        ticketName[i].classList.remove('fresh');
        ticketName[i].classList.add('finished');
      }
    }

    count++;
    if(numberWinners <= count) {
      let tickets = document.querySelectorAll('.fresh');

      for(let i = 0; i < tickets.length; i++) {
        tickets[i].classList.remove('fresh');
        tickets[i].classList.add('finished');
      }
    }
  }
}

function getOccurrence(array, value) {
  var count = 0;
  array.forEach((v) => (v === value && count++));
  return count;
}

function saveSettings(e) {
  e.preventDefault();
  localStorage.setItem('donatedTickets', donateInput.value);
  localStorage.setItem('numberWinners', numberWinners.value);
  localStorage.setItem('numberOfWins', numberOfWins.value);
  document.querySelector('#settings').classList.remove('show');
}

function getSettings() {
  if(localStorage.getItem('donatedTickets') === null) {
    donateInput.value = 50;
  } else {
    donateInput.value = localStorage.getItem('donatedTickets');
  }
  if(localStorage.getItem('numberWinners') === null) {
    numberWinners.value = 1;
  } else {
    numberWinners.value = localStorage.getItem('numberWinners');
  }
  if(localStorage.getItem('numberOfWins') === null) {
    numberOfWins.value = 1;
  } else {
    numberOfWins.value = localStorage.getItem('numberOfWins');
  }
}

function mixTickets() {
  let allTickets;

  if(localStorage.getItem('allTickets') === null) {
    allTickets = [];
  } else {
    allTickets = JSON.parse(localStorage.getItem('allTickets'));
  }

  shuffle(allTickets);
  console.log(allTickets);
  makeTickets(allTickets);
}

function addName(e) {
  e.preventDefault();

  let allNames;
  let allTickets;
  let donatedFactor;
  let ticketOK;

  if(localStorage.getItem('donatedTickets') === null) {
    donatedFactor = 50;
  } else {
    donatedFactor = localStorage.getItem('donatedTickets');
  }

  if(Math.floor(donated.value/donatedFactor) > 0) {
    ticketOK = true;
  } else {
    ticketOK = false;
  }

  if(ticketOK === true) {
    if(localStorage.getItem('allNames') === null) {
      allNames = [];
    } else {
      allNames = JSON.parse(localStorage.getItem('allNames'));
    }
    allNames.push(nameInput.value);

    allNames.sort();

    localStorage.setItem('allNames', JSON.stringify(allNames));

    showParticipants();

    // Add number of tickets for each participant
    if(localStorage.getItem('allTickets') === null) {
      allTickets = [];
    } else {
      allTickets = JSON.parse(localStorage.getItem('allTickets'));
    }

    for (var i = 0; i < Math.floor(donated.value/donatedFactor); i++) {
      allTickets.push(nameInput.value);
    }

    localStorage.setItem('allTickets', JSON.stringify(allTickets));

    mixTickets();
  }

  nameInput.value = '';
  donated.value = '';
}

function deleteNames(e) {
  if(e.target.parentElement.classList.contains('delete-name')) {
    if(confirm('Delete participant?')) {
      e.target.parentElement.parentElement.remove();
      // Remove from local storage
      removeNameFromLocalStorage(e.target.parentElement.parentElement);
    }
  }
}

// Remove name from local storage
function removeNameFromLocalStorage(deleteName) {

  let allNames;
  let allTickets;
  let newTickets = [];

  if(localStorage.getItem('allNames') === null) {
    allNames = [];
  } else {
    allNames = JSON.parse(localStorage.getItem('allNames'));
  }

  allNames.forEach(function(name, index) {
    if(deleteName.textContent === name) {
      allNames.splice(index, 1);
    }
  });
  localStorage.setItem('allNames', JSON.stringify(allNames));

  // Delete from tickets
  if(localStorage.getItem('allTickets') === null) {
    allTickets = [];
  } else {
    allTickets = JSON.parse(localStorage.getItem('allTickets'));
  }
  allTickets.forEach(function(name, index) {
    if(deleteName.textContent !== name) {
      // This deletes 3 names
      //allTickets.splice(index, 3);
      newTickets.push(name);
    }
  });

  // localStorage.setItem('allTickets', JSON.stringify(allTickets));
  localStorage.setItem('allTickets', JSON.stringify(newTickets));

  mixTickets();
}

function emptyList() {
  // console.log('SLett');
  if(confirm('Empty list. Are you sure?')) {
    localStorage.removeItem('allNames');
    localStorage.removeItem('allTickets');
  }
  showParticipants();
  mixTickets();
}

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}
