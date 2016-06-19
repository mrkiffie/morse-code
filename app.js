'use strict';

if (navigator.serviceWorker) {
  navigator.serviceWorker.register('./sw.js', {
    scope: './'
  });
}

var unit = {
  dot: 150,
  dash: 450,
  space: 45,
  letterSpace: 300
};

/**
 * Returns a random hex color
 * @return {string} A hex color
 */
function getRandomColor() {
  var colors = [
    '#2196f3',
    '#4caf50',
    '#ffeb3b',
    '#ff9800',
    '#9c27b0'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

/**
 * Creates a ripple effect on the element to which it is attached
 * @param {Event} event A DOM event
 */
function rippleEffect(event) {
  event.preventDefault();
  var target = event.currentTarget;
  var rect = target.getBoundingClientRect();
  var xCenter = event.clientX - rect.left;
  var yCenter = event.clientY - rect.top;
  var radius = Math.min(rect.width, rect.height) / 4;
  var ripple = document.createElement('div');
  ripple.className = 'ripple-effect';
  ripple.style.width = radius * 2 + 'px';
  ripple.style.height = radius * 2 + 'px';
  ripple.style.top = yCenter - radius + 'px';
  ripple.style.left = xCenter - radius + 'px';
  ripple.style.pointerEvents = 'none';
  ripple.style.backgroundColor = getRandomColor();
  target.appendChild(ripple);
  window.setTimeout(function() {
    ripple.parentNode.removeChild(ripple);
  }, 1000);
}

var MorseCodePulse = {
  /**
   * @param {string} letter A string representation of the morse code for a
   * given letter
   *
   * @return {array} pulses An array containing the values for pulses for the
   * dots and dashes separated by a spacer
   */
  generatePulseArray: function(letter) {
    var pulses = [];
    letter.split('')
      .forEach(function(pulse) {
        pulses.push(pulse === '-' ? unit.dash : unit.dot);
        pulses.push(unit.space);
      });
    // remove the trailing space
    pulses.pop();
    return pulses;
  }
};

/**
 * Checkbox constuctor
 * @param {string} id The id of the checkbox to bind the settings to
 * @param {function} handler A callback that fires when the checkbox changes,
 * includes instatiation
 */
function Checkbox(id, handler) {
  this.id = id;
  this.cbx = document.getElementById(id);
  this.handler = handler || function() { };
  this._setting = undefined;
  this.restoreSetting();
  this.attachEventListener();
  this.handler();
}

Checkbox.prototype.restoreSetting = function() {
  var value = localStorage.getItem(this.id);
  if (value === null) {
    this.setSetting(this.cbx.checked);
  } else {
    this.setSetting(value === '1');
  }

  if (this.getSetting() !== this.cbx.checked) {
    this.cbx.checked = this.getSetting();
  }
};

Checkbox.prototype.setSetting = function(value) {
  this._setting = value;
  localStorage.setItem(this.id, value ? '1' : '0');
};

Checkbox.prototype.getSetting = function() {
  return this._setting;
};

Checkbox.prototype.attachEventListener = function() {
  this.cbx.addEventListener('change', this.updateSetting.bind(this), false);
  this.cbx.addEventListener('change', this.handler.bind(this), false);
};

Checkbox.prototype.updateSetting = function(evt) {
  this.setSetting(evt.target.checked);
};

/**
 * @param {element} targetElement The DOM Element which the app will be appended
 */
function MorseCodeApp(targetElement) {
  this.targetElement = targetElement;
  this.attachEventListeners();
  this.displayPanel = document.getElementById('code');
  this.vibrate = new Checkbox('vibrate');
}

MorseCodeApp.prototype.attachEventListeners = function() {
  var buttons = [].slice.apply(this.targetElement.querySelectorAll('button'));
  var len = buttons.length;
  var i;
  for (i = 0; i < len; i++) {
    buttons[i].addEventListener('click', this.eventHandler.bind(this), false);
    buttons[i].addEventListener('click', rippleEffect, false);
  }
};

MorseCodeApp.prototype.eventHandler = function(evt) {
  evt.preventDefault();
  var target = evt.target;
  var pulses = MorseCodePulse.generatePulseArray(target.value);

  this.displayPanel.innerText = target.value;

  if (this.vibrate.getSetting() === true) {
    window.navigator.vibrate(pulses);
  }
};

window.morseCodeApp = new MorseCodeApp(document.querySelector('#buttons'));

window.displayCode = new Checkbox('displayCode', function() {
  var displayPanel = document.getElementById('code');
  if (this.getSetting() === true) {
    displayPanel.style.visibility = 'visible';
  } else {
    displayPanel.style.visibility = 'hidden';
  }
});
