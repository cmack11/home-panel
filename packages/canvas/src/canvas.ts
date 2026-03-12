import { LedMatrixInstance } from "rpi-led-matrix";
import { getMatrix } from "./get-matrix";


export class Canvas {

    private matrix: LedMatrixInstance | undefined;

    constructor() {
        this.matrix = getMatrix();
    }

    public paint(x: number = 0, y: number = 0): void {
        if(x >= (this.matrix?.width() ?? 64) || y >= (this.matrix?.height() ?? 64)){
            return;
        }
        this.matrix?.clear().brightness(50)
            .fgColor({ r: Math.floor(Math.random()*255), g: Math.floor(Math.random()*255), b: Math.floor(Math.random()*255) })
            .setPixel(x, y)
            .sync();
    }

    public clear(): void {
        this.matrix?.clear().sync();
    }
}