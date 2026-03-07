import type { LedMatrixInstance, Color } from 'rpi-led-matrix';


export class TestMatrix implements LedMatrixInstance {
    brightness(): number;
    brightness(brightness: number): this;
    brightness(brightness?: unknown): number | this {
        return this;
    }
    drawBuffer(buffer: Buffer | Uint8Array, w?: number, h?: number, xO?: number, yO?: number): this {
        return this;
    }
    drawCircle(x: number, y: number, r: number): this {
        return this;
    }
    drawLine(x0: number, y0: number, x1: number, y1: number): this {
        return this;
    }
    drawRect(x0: number, y0: number, width: number, height: number): this {
        return this;
    }
    drawText(text: string, x: number, y: number, kerning?: number): this {
        return this;
    }
    fgColor(): Color;
    fgColor(color: number | Color): this;
    fgColor(color?: unknown): this | Color {
        return this;
    }
    fill(x0?: unknown, y0?: unknown, x1?: unknown, y1?: unknown): this {
        return this;
    }
    font(): string;
    font(font: unknown): this;
    font(font?: unknown): string | this {
        return this;
    }
    getAvailablePixelMappers(): string[] {
        return [];
    }
    height(): number {
        return 0;
    }

    map(cb: (coords: [number, number, number], t: number) => number): this {
        return this;
    }

    setPixel(x: number, y: number): this {
        return this;
    }
    sync(): void {
    }
    width(): number {
        return 0;
    }
    clear() {
        return this;
    }
}