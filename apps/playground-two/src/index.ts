import { Canvas, CanvasSection, Color } from "@packages/canvas";

const canvas = new Canvas();

canvas.addCanvasSection(new CanvasSection("section1", 0, 0, 0, 32, 32));

canvas.addCanvasSection(new CanvasSection("section2", 32, 0, 0, 32, 32));

const section1 = canvas.getCanvasSection("section1");
const section2 = canvas.getCanvasSection("section2");

if (section1) {
    for (let x = 0; x < 32; x++) {
        for (let y = 0; y < 32; y++) {
            section1.setPixel(x, y, Color.random(), 1);
        }
    }
}

if (section2) {
    for (let x = 0; x < 32; x++) {
        for (let y = 0; y < 32; y++) {
            section2.setPixel(x, y, Color.fromHex("#00ff00"), 1);
        }
    }
}