import Phaser from "phaser";

class Button extends Phaser.GameObjects.Image {
  constructor(x: number, y: number, iconID: number, callback: () => void, scene: Phaser.Scene) {
    super(scene, x, y, "buttons", 4 * iconID);
    this.setInteractive({ useHandCursor: true });

    this.on("pointerup", () => {
      this.setFrame(4 * iconID + 1);
    });

    this.on("pointerdown", () => {
      this.setFrame(4 * iconID + 3);

      callback.call(scene);
    });

    this.on("pointerover", () => {
      this.setFrame(4 * iconID + 1);
      this.setScale(1.08)
    });

    this.on("pointerout", () => {
      this.setFrame(4 * iconID);
      this.setScale(1)
    });

    scene.add.existing(this);
  }
}

export default Button;
