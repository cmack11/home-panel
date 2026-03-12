import { Color } from "../color";

export class Pixel {
    private x: number;
    private y: number;
    private z: number;
    private color: Color;
    private brightness: number;

    constructor(x: number, y: number, z: number, color: Color, brightness: number) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.color = color;
        this.brightness = brightness;
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

    public getColor(): Color {
        return this.color;
    }

    public getBrightness(): number {
        return this.brightness;
    }

    public setColor(color: Color): void {
        this.color = color;
    }

    public setBrightness(brightness: number): void {
        this.brightness = brightness;
    }

    public getPixel(): { x: number; y: number; z: number; color: Color; brightness: number } {
        return {
            x: this.x,
            y: this.y,
            z: this.z,
            color: this.color,
            brightness: this.brightness,
        };
    }
}