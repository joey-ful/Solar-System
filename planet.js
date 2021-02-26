export default class Planet {
  constructor(name, star, radius, color, velocity, orbitRadius) {
    this.name = name;
    this.star = star;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
    this.orbitRadius = orbitRadius;

    this.theta = Math.random() * Math.PI * 2;
    this.clicked = false;
    this.mouse = {
      x: star.x,
      y: star.y,
    };

    this.distanceFromCenter = orbitRadius;
    this.x = star.x + orbitRadius * Math.cos(this.theta);
    this.y = star.y + orbitRadius * Math.sin(this.theta);
    this.img = new Image();
  }

  update(ctx, shadowctx, pathctx, options) {
    this.theta += this.velocity;
    this.options = options;

    this.setDragOption(options);
    this.setShadowOption(shadowctx, options);
    this.setPlanetArtOption(ctx, options);
    this.setOrbitPathOption(pathctx, options);
  }

  setDragOption(options) {
    if (options['no-drag']) {
      this.noDragUpdate();
    } else if (options['basic-drag']) {
      this.interaction();
      this.dragUpdate();
    } else if (options['elastic-drag']) {
      this.interaction();
      this.elasticDragUpdate();
    }
  }

  noDragUpdate() {
    this.x = this.star.x + this.orbitRadius * Math.cos(this.theta);
    this.y = this.star.y + this.orbitRadius * Math.sin(this.theta);
  }

  dragUpdate() {
    if (this.clicked) {
      this.x = this.mouse.x;
      this.y = this.mouse.y;
    } else {
      this.x = this.star.x + this.orbitRadius * Math.cos(this.theta);
      this.y = this.star.y + this.orbitRadius * Math.sin(this.theta);
    }
  }

  elasticDragUpdate() {
    if (this.clicked) {
      this.x += (this.mouse.x - this.x) * 0.05;
      this.y += (this.mouse.y - this.y) * 0.05;
    } else {
      this.distanceFromCenter = Math.sqrt(
        Math.pow(this.star.x - this.x, 2) + Math.pow(this.star.y - this.y, 2)
      );
      this.distanceFromCenter +=
        (this.orbitRadius - this.distanceFromCenter) * 0.2;
      this.x = this.star.x + this.distanceFromCenter * Math.cos(this.theta);
      this.y = this.star.y + this.distanceFromCenter * Math.sin(this.theta);
    }
  }

  setShadowOption(shadowctx, options) {
    if (options['round-shadow']) {
      this.drawRoundShadow(shadowctx, options);
    } else if (options['rectangular-shadow']) {
      this.drawShadow(shadowctx, options);
    }
  }

  drawShadow(shadowctx, options) {
    if (this.name !== 'sun' && this.name !== 'moon') {
      this.findShadowEndPoint();

      shadowctx.beginPath();
      if (options['background']) {
        shadowctx.strokeStyle = 'rgba(33, 69, 104, 0.3)';
      } else {
        shadowctx.strokeStyle = 'rgba(77, 87, 105, 0.4)';
      }
      shadowctx.lineWidth = this.radius * 2;
      shadowctx.moveTo(this.x, this.y);
      shadowctx.lineTo(this.toX, this.toY);
      shadowctx.lineWidth = this.radius * 2;
      shadowctx.stroke();
      shadowctx.closePath();
    }
  }

  findShadowEndPoint() {
    let extralength = this.setShadowLength();

    this.toX = this.x + (this.radius + extralength) * Math.cos(this.theta);
    this.toY = this.y + (this.radius + extralength) * Math.sin(this.theta);
  }

  setShadowLength() {
    let extralength = 17;

    if (this.name === 'venus') {
      extralength += 2;
    } else if (this.name === 'earth') {
      extralength += 17;
    } else if (this.name === 'mars') {
      extralength += 18;
    } else if (this.name === 'jupiter') {
      extralength += 5;
    } else if (this.name === 'saturn') {
      extralength += 6;
    } else if (this.name === 'uranus') {
      extralength += 4;
    }

    return extralength;
  }

  drawRoundShadow(shadowctx, options) {
    if (this.name !== 'sun' && this.name !== 'moon') {
      this.findXYdistance(options);
      this.findShadowCurveDepth();
      this.findShadowPoints();

      shadowctx.beginPath();
      shadowctx.moveTo(this.Ax, this.Ay);
      shadowctx.bezierCurveTo(
        this.Ax + this.BezierX,
        this.Ay + this.BezierY,
        this.Bx + this.BezierX,
        this.By + this.BezierY,
        this.Bx,
        this.By
      );
      shadowctx.lineTo(
        this.Bx + this.shadowLengthX,
        this.By + this.shadowLengthY
      );
      shadowctx.bezierCurveTo(
        this.Bx + this.BezierX + this.shadowLengthX,
        this.By + this.BezierY + this.shadowLengthY,
        this.Ax + this.BezierX + this.shadowLengthX,
        this.Ay + this.BezierY + this.shadowLengthY,
        this.Ax + this.shadowLengthX,
        this.Ay + this.shadowLengthY
      );
      shadowctx.lineTo(this.Ax, this.Ay);
      if (options.background) {
        shadowctx.fillStyle = 'rgba(33, 69, 104, 0.3)';
      } else {
        shadowctx.fillStyle = 'rgba(77, 87, 105, 0.4)';
      }
      shadowctx.fill();
      shadowctx.closePath();
    }
  }

  findXYdistance(options) {
    let radius = this.radius;

    if (options['planet-art']) {
      if (this.name === 'saturn') {
        radius = this.radius * 0.8;
      }
    }

    this.radiusX = radius * Math.sin(this.theta);
    this.radiusY = radius * Math.cos(this.theta);
    this.shadowLengthX = (this.radius + 20) * Math.cos(this.theta);
    this.shadowLengthY = (this.radius + 20) * Math.sin(this.theta);

    if (this.name === 'mars') {
      this.shadowLengthX = (this.radius + 46) * Math.cos(this.theta);
      this.shadowLengthY = (this.radius + 46) * Math.sin(this.theta);
    } else if (this.name === 'earth') {
      this.shadowLengthX = (this.radius + 30) * Math.cos(this.theta);
      this.shadowLengthY = (this.radius + 30) * Math.sin(this.theta);
    }
  }

  findShadowCurveDepth() {
    this.BezierX = (this.radius / 1.5) * Math.cos(this.theta);
    this.BezierY = (this.radius / 1.5) * Math.sin(this.theta);
  }

  findShadowPoints() {
    this.Ax = this.x + this.radiusX;
    this.Ay = this.y - this.radiusY;
    this.Bx = this.x - this.radiusX;
    this.By = this.y + this.radiusY;
    this.Cx = this.Bx + this.shadowLengthX;
    this.Cy = this.By + this.shadowLengthY;
    this.Dx = this.Ax + this.shadowLengthX;
    this.Dy = this.Ay + this.shadowLengthY;
  }

  setPlanetArtOption(ctx, options) {
    if (options['planet-art']) {
      this.drawArt(ctx);
    } else {
      this.drawCircle(ctx);
    }
  }

  drawArt(ctx) {
    ctx.beginPath();

    let width = this.radius * 2;
    let imgX = this.x - this.radius;
    let imgY = this.y - this.radius;

    if (this.name === 'saturn') {
      width = this.radius * 4;
      imgX -= this.radius;
    } else if (this.name === 'uranus') {
      width = this.radius * 4.2;
      imgX -= this.radius * 1.1;
    }

    ctx.drawImage(this.img, imgX, imgY, width, this.radius * 2);
    this.img.src = `./srcs/${this.name}.png`;
    ctx.closePath();
  }

  drawCircle(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }

  setOrbitPathOption(pathctx, options) {
    if (options['orbit-path']) {
      this.drawPath(pathctx);
    }
  }

  drawPath(pathctx) {
    pathctx.beginPath();
    pathctx.arc(
      this.star.x,
      this.star.y,
      this.orbitRadius,
      0,
      Math.PI * 2,
      false
    );
    pathctx.globalAlpha = 0.4;
    pathctx.strokeStyle = this.color;
    pathctx.stroke();
    pathctx.closePath();
  }

  interaction() {
    this.canvas = document.getElementById('shadowcanvas');

    this.canvas.addEventListener('mousedown', this.onMouseDown);
    this.canvas.addEventListener('mouseup', this.restore);
    this.canvas.addEventListener('mouseout', this.restore);
  }

  onMouseDown = (e) => {
    this.offsetX = e.clientX - this.x;
    this.offsetY = e.clientY - this.y;

    let radius = this.radius;

    if (this.options['planet-art']) {
      if (this.name === 'saturn') {
        radius = this.radius * 4;
      } else if (this.name === 'uranus') {
        radius = this.radius * 4.2;
      }
    }

    if (
      Math.abs(this.offsetX) <= radius &&
      Math.abs(this.offsetY) <= this.radius
    ) {
      this.clicked = true;
      this.mouse.x = e.clientX - this.offsetX;
      this.mouse.y = e.clientY - this.offsetY;
      this.canvas.addEventListener('mousemove', this.onMouseMove);
    }
  };

  onMouseMove = (e) => {
    this.mouse.x = e.clientX - this.offsetX;
    this.mouse.y = e.clientY - this.offsetY;

    if (this.name !== 'sun' && this.name !== 'moon') {
      this.orbitRadius = Math.sqrt(
        Math.pow(this.mouse.x - this.star.x, 2) +
          Math.pow(this.mouse.y - this.star.y, 2)
      );
      this.theta = Math.acos((this.mouse.x - this.star.x) / this.orbitRadius);

      if (this.mouse.y - this.star.y < 0) {
        this.theta = 2 * Math.PI - this.theta;
      }

      this.toX = this.mouse.x + (this.radius + 30) * Math.cos(this.theta);
      this.toY = this.mouse.y + (this.radius + 30) * Math.sin(this.theta);
    }
  };

  restore = () => {
    if (this.clicked && this.name !== 'sun') {
      this.clicked = false;

      this.orbitRadius = Math.sqrt(
        Math.pow(this.star.x - this.x, 2) + Math.pow(this.star.y - this.y, 2)
      );
      this.theta = Math.acos((this.x - this.star.x) / this.orbitRadius);

      if (this.y - this.star.y < 0) {
        this.theta = 2 * Math.PI - this.theta;
      }

      this.canvas.removeEventListener('mousemove', this.onMouseMove);
    } else if (this.clicked && this.name === 'sun') {
      this.clicked = false;
      this.star.x = this.x;
      this.star.y = this.y;
      this.canvas.removeEventListener('mousemove', this.onMouseMove);
    }

    this.canvas.removeEventListener('mousedown', this.onMouseDown);
  };
}
