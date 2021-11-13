import { Application, Text, ITextStyle } from 'pixi.js';

export class TextLine {

  protected rendererObject: Text;

  constructor(
    public _text: string, 
    public x: number,
    public y: number,
    public style: Partial<ITextStyle>,
    protected renderer: Application
    ) {
      this.init();
      this.loop();
    }

  set text(t: string) {
    this._text = t;
  }

  private init(): void {
    this.initRenderer();
  }

  private initRenderer(): void {
    this.rendererObject = new Text(String(this._text), this.style);
    this.updateRenderer();
    this.renderer.stage.addChild(this.rendererObject);
  }

  private loop(): void {
    this.renderer.ticker.add((delta) => {
      this.updateRenderer();
    });
  }

  private updateRenderer(): void {
    this.rendererObject.text = this._text;
    this.rendererObject.x = this.x;
    this.rendererObject.y = this.y;
  }

}