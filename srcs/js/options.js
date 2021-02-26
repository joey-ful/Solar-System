export default class Options {
  constructor() {
    return this.createToggleMenu();
  }

  createToggleMenu() {
    this.features = {
      'background': false,
      'planet-art': false,
      'orbit-path': false,
    }

    let dragTypes = {
      'no-drag': true,
      'basic-drag': false,
      'elastic-drag': false,
    }

    let shadowTypes = {
      'no-shadow': true,
      'rectangular-shadow': false,
      'round-shadow': false,
    }

    let toggleMenu = document.createElement('ul');
    toggleMenu.setAttribute('id', 'toggleMenu');
    document.body.appendChild(toggleMenu);

    let title = document.createElement('h1');
    toggleMenu.appendChild(title);
    title.innerHTML = 'Animation Effects'

    let separator = document.createElement('div');
    separator.setAttribute('class', 'separator');
    document.body.appendChild(separator);
    
    this.createRadioList('drag', dragTypes, toggleMenu);
    this.createRadioList('shadow', shadowTypes, toggleMenu);
    this.createToggleList(this.features, toggleMenu);

    return {...this.features, ...dragTypes, ...shadowTypes};
  }

  createToggleList(options, toggleMenu) {
    for (let option in options) {
      let list = document.createElement('li');
      toggleMenu.appendChild(list);
      this.createToggle(list, option);
    }
  }

  createRadioList(type, options, toggleMenu) {
    let menulist = document.createElement('ul');
    menulist.setAttribute('class', 'radiobox');
    toggleMenu.appendChild(menulist);

    let title = document.createElement('h2');
    if (type === 'drag') {
      title.innerHTML = 'Drag Type';
    } else if (type === 'shadow') {
      title.innerHTML = 'Shadow Type';
    }
    menulist.appendChild(title);

    for (let option in options) {
      let list = document.createElement('li');
      menulist.appendChild(list);
      this.createRadio(list, option, type);
    }
  }

  createRadio(list, optionName, type) {
    let label = document.createElement('label');
    label.setAttribute('class', 'radio-label');
    label.setAttribute('for', optionName);
    list.appendChild(label);

    let input = document.createElement('input');
    input.setAttribute('type', 'radio');
    input.setAttribute('name', type);
    input.setAttribute('id', optionName);
    label.appendChild(input);
    if (optionName === 'no-drag' || optionName === 'no-shadow') {
      input.checked = true;
    }

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

    let slider = document.createElement('span');
    slider.setAttribute('class', 'slider');
    label.appendChild(slider);

    let text = document.createElement('span');
    text.setAttribute('class', 'text');
    text.innerHTML = optionName;
    label.appendChild(text);
  }
}