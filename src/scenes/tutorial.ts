import Phaser from 'phaser';

import { key } from '../data';
import { state } from '../store';
import { Vector } from 'matter';
import Button from '../UI/button';
import { ModalBehavoir } from 'phaser3-rex-plugins/plugins/modal.js';

const pathTextStyle = {
    fontFamily: '"Lucida Grande", Helvetica, Arial, sans-serif',
    fontSize: '24px',
};

const distanceTextStyle = {
    fontFamily: '"Lucida Grande", Helvetica, Arial, sans-serif',
    fontSize: '28px',
    align: 'center'
};
const distanceStyle = {
  fill: '0x007006',
  fontFamily: '"Lithos Pro", Helvetica, Arial, sans-serif',
  fontSize: '48px',
  align: 'center'
}
const roundTextStyle = {
    fontFamily: '"Lucida Grande", Helvetica, Arial, sans-serif',
    fontSize: '48px',
    align: 'center',
    color: '#000',
    stroke: '#02e',
    strokeThickness: 3
}
const narratorTextStyle = {
  fontFamily: '"Lucida Grande", Helvetica, Arial, sans-serif',
  fontSize: '28px',
  align: 'center'
}
const scoreTextStyle = {
    fontFamily: '"Lucida Grande", Helvetica, Arial, sans-serif',
    fontSize: '18px',
    align: 'center'
}

const timerTextStyle = {
  fontFamily: '"Lucida Grande", Helvetica, Arial, sans-serif',
  fontSize: '18px',
  align: 'center'
}

export default class Tutorial extends Phaser.Scene {
  
    map: number[];
    truck: Phaser.GameObjects.Sprite | null;
    objects: Array<Array<Phaser.GameObjects.Sprite | null | undefined>>;
    source: Phaser.GameObjects.Sprite | null | undefined;
    target: Phaser.Math.Vector2 | null;
    pedingDestory: Phaser.GameObjects.Sprite | null | undefined;
    distance: Phaser.GameObjects.Text | null;
    score: number;
    isMoving: boolean;
    pendingDistance: number;
    pendingScore: number;
    pendingFinish: boolean;
    info: any;
    totalDistance: number;
    timer: Phaser.Time.TimerEvent | null;
    timerBar: Phaser.GameObjects.Graphics | null;
    timerText: Phaser.GameObjects.Text | null;
    scoreRound: Phaser.GameObjects.Image | null;
    handNarrator: Phaser.GameObjects.Image | null;
    step: number;
    movingTruck: Phaser.GameObjects.Sprite | null | undefined;
    isMovingTruck: boolean;

  constructor() {
    super(key.scene.tutorial);
    this.map = [];
    this.objects = [];
    this.truck = null;
    this.source = null;
    this.movingTruck = null;
    this.isMovingTruck = false;
    this.target = null;
    this.distance = null;
    this.score = 0;
    this.pedingDestory = null;
    this.isMoving = false;
    this.pendingDistance = 0;
    this.pendingScore = 0;
    this.pendingFinish = false;
    this.info = key.map[0];
    this.totalDistance = 0;
    this.timerBar = null;
    this.timerText = null;
    this.timer = null;
    this.scoreRound = null;
    this.handNarrator = null;
    this.step = 0;
  }

