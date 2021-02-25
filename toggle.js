export default class Toggle {
  constructor() {
    this.createToggleMenu();
  }

  createToggleMenu() {
    this.toggleOptions = {
      'no-drag': true,
      'drag': false,
      'elastic-drag': false,
      'no-shadow': true,
      'shadow': false,
      'round-shadow': false,
      'background': false,
      'planet-art': false,
      'orbit-path': false,
    };

    let dragTypes = ['no-drag', 'drag', 'elastic-drag'];
    let shadowTypes = ['no-shadow', 'shadow', 'round-shadow'];

    let toggleMenu = document.createElement('ul');
    document.body.appendChild(toggleMenu);

    for (let option in this.toggleOptions) {
      let list = document.createElement('li');
      toggleMenu.appendChild(list);

      if (dragTypes.includes(option)) {
        this.createRadio(list, option, dragTypes);
      } else if (shadowTypes.includes(option)) {
        this.createRadio(list, option, shadowTypes);
      } else {
        this.createToggle(list, option);
      }
    }

    return this.toggleOptions;
  }

  createRadio(list, optionName, types) {
    let radiobox = document.createElement('container');
    radiobox.setAttribute('class', 'radiobox');
    
    


    let label = document.createElement('label');
    label.setAttribute('class', 'radio-label');
    label.setAttribute('for', optionName);
    list.appendChild(label);

    let input = document.createElement('input');
    input.setAttribute('type', 'radio');
    input.setAttribute('id', optionName);
    label.appendChild(input);
    if (optionName === 'no-drag' || optionName === 'no-shadow') {
      input.checked = true;
    }

    input.addEventListener('change', () => {
      this.toggleOptions[input.id] = !this.toggleOptions[input.id];
    })

    let radio = document.createElement('span');
    radio.setAttribute('class', 'radio');
    label.appendChild(radio);

    let text = document.createElement('span');
    text.setAttribute('class', 'radio-text');
    text.innerHTML = optionName;
    label.appendChild(text);
  }

  createToggle(list, optionName) {
    let label = document.createElement('label');
    label.setAttribute('class', 'label');
    label.setAttribute('for', optionName);
    list.appendChild(label);

    let input = document.createElement('input');
    input.setAttribute('type', 'checkbox');
    input.setAttribute('id', optionName);
    label.appendChild(input);
    if (optionName === 'no-drag' || optionName === 'no-shadow') {
      input.checked = true;
    }

    input.addEventListener('change', () => {
      this.toggleOptions[input.id] = !this.toggleOptions[input.id];
    })

    let slider = document.createElement('span');
    slider.setAttribute('class', 'slider');
    label.appendChild(slider);

    let text = document.createElement('span');
    text.setAttribute('class', 'text');
    text.innerHTML = optionName;
    label.appendChild(text);
  }
}