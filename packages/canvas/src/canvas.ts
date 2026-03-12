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
            .fgColor({ r: 255, g: 0, b: 0 })
            .bgColor({ r: 0, g: 0, b: 0 })
            .setPixel(x, y)
            .sync();
    }
}