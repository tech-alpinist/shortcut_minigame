import Phaser from 'phaser';

import { key } from '../data';
import { state } from '../store';
import Button from '../UI/button';

const ScoreStyle = {
    fontFamily: '"Lucida Grande", Helvetica, Arial, sans-serif',
    fontSize: '32px',
    align: 'center'
}

export default class Result extends Phaser.Scene {

  constructor() {
    super(key.scene.result);
  }

  create() {
    

    this.add.image(0, 0, key.image.result).setOrigin(0);
    const particles = this.add.particles(key.atlas.flares);
    const emitter = particles.createEmitter({
      frame: [ 'red', 'blue', 'green', 'yellow' ],
      x: this.scale.width / 2,
      y: 300,
      speed: 500,
      quantity: 10,
      lifespan: 3000,
      blendMode: 'ADD'
    })
    setTimeout(() => {
      emitter.stop();
      this.add.text(this.scale.width / 2, 400, `Your score is ${state.score}`, ScoreStyle).setOrigin(0.5);
      const resetButton = new Button(this.scale.width / 2, this.scale.height / 2 + 100, 5, () => {
        this.restart();
      }, this);
    }, 200)
   
    this.cameras.main.fadeIn(300);

  }
  restart() {
    console.log('restart...');
    this.scene.stop(key.scene.result);
    state.score = 0;
    this.scene.start(key.scene.main)
  }
}