  moveObject(u: number, type: number, pos: Vector) {
    try {
      this.isMoving = true;
      const obj = this.objects[u].pop()
      if(obj != undefined) {
        if(type == key.object.truck) {
          const dx = (obj?.x-pos.x), dy = (obj?.y-pos.y);
          const angle = Math.atan2(dy, dx) / Math.PI*180
          this.truck?.setVisible(false);
          this.movingTruck?.setPosition(obj?.x, obj?.y)
          this.movingTruck?.setVisible(true).setAngle(angle)
          this.source = this.movingTruck
          this.isMovingTruck = true;
        } else {
          this.source = obj;
        }
        this.source?.setDepth(1);
        this.target = new Phaser.Math.Vector2(pos.x, pos.y)
        this.physics.moveToObject(this.source, this.target, 400);
      }
      return obj;
    } catch {
      console.log('null')
    }
    
  }
  drawNode(x: number, y: number) {
    this.add.circle(x, y, 40, 0x1e1e1e);
    const c2 = this.add.circle(x, y, 30);
    c2.setStrokeStyle(6, 0x3355bb)
  }
  drawLine(x1: number, y1: number, x2: number, y2: number, distance: number) {
    const mx = (x1 > x2) ? (x2 + Math.abs(x2 - x1) / 2) : (x1 + Math.abs(x2 - x1) / 2);
    const my = (y1 > y2) ? (y2 + Math.abs(y2 - y1) / 2) : (y1 + Math.abs(y2 - y1) / 2);
    const a = (x1-x2), b = (y1-y2);
    const width = Math.sqrt(a*a + b*b) - 70
    const angle = Math.atan(b/a) / Math.PI*180
    const line = this.add.rectangle(mx, my, width, 40, 0x1e1e1e, 1).setOrigin(0.5).setAngle(angle)
    
    this.add.line(0, 0, x1, y1, x2, y2, 0xababab, 1).setLineWidth(1).setOrigin(0)
    this.add.circle(mx, my, 15, 0x3355bb)
    this.add.text(mx, my, `${distance}`, pathTextStyle).setOrigin(0.5)
    
    return line;
  }
  drawObject(index: number, x: number, y: number, type: number) {
    switch(type) {
      case key.object.truck:
        this.truck = this.physics.add.sprite(x, y, key.image.truck)
        this.objects[index] = [this.truck]
        break;
      case key.object.obstacle:
        this.objects[index] = [this.physics.add.sprite(x, y, key.image.obstacle)]
        break;
      case key.object.destination:
        this.objects[index] = [this.physics.add.sprite(x, y, key.image.fire)]
        break;
      case key.object.bonus_5:
        this.objects[index] = [this.physics.add.sprite(x, y, key.image.bonus_5)]
        break;
      case key.object.bonus_10:
        this.objects[index] = [this.physics.add.sprite(x, y, key.image.bonus_10)]
        break;
      case key.object.bonus_20:
        this.objects[index] = [this.physics.add.sprite(x, y, key.image.bonus_20)]
        break;
      case key.object.empty:
        this.objects[index] = []
    }
  }

