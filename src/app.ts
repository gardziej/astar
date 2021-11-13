import * as PIXI from 'pixi.js';
import { Grid } from './grid';
import { Options } from './interfaces/options.interface';
import { TextLine } from './text-line';
import { Vector } from './vector.interface';

const CANVAS: HTMLCanvasElement = document.querySelector('#canvas') as HTMLCanvasElement;
const renderer: PIXI.Application = new PIXI.Application({view: CANVAS, antialias: true, backgroundColor: 5375e0, width: CANVAS.width, height: CANVAS.height });

class App {

  private lastCalledTime: number;
  private fpsText: TextLine;
  private counter: number = 0;
  private graphics: PIXI.Graphics;
  private mousePosition: Vector = {x: 0, y: 0};
  private grid: Grid;
  private options: Options = {};

  constructor(public renderer: PIXI.Application) {
    this.options['debug'] = false;
    this.options['walls'] = 0.2;
    this.init();
    this.start();
    this.loop();
  }
  
  private init(): void {
    if (this.options.debug) {
      this.options['spotSize'] = 100;
    }
    else {
      this.options['spotSize'] = 5;
    }
    this.grid = new Grid({x: this.renderer.renderer.options.width / this.options['spotSize'], y: this.renderer.renderer.options.height / this.options['spotSize']}, this.renderer, this.options);
    this.fpsText = new TextLine('', 10, 10, {fontFamily : 'Arial', fontSize: 24, fill : 0xffffff, align : 'center'}, this.renderer);
  }

  private start(): void {
  }

  private loop(): void {
    this.renderer.ticker.add((delta) => {
      this.calculateFps(delta);
    });
  }

  private calculateFps(delta: number): void {
    this.counter += delta;
    if (this.counter > 60) { this.counter = 0; }
    let pNow: number = performance.now();
    if (!this.lastCalledTime) {
      this.lastCalledTime = pNow;
      this.fpsText.text = '';
      return;
    }
    const d = (pNow - this.lastCalledTime)/1000;
    this.lastCalledTime = pNow;
    if (this.counter === 0) { this.fpsText.text = String(Math.floor(1/d)); }
  }

}

new App(renderer);