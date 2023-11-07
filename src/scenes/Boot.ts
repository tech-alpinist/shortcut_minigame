import Phaser from 'phaser';

import { background, bonus_5, bonus_10, bonus_20, truck, obstacle, star, round, fire, modal, result, skip, scoreRound, hands, buttons, flares, flaresJSON, moving_truck } from '../assets';
import { key } from '../data';

export default class Boot extends Phaser.Scene {
  constructor() {
    super(key.scene.boot);
  }

  preload() {
    this.load.image(key.image.background, background);
    this.load.image(key.image.truck, truck);
    this.load.image(key.image.moving_truck, moving_truck)
    this.load.image(key.image.obstacle, obstacle);
    this.load.image(key.image.bonus_5, bonus_5);
    this.load.image(key.image.bonus_10, bonus_10);
    this.load.image(key.image.bonus_20, bonus_20);
    this.load.image(key.image.star, star);
    this.load.image(key.image.round, round);
    this.load.image(key.image.skip, skip);
    this.load.image(key.image.fire, fire);
    this.load.image(key.image.result, result);
    this.load.image(key.image.modal, modal);
    this.load.spritesheet(key.image.hands, hands, {
      frameWidth: 326, frameHeight: 326, margin: 0, spacing: 0
    })
    this.load.spritesheet(key.image.score_round, scoreRound, {
      frameWidth: 200, frameHeight: 200, margin: 0, spacing: 0
    });
    this.load.spritesheet(key.image.buttons, buttons, {
      frameWidth: 50, frameHeight: 50, margin: 0, spacing: 0
    });
    this.load.atlas(key.atlas.flares, flares, flaresJSON);
  }

  create() {
    this.scene.start(key.scene.tutorial);
  }
}
