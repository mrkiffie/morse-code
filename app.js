const unit = {
  dot: 100,
  dash: 300,
  space: 30,
  letterSpace: 200
};

class MorseCodePulse {
  /**
   * @param {string} letter A string representation of the morse code for a
   * given letter
   *
   * @return {array} pulses An array containing the values for pulses for the
   * dots and dashes separated by a spacer
   */
  static generatePulseArray(letter) {
    const pulses = [];
    letter.split('')
      .forEach(pulse => {
        pulses.push(pulse === '-' ? unit.dash : unit.dot);
        pulses.push(unit.space);
      });
    // remove the trailing space
    pulses.pop();
    return pulses;
  }
}

class Checkbox {
  constructor(id, handler) {
    this.id = id;
    this.cbx = document.getElementById(id);
    this.handler = handler || function() { };
    this._setting = undefined;
    this.restoreSetting();
    this.attachEventListener();
    this.handler();
  }

  restoreSetting() {
    const value = localStorage.getItem(this.id);
    if (value === null) {
      this.setting = this.cbx.checked;
    } else {
      this.setting = value === '1';
    }

    if (this.setting !== this.cbx.checked) {
      this.cbx.checked = this.setting;
    }
  }

  set setting(value) {
    this._setting = value;
    localStorage.setItem(this.id, value ? '1' : '0');
  }

  get setting() {
    return this._setting;
  }

  attachEventListener() {
    this.cbx.addEventListener('change', this.updateSetting.bind(this), false);
    this.cbx.addEventListener('change', this.handler.bind(this), false);
  }

  updateSetting(evt) {
    this.setting = evt.target.checked;
  }
}

class MorseCodeApp {
  /**
   * @param {element} targetElement The DOM Element which the app will be appended
   */
  constructor(targetElement) {
    this.targetElement = targetElement;
    this.attachEventListeners();
    this.displayPanel = document.getElementById('code');
    this.vibrate = new Checkbox('vibrate');
  }

  attachEventListeners() {
    const buttons = Array.from(this.targetElement.querySelectorAll('button'));
    buttons.forEach(el => {
      el.addEventListener('click', this.eventHandler.bind(this));
    });
  }

  eventHandler(evt) {
    evt.preventDefault();
    const target = evt.target;
    const pulses = MorseCodePulse.generatePulseArray(target.value);

    this.displayPanel.innerText = target.value;

    if (this.vibrate.setting === true) {
      window.navigator.vibrate(pulses);
    }
  }
}

window.morseCodeApp = new MorseCodeApp(document.querySelector('#buttons'));

window.displayCode = new Checkbox('displayCode', function() {
  const displayPanel = document.getElementById('code');
  if (this.setting === true) {
    displayPanel.style.visibility = 'visible';
  } else {
    displayPanel.style.visibility = 'hidden';
  }
});
