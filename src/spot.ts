import { Graphics } from "pixi.js";
import { Grid } from "./grid";
import { TextLine } from "./text-line";
import { Vector } from "./vector.interface";

export class Spot {

  private size: number = this.parent.options.spotSize;
  protected rendererObject: Graphics;
  private _color: number = 0xCCCCCC;
  public _order: number = 0;

  public _f: number = 0;
  public _g: number = 0;
  public _h: number = 0;
  private fText: TextLine;
  private gText: TextLine;
  private hText: TextLine;
  private orderText: TextLine;

  public neighbors: Spot[] = [];
  public previous: Spot;
  public wall: boolean = false;

  set color(value: number) {
    this._color = value;
    this.rendererObject.clear();
    this.fillRect();
  }

  set order(value: number) {
    this._order = value;
    if (this.orderText) {
      this.orderText.text = String(value);
    }
  }

  get order(): number {
    return this._order;
  }

  set f(value: number) {
    this._f = value;
    if (this.fText) {
      this.fText.text = String(value.toFixed(2));
    }
  }

  get f(): number {
    return this._f;
  }

  set g(value: number) {
    this._g = value;
    if (this.gText) {
      this.gText.text = String(value.toFixed(2));
    }
  }

  get g(): number {
    return this._g;
  }

  set h(value: number) {
    this._h = value;
    if (this.hText) {
      this.hText.text = String(value.toFixed(2));
    }
  }

  get h(): number {
    return this._h;
  }

  constructor(
    public gp: Vector,
    protected parent: Grid) {
      this.init();
  }

  private init(): void {
    this.initRenderer();
    if (Math.random() < this.parent.options.walls) {
      this.wall = true;
      this.color = 0x000000;
    }
  }

  private initRenderer(): void {
    this.rendererObject = new Graphics();
    this.fillRect();
    this.parent.renderer.stage.addChild(this.rendererObject);
    if (this.parent.options.debug) {
    this.gText = new TextLine(
      String(this.g), 
      this.parent.options.spotSize * 0.1 + this.gp.x * this.parent.options.spotSize, 
      this.parent.options.spotSize * 0.1 + this.gp.y * this.parent.options.spotSize, 
      {fontFamily : 'Arial', fontSize: 16, fill : 0x000000, align : 'left'}, 
      this.parent.renderer);
    this.hText = new TextLine(
      String(this.h.toFixed(2)), 
      this.parent.options.spotSize * 0.5 + this.gp.x * this.parent.options.spotSize, 
      this.parent.options.spotSize * 0.1 + this.gp.y * this.parent.options.spotSize, 
      {fontFamily : 'Arial', fontSize: 16, fill : 0x000000, align : 'left'}, 
      this.parent.renderer);
    this.fText = new TextLine(
      String(this.f), 
      this.parent.options.spotSize * 0.2 + this.gp.x * this.parent.options.spotSize, 
      this.parent.options.spotSize * 0.45 + this.gp.y * this.parent.options.spotSize, 
      {fontFamily : 'Arial', fontSize: 26, fill : 0x000000, align : 'center'}, 
      this.parent.renderer);
    this.orderText = new TextLine(
      String(this.order), 
      this.parent.options.spotSize * 0.7 + this.gp.x * this.parent.options.spotSize, 
      this.parent.options.spotSize * 0.8 + this.gp.y * this.parent.options.spotSize, 
      {fontFamily : 'Arial', fontSize: 18, fill : 0x000000, align : 'left'}, 
      this.parent.renderer);
    }
  }

  fillRect() {
    this.rendererObject.beginFill(this._color);
    this.rendererObject.lineStyle(1, 0x000000);
    this.rendererObject.drawRect(this.gp.x * this.parent.options.spotSize, this.gp.y * this.parent.options.spotSize, this.parent.options.spotSize, this.parent.options.spotSize);
    this.rendererObject.endFill();
  }

}