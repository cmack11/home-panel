import { Canvas, CanvasSection, Color } from "@packages/canvas";

const canvas = new Canvas();

canvas.addCanvasSection(new CanvasSection("section1", 0, 0, 0, 32, 32));
canvas.addCanvasSection(new CanvasSection("section2", 32, 0, 0, 32, 32));
canvas.addCanvasSection(new CanvasSection("section3", 0, 32, 0, 32, 32));
canvas.addCanvasSection(new CanvasSection("section4", 32, 32, 0, 32, 32));

const section1 = canvas.getCanvasSection("section1");
const section2 = canvas.getCanvasSection("section2");
const section3 = canvas.getCanvasSection("section3");
const section4 = canvas.getCanvasSection("section4");

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

if (section3) {
    for (let x = 0; x < 32; x++) {
        for (let y = 0; y < 32; y++) {
            section3.setPixel(x, y, Color.fromHex("#0000ff"), 1);
        }
    }
}

if (section4) {
    for (let x = 0; x < 32; x++) {
        for (let y = 0; y < 32; y++) {
            section4.setPixel(x, y, Color.fromHex("#ff00ff"), 1);
        }
    }
}

await new Promise((resolve) => setTimeout(resolve, 1000 * 5));

canvas.addCanvasSection(new CanvasSection("section5", 16, 16, 1, 32, 32));
const section5 = canvas.getCanvasSection("section5");
if (section5) {
    for (let x = 0; x < 32; x++) {
        for (let y = 0; y < 32; y++) {
            section5.setPixel(x, y, Color.fromHex("#ffff00"), 1);
        }
    }
}

await new Promise((resolve) => setTimeout(resolve, 1000 * 5));

canvas.shutdown();