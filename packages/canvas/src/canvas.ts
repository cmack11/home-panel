import { LedMatrixInstance } from "rpi-led-matrix";
import { getMatrix } from "./get-matrix";
import { CanvasSection } from "./canvas-section";
import { Pixel } from "./pixel";


export class Canvas {

    private matrix: LedMatrixInstance | undefined;
    private canvasSections: CanvasSection[] = [];
    private intervalId: NodeJS.Timeout | undefined;

    constructor() {
        this.matrix = getMatrix();
        this.startPaintingLoop();
    }

    public addCanvasSection(canvasSection: CanvasSection): void {
        this.canvasSections.push(canvasSection);
    }

    public getCanvasSection(id: string): CanvasSection | undefined {
        return this.canvasSections.find(section => section.getId() === id);
    }

    private startPaintingLoop(): void {
        this.intervalId = setInterval(() => {
            this.paint();
        }, 1000 / 30); // 30 FPS
    }

    public paint(): void {
        const pixelsForPainting: Pixel[][] = new Array(this.matrix?.height() ?? 64).fill(null).map(() => new Array(this.matrix?.width() ?? 64).fill(null));
        this.canvasSections.sort((a, b) => a.getZ() - b.getZ());
        for (const canvasSection of this.canvasSections) {
            const sectionPixels = canvasSection.getPixelsForPainting();
            for (const row of sectionPixels) {
                for (const pixel of row) {
                    if (pixel) {
                        pixelsForPainting[pixel.getY()][pixel.getX()] = pixel;
                    }
                }
            }
        }
        for (const row of pixelsForPainting) {
            for (const pixel of row) {
                if (pixel) {
                    this.matrix?.fgColor(pixel.getColor() as any)?.setPixel(pixel.getX(), pixel.getY());
                }
            }
        }
        this.matrix?.sync();
    }

    public clear(): void {
        this.matrix?.clear().sync();
    }

    public shutdown(): void {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
        this.matrix?.clear().sync();
    }
}