import { Application } from "@pixi/app";
import { Graphics } from "pixi.js";
import { Options } from "./interfaces/options.interface";
import { Spot } from "./spot";
import { Vector } from "./vector.interface";

export class Grid {

  public body: Array<Spot>[];
  protected rendererObject: Graphics;
  private start: Spot;
  private end: Spot;
  private openSet: Spot[] = [];
  private closedSet: Spot[] = [];
  path: Spot[] = [];

  constructor(
    public size: Vector,
    public renderer: Application,
    public options: Options) {
    this.init();
    this.loop();
    this.body = this.createEmptyGrid(size);
    this.fillGridWithSpots();
    this.fillAllNeighbors();
    this.start = this.body[0][0];
    this.start.wall = false;
    this.end = this.body[size.x - 1][size.y - 1];
    this.end.wall = false;
    this.openSet.push(this.start);
  }

  private init(): void {
    this.initRenderer();
  }

  private loop(): void {
    this.renderer.ticker.add((delta) => {

      if (this.openSet.length > 0) {

        let currentSpot: Spot = this.openSet.reduce((prev, curr) => {
          return prev.f < curr.f ? prev : curr;
        });

        if (currentSpot === this.end) {

          this.path = [];
          let temp: Spot = currentSpot;
          temp.color = 0x0000FF;
          while (temp.previous) {
            this.path.push(temp.previous);
            temp = temp.previous;
            temp.color = 0x0000FF;
          }
          let len: number = this.path.length;
          this.end.order = len + 1;
          this.path.forEach((spot: Spot) => {
            spot.order = len--;
          });
          console.log('PRG: DONE'); // TODO remove this
          this.renderer.ticker.stop();
          return;
        }

        this.openSet = this.openSet.filter((spot: Spot) => spot.gp.x !== currentSpot.gp.x && spot.gp.y !== currentSpot.gp.y);
        this.closedSet.push(currentSpot);

        currentSpot.neighbors.forEach((neighbor: Spot) => {
          if (this.closedSet.findIndex((spot: Spot) => spot.gp.x === neighbor.gp.x && spot.gp.y === neighbor.gp.y) === -1 && !neighbor.wall) {
            // let tempG: number = currentSpot.g + Math.sqrt(Math.pow(currentSpot.gp.x - neighbor.gp.x, 2) + Math.pow(currentSpot.gp.y - neighbor.gp.y, 2));
            let tempG: number = currentSpot.g + 1;
            let betterPath: boolean = false;
            if (this.openSet.findIndex((spot: Spot) => spot.gp.x === neighbor.gp.x && spot.gp.y === neighbor.gp.y) > -1) {
              if (tempG < neighbor.g) {
                neighbor.g = tempG;
                betterPath = true;
              }
            } else {
              neighbor.g = tempG;
              betterPath = true;
              this.openSet.push(neighbor);
            }
            if (betterPath) {
              // neighbor.h = Math.sqrt(Math.pow(this.end.gp.x - neighbor.gp.x, 2) + Math.pow(this.end.gp.y - neighbor.gp.y, 2));
              neighbor.h = Math.abs(this.end.gp.x - neighbor.gp.x) + Math.abs(this.end.gp.y - neighbor.gp.y);
              neighbor.f = neighbor.g + neighbor.h;
              neighbor.previous = currentSpot;
            }
          }
        });

      } else {
        console.log('PRG: NO SOLUTION'); // TODO remove this
        this.renderer.ticker.stop();
        return;
      }

      for (let i = 0; i < this.openSet.length; i++) {
        this.openSet[i].color = 0x00FF00;
      }
      for (let i = 0; i < this.closedSet.length; i++) {
        this.closedSet[i].color = 0xFF0000;
      }
    });
  }

  private initRenderer(): void {
    this.rendererObject = new Graphics();
    this.rendererObject.beginFill(0xFFFFFF);
    this.rendererObject.lineStyle(2, 0x000000);
    this.rendererObject.drawRect(0, 0, this.options.spotSize * this.size.x, this.options.spotSize * this.size.y);
    this.rendererObject.endFill();
    this.renderer.stage.addChild(this.rendererObject);
  }

  createEmptyGrid(size: Vector): Array<Spot>[] {
    const body = new Array(this.size.x);
    for (let i = 0; i < size.x; i++) {
      body[i] = new Array(size.y);
    }
    return body;
  }

  fillGridWithSpots(): void {
    for (let i = 0; i < this.size.x; i++) {
      for (let j = 0; j < this.size.y; j++) {
        this.body[i][j] = new Spot({ x: i, y: j }, this);
      }
    }
  }

  fillAllNeighbors(): void {
    for (let i = 0; i < this.size.x; i++) {
      for (let j = 0; j < this.size.y; j++) {
        this.fillNeighbors(this.body[i][j]);
      }
    }
  }

  fillNeighbors(spot: Spot): void {
    for (let i = spot.gp.x - 1; i <= spot.gp.x + 1; i++) {
      for (let j = spot.gp.y - 1; j <= spot.gp.y + 1; j++) {
        if (i >= 0 && j >= 0 && i < this.size.x && j < this.size.y) {
          if (i === spot.gp.x && j === spot.gp.y) {
            continue;
          }
          spot.neighbors.push(this.body[i][j]);
        }
      }
    }
  }

}