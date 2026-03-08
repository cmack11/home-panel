import { Canvas, Painter } from 'rpi-led-matrix-painter';
import { Image } from 'rpi-led-matrix-painter/dist/image';

class StubCanvas implements Canvas {
    width(): number {
        return 64;
    }
    height(): number {
        return 32;
    }
    clear(): this {
        return this;
    }
    brightness(value?: number): number | this {
        return this;
    }
    fgColor(color?: any): any {
        return this;
    }
    bgColor(color?: any): any {
        return this;
    }
    fill(): this {
        return this;
    }
    drawRect(x: number, y: number, w: number, h: number): this {
        return this;
    }
    drawCircle(x: number, y: number, r: number): this {
        return this;
    }
    drawLine(x0: number, y0: number, x1: number, y1: number): this {
        return this;
    }
    drawText(text: string, x: number, y: number): this {
        return this;
    }
    setPixel(x: number, y: number): this {
        return this;
    }
    sync(): void {
        // no-op
    }
    // Add more as needed
}

class StubImage implements Image {
    width(): number {
        return 64;
    }
    height(): number {
        return 32;
    }
    getPixel(x: number, y: number): any {
        return { r: 0, g: 0, b: 0 };
    }
    // Add more as needed
}

export class TestMatrix implements Painter {
    canvas: any;
    matrix: any; // stub
    fontCache: any; // stub
    imageCache: any; // stub
    paintingInstructionCache: any; // stub
    startTime: number; // stub
    currentTime: number; // stub
    duration: number; // stub
    // Add other missing properties as stubs
    clock: any;
    painterOptions: any;
    font: any;
    fgColor: any;
    bgColor: any;
    brightness: any;
    pwmBits: any;
    luminanceCorrect: any;
    afterSync: any;
    // Additional stubs
    animationFrame: any;
    isPainting: boolean;
    lastPaintTime: number;
    frameRate: number;

    constructor() {
        this.canvas = new StubCanvas(); // removed
        this.matrix = {}; // stub object
        this.fontCache = new Map();
        this.imageCache = new Map();
        this.paintingInstructionCache = new Map();
        this.startTime = 0;
        this.currentTime = 0;
        this.duration = 0;
        this.clock = {};
        this.painterOptions = {};
        this.font = {};
        this.fgColor = {};
        this.bgColor = {};
        this.brightness = 100;
        this.pwmBits = 11;
        this.luminanceCorrect = false;
        this.afterSync = () => {};
        this.animationFrame = {};
        this.isPainting = false;
        this.lastPaintTime = 0;
        this.frameRate = 30;
    }
    clear(): void {
        // stub: do nothing
    }
    resetClock(): void {
        // stub: do nothing
    }
    getCanvas(): Canvas {
        return this.canvas;
    }
    getImageInstance(imagePath: string): Promise<Image> {
        return Promise.resolve(new StubImage());
    }
    protected fillBlankCanvasSections(): void {
        // stub: do nothing
    }
    paint(): void {
        // stub: do nothing
    }
    tick(): void {
        // stub: do nothing
    }
    getFontInstance(fontName: string): any {
        return {}; // stub
    }
    getPaintingInstructionSize(instruction: any): number {
        return 0; // stub
    }
    applyEffects(): void {
        // stub: do nothing
    }
}