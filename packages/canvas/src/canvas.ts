import { LedMatrixInstance } from "rpi-led-matrix";
import { getMatrix } from "./get-matrix";
import { CanvasSection } from "./canvas-section";
import { Pixel } from "./pixel";
import { Color } from "./color";


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
        this.matrix?.afterSync(() => {
            this.paint();
        });
        this.matrix?.fgColor(Color.fromHex("#ffffff").getRGB()).brightness(25).fill().sync();
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
                    console.log(`Painting pixel at (${pixel.getX()}, ${pixel.getY()}) with color ${pixel.getColor().getRGB()} and brightness ${pixel.getBrightness()}`);
                    this.matrix?.fgColor(pixel.getColor().getRGB())?.brightness(pixel.getBrightness())?.setPixel(pixel.getX(), pixel.getY());
                }
            }
        }
        setTimeout(() => this.matrix?.sync(), 1000 / 30);
    }

    public clear(): void {
        this.matrix?.clear().sync();
    }

    public shutdown(): void {
        this.matrix?.afterSync(() => {
            this.matrix?.clear()
            this.matrix?.afterSync(() => undefined);
            setTimeout(() => this.matrix?.sync(), 0);
        });
    }
}