  drawMap() {
    const nodes = state.map.node;
    const edges = state.graph.edge;

    for(const edge of edges) {
      const line = this.drawLine(nodes[edge.u].posX, nodes[edge.u].posY, nodes[edge.v].posX, nodes[edge.v].posY, edge.weight)
      this.drawNode(nodes[edge.u].posX, nodes[edge.u].posY);
      this.drawNode(nodes[edge.v].posX, nodes[edge.v].posY);

      // add events on edges
      line.setInteractive({useHandCursor: true}).setInteractive(line.geom, Phaser.Geom.Rectangle.Contains).on('pointerdown', () => {
        if(!this.isMoving) {
          if(nodes[edge.u].type != key.object.truck && nodes[edge.v].type != key.object.truck && nodes[edge.u].type != key.object.obstacle && nodes[edge.v].type != key.object.obstacle ) return;
          
          // step 1
          if(this.step == 0 && edge.u == 2 && edge.v == 3) {
            console.log('step 1 checked')
            this.move(nodes, edge)
            this.step ++;
            this.nextStep(this.step)
            return;
          }
          // step 2
          if(this.step == 1 && edge.u == 2 && edge.v == 4) {
            console.log('step 2 checked')
            this.move(nodes, edge)
            this.step ++;
            this.nextStep(this.step)
            return;
          }
          // step 3
          if(this.step == 2 && edge.u == 1 && edge.v == 2) {
            console.log('step 3 checked')
            this.move(nodes, edge)
            this.step ++;
            this.nextStep(this.step)
            return;
          }
          // step 4
          if(this.step == 3 && edge.u == 0 && edge.v == 1) {
            console.log('step 4 checked')
            this.move(nodes, edge)
            this.step ++;
            this.nextStep(this.step)
            return;
          }
          // step 5
          if(this.step == 4 && edge.u == 1 && edge.v == 5) {
            console.log('step 5 checked')
            this.move(nodes, edge)
            this.step ++;
            this.nextStep(this.step)
            return;
          }
          // step 6
          if(this.step == 5 && edge.u == 1 && edge.v == 2) {
            console.log('step 6 checked')
            this.move(nodes, edge)
            this.step ++;
            this.nextStep(this.step)
            return;
          }
          //step 7
          if(this.step == 6 && edge.u == 0 && edge.v == 1) {
            console.log('step 7 checked')
            this.move(nodes, edge)
            this.step ++;
            this.nextStep(this.step)
            return;
          }
          // step 8
          if(this.step == 7 && edge.u == 1 && edge.v == 5) {
            console.log('step 8 checked')
            this.move(nodes, edge)
            this.step ++;
            this.nextStep(this.step)
            return;
          }
          // step 9
          if(this.step == 8 && edge.u == 5 && edge.v == 6) {
            console.log('step 9 checked')
            this.move(nodes, edge)
            // end of the tutorial
            return;
          }
        }
      })
    }
    for(const i in nodes) {
      this.drawObject(i, nodes[i].posX, nodes[i].posY, nodes[i].type)
    }
  }
  move(nodes: any, edge: any) {
    if(nodes[edge.u].type == key.object.empty || nodes[edge.u].type ==  key.object.destination || nodes[edge.u].type >=  key.object.bonus_5) {
            
      const obj = this.moveObject(edge.v, nodes[edge.v].type, { x: nodes[edge.u].posX, y: nodes[edge.u].posY})
      this.distance?.setText(`${this.totalDistance + edge.weight}`)
      if(nodes[edge.v].type == key.object.truck) {
        this.pendingDistance = this.map[edge.u] >= 5 ? edge.weight - this.map[edge.u] : edge.weight
        if(this.map[edge.u] >= 5) this.map[edge.u] = key.object.empty
        if(this.map[edge.u] == key.object.destination) this.pendingFinish = true;
        
        this.pedingDestory = this.objects[edge.u][0];
        this.objects[edge.u] = [obj]
        this.objects[edge.v] = [null];
      } else {
        this.pendingDistance = edge.weight

        if(this.map[edge.u] == key.object.destination || this.map[edge.u] >= key.object.bonus_5) {
          this.objects[edge.u].push(obj)
        } else {
          this.objects[edge.u] = [obj]
        }
      }
      
      nodes[edge.u].type = nodes[edge.v].type;
      nodes[edge.v].type = key.object.empty;
      
    } else if(nodes[edge.v].type == key.object.empty || nodes[edge.v].type ==  key.object.destination || nodes[edge.v].type >=  key.object.bonus_5) {
      const obj = this.moveObject(edge.u, nodes[edge.u].type, { x: nodes[edge.v].posX, y: nodes[edge.v].posY})
      this.distance?.setText(`${this.totalDistance + edge.weight}`)
      if(nodes[edge.u].type == key.object.truck) {
        this.pendingDistance = this.map[edge.v] >= 5 ? edge.weight - this.map[edge.v] : edge.weight
        if(this.map[edge.v] >= 5) this.map[edge.v] = key.object.empty
        if(this.map[edge.v] == key.object.destination) this.pendingFinish = true;

        this.pedingDestory = this.objects[edge.v][0];
        this.objects[edge.v] = [obj]
        this.objects[edge.u] = [null];
      } else {
        this.pendingDistance = edge.weight
        if(this.map[edge.v] == key.object.destination || this.map[edge.v] >= key.object.bonus_5) {
          this.objects[edge.v].push(obj)
        } else {
          this.objects[edge.v] = [obj]
        }
        
      }

      nodes[edge.v].type = nodes[edge.u].type;
      nodes[edge.u].type = key.object.empty;
      
    }
  }

