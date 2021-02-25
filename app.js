import Toggle from './toggle.js';
import Planet from './planet.js';
import {PlanetInfo} from './planetInfo.js';
import Background from './background.js';

export default class App {
  constructor() {
    this.stage = document.createElement('div');
    this.stage.setAttribute('id', 'stage');
    document.body.appendChild(this.stage);

    this.stage.appendChild(this.createAndAppendCanvas('back'));
    this.stage.appendChild(this.createAndAppendCanvas('path'));
    this.stage.appendChild(this.createAndAppendCanvas(''));
    this.stage.appendChild(this.createAndAppendCanvas('shadow'));

    window.addEventListener('resize', this.resize.bind(this));
    this.resize();

    this.toggleOptions = new Toggle().toggleOptions;

    this.handleBackgroundToggle();
    this.handleToggle();
    this.createPlanets();
    this.animate();
  }

  createAndAppendCanvas(name) {
    this[`${name}canvas`] = document.createElement('canvas');
    this[`${name}canvas`].setAttribute('id', `${name}canvas`);

    this[`${name}ctx`] = this[`${name}canvas`].getContext('2d');

    return this[`${name}canvas`];
  }

  resize() {
    this.stageWidth = document.body.clientWidth;
    this.stageHeight = document.body.clientHeight;

    this.sizeCanvasAndScaleCtx('back');
    this.sizeCanvasAndScaleCtx('');
    this.sizeCanvasAndScaleCtx('path');
    this.sizeCanvasAndScaleCtx('shadow');
  }

  sizeCanvasAndScaleCtx(name) {
    this[`${name}canvas`].width = this.stageWidth * 2;
    this[`${name}canvas`].height = this.stageHeight * 2;

    this[`${name}ctx`].scale(2, 2);
  }

  handleBackgroundToggle() {
    this.background = new Background(400, this.stageWidth, this.stageHeight);
    this.background.draw(this.backctx, 'base');

    let backgroundToggle = document.getElementById('background');

    backgroundToggle.addEventListener('change', () => {
      if (this.toggleOptions.background) {
        this.background.draw(this.backctx, 'back');
      } else {
        this.background.draw(this.backctx, 'base');
      }
    });
  }

  handleToggle() {
    for (let option in this.toggleOptions) {
      let toggle = document
        .getElementById(option)
        .addEventListener('change', () => {
          this.toggleOptions.option = !this.toggleOptions.option;

          let dragTypes = ['no-drag', 'drag', 'elastic-drag'];
          let shadowTypes = ['no-shadow', 'shadow', 'round-shadow'];

          if (dragTypes.includes(option)) {
            this.handleTypes(option, dragTypes);
          } else if (shadowTypes.includes(option)) {
            this.handleTypes(option, shadowTypes);
          }
        });
    }
  }

  handleTypes(option, Types) {
    Types.forEach(type => {
      if (type !== option) {
        document.getElementById(type).checked = false;
        this.toggleOptions[type] = false;
      }
    });

    let count = 0;
    
    Types.forEach(type => {
      if (!this.toggleOptions[type]) {
        count++;
      }
    });

    if (count === Types.length) {
      document.getElementById(Types[0]).checked = true;
      this.toggleOptions[Types[0]] = true;
    }
  }

  trueToggleExists(Types) {
    Types.forEach((option) => {
      if (this.toggleOptions.option) {
        return true;
      }
    });
    return false;
  }

  createPlanets() {
    this.planets = [];

    this.sunStar = {
      name: 'sunStar',
      x: this.stageWidth / 2,
      y: this.stageHeight / 2,
    };

    PlanetInfo.forEach((planet) => {
      this[planet.name] = new Planet(
        planet.name,
        this[planet.star],
        planet.radius,
        planet.color,
        planet.velocity,
        planet.orbitRadius
      );

      this.planets.push(this[planet.name]);
    });
  }

  animate() {
    window.requestAnimationFrame(this.animate.bind(this));
    this.ctx.clearRect(0, 0, this.stageWidth, this.stageHeight);
    this.shadowctx.clearRect(0, 0, this.stageWidth, this.stageHeight);
    this.pathctx.clearRect(0, 0, this.stageWidth, this.stageHeight);

    this.planets.forEach((planet) => {
      if (planet.name === 'sun') {
        this.ctx.save();
        this.ctx.shadowColor = planet.color;
        this.ctx.shadowBlur = planet.radius * 1.5;
        planet.update(
          this.ctx,
          this.shadowctx,
          this.pathctx,
          this.toggleOptions,
          this.stageWidth,
          this.stageHeight
        );
        this.ctx.restore();
      } else {
        planet.update(
          this.ctx,
          this.shadowctx,
          this.pathctx,
          this.toggleOptions,
          this.stageWidth,
          this.stageHeight
        );
      }
    });
  }
}

new App();
