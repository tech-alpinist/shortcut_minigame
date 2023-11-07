import Phaser from 'phaser';

import { key } from '../data';
import { state } from '../store';

export default class Main extends Phaser.Scene {

  constructor() {
    super(key.scene.main);
  }

  randomRounds() {
    const rounds = []
    for(let i = 0; i < 7; i++) {
      rounds.push(this.randNum(i * 7 + 1))
    }
    return rounds;
  }
  randNum(start: number) {
    return Math.floor(Math.random() * 7) + start
  }

  create() {
    const rounds = this.randomRounds();
    console.log(rounds)
    state.rounds = []
    for(const round of rounds) {
      state.rounds.push(key.map[round])
    }
    
    state.timer = 180;
    this.scene.start(key.scene.map, {map: state.rounds[0], round: 1})

  }

  update() {
    //
  }
}