  drawNarrator() {
    // skip tutorial
    new ModalBehavoir(this.add.text(600, 150, 'Truck', narratorTextStyle), {
      duration: {
        in: 200,
        hold: 1000,
        out: 200
      }
    }).on('open', () => {
      this.objects[4][0]?.setDepth(1)
    }).on('close', () => {
      this.objects[4][0]?.setDepth(0)
      new ModalBehavoir(this.add.text(410, 500, 'Fire', narratorTextStyle), {
        duration: {
          in: 200,
          hold: 1000,
          out: 200
        }
      }).on('open', () => {
        this.objects[6][0]?.setDepth(1)
      }).on('close', () => {
        this.objects[6][0]?.setDepth(0)
        new ModalBehavoir(this.add.text(120, 300, 'Bonus', narratorTextStyle), {
          duration: {
            in: 200,
            hold: 1000,
            out: 200
          }
        }).on('open', () => {
          this.objects[0][0]?.setDepth(1)
        }).on('close', () => {
          this.objects[0][0]?.setDepth(0)
          new ModalBehavoir(this.add.text(600, 300, 'Obstacles', narratorTextStyle), {
            duration: {
              in: 200,
              hold: 1000,
              out: 200
            }
          }).on('open', () => {
            this.objects[2][0]?.setDepth(1)
            this.objects[5][0]?.setDepth(1)
          }).on('close', () => {
            this.objects[2][0]?.setDepth(0)
            this.objects[5][0]?.setDepth(0)
            new ModalBehavoir(this.add.text(800, 340, 'Click Here to move objects', narratorTextStyle), {
              duration: {
                in: 200,
                hold: 2000,
                out: 200
              }
            }).on('open', () => {
              this.handNarrator = this.add.image(800, 295, key.image.hands, 0).setScale(0.3).setDepth(1)
            })
          })
        })
      })
    })
  }

  nextStep(step: number) {
    switch(step) {
      case 1:
        this.handNarrator?.setPosition(690, 195);
        break;
      case 2:
        this.handNarrator?.setPosition(560, 295)
        break;
      case 3:
        this.handNarrator?.setPosition(300, 295)
        break;
      case 4:
        this.handNarrator?.setPosition(430, 350)
        break;
      case 5:
        this.handNarrator?.setPosition(560, 295)
        break;
      case 6:
        this.handNarrator?.setPosition(300, 295)
        break;
      case 7:
        this.handNarrator?.setPosition(430, 350)
        break;
      case 8:
        this.handNarrator?.setPosition(430, 500)
        break;
    }
  }

  drawUI() {
    
    // draw Round
    this.add.image(1182, 116, key.image.round).setOrigin(0.5)
    this.add.text(1168, 90, '1', roundTextStyle)
    new Button(60, this.scale.height - 45, 6, () => {
      if(!this.isMoving) this.returnHome();
    }, this)
    // draw score text and score bar
    const scoreBar = this.makeBar(1120, 200, 130, 18, 0x2ecc71)
    scoreBar.setScale(0.2, 0)
    this.add.image(1118, 207, key.image.star).setScale(0.6)
    this.add.text(1178, 200, `${state.score}`, scoreTextStyle)
    // draw timer
    this.timerBar = this.makeBar(100, 670, 700, 30, 0x2ecc71)
    this.timerBar?.setScale(state.timer / 180, 1);
    this.timerText = this.add.text(450, 676, this.formatTime(state.timer), timerTextStyle).setOrigin(0.5, 0)
    this.timer = this.time.addEvent({ delay: 1000, callback: this.onTimerEvent, callbackScope: this, loop: true });

    this.add.image(950, 670, key.image.skip).setOrigin(0.5, 0).setInteractive({ useHandCursor: true })
      .on('pointerdown', () => {
        console.log('Skip tutorial')
        this.skipTutorial();
      })
    this.scoreRound = this.add.image(1180, 400, key.image.score_round, 2).setScale(0.8)
    this.distance = this.add.text(1180, 400, `${this.totalDistance}`, distanceStyle).setOrigin(0.5)
    this.add.text(1125, 500, 'Travelled\nDistance\n', distanceTextStyle);
    
  }
  formatTime(t: number) {
    const min = Math.floor(t / 60);
    const sec = t % 60;
    return `${min < 10 ? '0'+min : min}:${sec < 10 ? '0'+sec : sec}`
  }
  onTimerEvent() {
    state.timer -= 1;
    if( state.timer == 0 ) {
      console.log('Timeout!!!')
      // stop timer
      this.timer?.destroy();
    }
    if(state.timer == 30) {
      console.log('Hurry up!')
      this.timerText?.setColor('red');
    }

    this.timerBar?.setScale(state.timer / 180, 1);
    this.timerText?.setText(this.formatTime(state.timer));
  }

