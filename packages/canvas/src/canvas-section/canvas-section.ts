import { Color } from "../color";
import { Pixel } from "../pixel";


export class CanvasSection {
    private id: string;
    private x: number;
    private y: number;
    private z: number;
    private width: number;
    private height: number;
    private pixels: Pixel[][] = [];

    constructor(id: string, x: number, y: number, z: number, width: number, height: number) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.z = z;
        this.width = width;
        this.height = height;
        this.pixels = new Array(height).fill(null).map(() => new Array(width).fill(null));
    }

    public getId(): string {
        return this.id;
    }

    public getX(): number {
        return this.x;
    }

    public getY(): number {
        return this.y;
    }

    public getZ(): number {
        return this.z;
    }

    public getWidth(): number {
        return this.width;
    }

    public getHeight(): number {
        return this.height;
    }

    public setPixel(x: number, y: number, color: Color, brightness: number): void {
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
            throw new Error(`Pixel coordinates (${x}, ${y}) are out of bounds for canvas section with width ${this.width} and height ${this.height}`);
        }
        this.pixels[y][x] = new Pixel(x, y, this.z, color, brightness);
    }

    public getPixelsForPainting(): Pixel[][] {
        const pixelsForPainting: Pixel[][] = [];

        for (let row = 0; row < this.height; row++) {
            const pixelRow: Pixel[] = [];
            for (let col = 0; col < this.width; col++) {
                if (this.pixels[row][col]) {
                    const pixel = this.pixels[row][col];
                    pixelRow[col] = new Pixel(this.x + col, this.y + row, this.z, pixel.getColor(), pixel.getBrightness());
                }
            }
            pixelsForPainting.push(pixelRow);
        }
        return pixelsForPainting;
    }
}