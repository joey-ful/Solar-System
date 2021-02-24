export default class Toggle {
  constructor() {
    this.createToggleMenu();
  }

  createToggleMenu() {
    let options = [
      'drag',
      'elastic-drag',
      'background',
      'shadow',
      'round-shadow',
      'vector-arts',
      'orbit-path',
    ];

    let toggleMenu = document.createElement('ul');
    document.body.appendChild(toggleMenu);

    options.forEach((option) => {
      let list = document.createElement('li');

      toggleMenu.appendChild(list);
      this.createToggle(list, option);
    });
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

    let slider = document.createElement('span');
    slider.setAttribute('class', 'slider');
    label.appendChild(slider);

    let text = document.createElement('span');
    text.setAttribute('class', 'text');
    text.innerHTML = optionName;
    label.appendChild(text);
  }
}