  makeBar(x: number, y: number, w: number, h: number, color: number) {
    //draw the bar
    const barBack = this.add.graphics();
    barBack.fillStyle(0x23211e, 1);
    barBack.fillRect(x, y, w, h).setScale(1)
    const bar = this.add.graphics();
    //color the bar
    bar.fillStyle(color, 1);
    //fill the bar with a rectangle
    bar.fillRect(0, 0, w, h);
    
    //position the bar
    bar.x = x;
    bar.y = y;

    //return the bar
    return bar;
  }
  
  initMap() {
    state.graph.reset();
    state.map.reset();

    state.graph.setV(this.info.V);
    for(const node of this.info.nodes) {
      state.map.addNode(node.x, node.y, node.object);
    }
    for(const edge of this.info.edges) {
      state.graph.addEdge(edge.u, edge.v, edge.w);
    }

    for(const node of state.map.node) this.map.push(node.type)
  }

  returnHome () {
    window.location.assign("/index.html")
    console.log('return to home')
  }

  showBeginMessage() {
    new ModalBehavoir(this.add.image(this.scale.width / 2, this.scale.height / 2, key.image.modal).setDepth(1), {})
    .on('open', () => {
      // this.handNarrator?.setFrame(1).setScale(0.8).setPosition(this.scale.width / 2, this.scale.height / 2 - 100).setDepth(2)
      // this.add.text(this.scale.width / 2, this.scale.height / 2 - 150, 'Begin a game', {
      //   fontFamily: '"Stencil Std", Helvetica, Arial, sans-serif',
      //   fontSize: '36px',
      //   align: 'center'
      // }).setOrigin(0.5).setDepth(2)
      new Button(this.scale.width / 2, this.scale.height / 2 + 180, 3, () => {
        console.log('skip')
        this.scene.stop(key.scene.tutorial);
        this.scene.start(key.scene.main);
      }, this).setDepth(2)
    })

  }

  skipTutorial() {
    // end of the tutorial
    this.pendingFinish = false
    this.objects = [];
    this.map = [];
    this.totalDistance = 0;
    this.showBeginMessage()
  }

  create() {
    // A simple background for our game.
    this.add.image(0, 0, key.image.background).setOrigin(0);
    this.movingTruck = this.physics.add.sprite(0,0,key.image.moving_truck).setDepth(2).setVisible(false)
    this.initMap();
    this.drawMap();
    this.drawUI();
    // start tutorial
    this.drawNarrator();

    this.cameras.main.fadeIn(300);
  }

  update() {
    const tolerance = 10;

    if(this.isMoving && this.source != undefined && this.target != undefined) {
      const distance = Phaser.Math.Distance.BetweenPoints(this.source, this.target);
      if (distance < tolerance)
      {
        if(this.isMovingTruck) {
          this.isMovingTruck = false;
          this.movingTruck?.setVisible(false);
          this.truck?.body.reset(this.target.x, this.target.y);
          this.truck?.setVisible(true)
        }
        
        this.source.body.reset(this.target.x, this.target.y);
        if(this.pedingDestory != null) this.pedingDestory.destroy();
        this.totalDistance += this.pendingDistance;
        this.pendingDistance = 0;
        this.distance?.setText(`${this.totalDistance}`)
        this.isMoving = false;
        
        // check the distance and assessment the quality
        if(this.totalDistance <= this.info.results[0]) {
          this.pendingScore = 3;
        }
        if(this.totalDistance > this.info.results[0] && this.totalDistance <= this.info.results[1]) {
          this.pendingScore = 2;
        }
        if(this.totalDistance > this.info.results[1]) {
          this.pendingScore = 1;
        }

        if(this.pendingFinish) {
          this.pendingFinish = false
          this.objects = [];
          this.map = [];
          this.totalDistance = 0;
          // show game start message
          this.showBeginMessage()
        }
      }
    }
  }
}
