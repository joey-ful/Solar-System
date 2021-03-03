import Options from './options.js';
import Planet from './planet.js';
import {PlanetInfo} from './planetInfo.js';
import Background from './background.js';

export default class App {
  constructor() {
    this.stage = document.createElement('div');
    this.stage.setAttribute('id', 'stage');
    document.body.appendChild(this.stage);

    this.canvasType = ['back', 'path', '', 'shadow'];

    this.canvasType.forEach((type) =>
      this.stage.appendChild(this.createCanvas(type))
    );

    window.addEventListener('resize', this.resize.bind(this));
    this.resize();

    this.options = new Options();

    this.handleBackgroundToggle();
    window.addEventListener('resize', () => {
      this.drawBackground(document.getElementById('background'));
    });
    this.handleOptions();
    this.createPlanets();
    this.animate();
  }

  createCanvas(name) {
    this[`${name}canvas`] = document.createElement('canvas');
    this[`${name}canvas`].setAttribute('id', `${name}canvas`);

    this[`${name}ctx`] = this[`${name}canvas`].getContext('2d');

    return this[`${name}canvas`];
  }

  resize() {
    this.stageWidth = window.innerWidth;
    this.stageHeight = window.innerHeight;
    this.ratio = window.devicePixelRatio;

    this.canvasType.forEach(type => this.scaleCanvas(type));
  }

  scaleCanvas(name) {
    this[`${name}canvas`].width = this.stageWidth * this.ratio;
    this[`${name}canvas`].height = this.stageHeight * this.ratio;

    this[`${name}canvas`].style.width = this.stageWidth + 'px';
    this[`${name}canvas`].style.height = this.stageHeight + 'px';

    this[`${name}ctx`].scale(this.ratio, this.ratio);
  }

  handleBackgroundToggle() {
    this.background = new Background(400);
    this.background.draw(this.backctx, 'base', this.stageWidth, this.stageHeight);

    let backgroundToggle = document.getElementById('background');

    backgroundToggle.addEventListener('change', () => {
      this.drawBackground(backgroundToggle);
    });

    // window.addEventListener('resize', () => {
    //   this.drawBackground(backgroundToggle);
    // })
  }

  drawBackground(backgroundToggle) {
    if (backgroundToggle.checked) {
      this.background.draw(this.backctx, 'back', this.stageWidth, this.stageHeight);
    } else {
      this.background.draw(this.backctx, 'base', this.stageWidth, this.stageHeight);
    }
  }

  handleOptions() {
    for (let option in this.options) {
      let tag = document.getElementById(option);

      tag.addEventListener('change', () => {
        if (tag.type === 'checkbox') {
          this.options[option] = !this.options[option];
        } else {
          document.getElementsByName(tag.name).forEach((button) => {
            this.options[button.id] = button.checked;
          });
        }
      });
    }
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
        planet.update(this.ctx, this.shadowctx, this.pathctx, this.options);
        this.ctx.restore();
      } else {
        planet.update(this.ctx, this.shadowctx, this.pathctx, this.options);
      }
    });
  }
}

new App();
