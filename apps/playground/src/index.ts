import { getPainterMatrix } from "@packages/matrix";
import path from 'node:path';
import { delay } from "./utils";

const {matrix, controls} = await getPainterMatrix();
const {DrawMode, CanvasSection, EffectType} = controls;

const getRandomColor = (): number => {
  const r = Math.floor(Math.random() * 256); // 0-255
  const g = Math.floor(Math.random() * 256); // 0-255
  const b = Math.floor(Math.random() * 256); // 0-255
  return (r << 16) | (g << 8) | b; // Combine into 24-bit hex
};

const getPathToFont = () => {
    const pathToFont = path.join(__dirname, "fonts", "5x7.bdf");
    return pathToFont;
}
const pathToFont = getPathToFont();

const getPathToImage = () => {
    const pathToImage = path.join(__dirname, "images", "sabrina-64.png");
    return pathToImage;
}
const pathToImage = getPathToImage();

const getGreetingInstructions = () => {
    return [{
            id: "hi",
            drawMode: DrawMode.TEXT,
            color: getRandomColor(),
            drawModeOptions: { font: "5x7", fontPath: pathToFont },
            points: { x: 0, y: 10, z: 0 },
            text: "Hi!",
            layer: 1
        }]
}

const getWelcomeMessageInstructions = () => {
    return [{
            id: "demo",
            drawMode: DrawMode.TEXT,
            color: 0x27D3F5,
            drawModeOptions: { font: "5x7", fontPath: pathToFont, effects: [{ effectType: EffectType.PULSE, effectOptions: { rate: 500 } }, { effectType: EffectType.SCROLLLEFT, effectOptions: { rate: 50 } }] },
            points: { x: 0, y: 25, z: 0 },
            text: "Welcome to my demo!",
            layer: 1
        }]
}

const getImageInstructions = () => {
    return [{
        id: "sabrina",
        drawMode: DrawMode.IMAGE,
        color: 0x000000,
        imagePath: pathToImage,
        points: { x: 0, y: 0, z: 0 },
        layer: 7
    }]
}

const getRandomPixelInstructions = (id: string) => {
    const num = Math.random() * 64*64
    const x = Math.floor(num % 64);
    const y = Math.floor(num / 64);

    return [{
        id,
        drawMode: DrawMode.PIXEL,
        color: 0xD3F527,
        height: 1,
        width: 1,
        drawModeOptions: { effects: [{ effectType: EffectType.PULSE, effectOptions: { rate: Math.random() * 1000 + 100 } }] },
        points: [{ x, y, z: 0 }],
        layer: 1
    }]
}

(async () => {
    matrix.getCanvas().addCanvasSection(new CanvasSection("mycanvassection", 0, 0, 1, 64, 64, [], true));
    const interval = setInterval(() => matrix.paint(), 5);
    // Display greeting
    matrix.getCanvas().getCanvasSection("mycanvassection")?.setRepresentation(getGreetingInstructions());
    await delay(1000 * 3);

    // Display welcome message with effects
    matrix.getCanvas().getCanvasSection("mycanvassection")?.setRepresentation([
        ...matrix.getCanvas().getCanvasSection("mycanvassection")?.representation || [],
        ...getWelcomeMessageInstructions(),
    ]);
    await new Promise((resolve) => setTimeout(resolve, 1000 * 10));

    // Display image
    matrix.getCanvas().getCanvasSection("mycanvassection")?.setRepresentation(getImageInstructions());
    await delay(1000 * 5);

    // Clear
    matrix.getCanvas().getCanvasSection("mycanvassection")?.setRepresentation([])

    // Display random pixels with effects
    for (let i = 0; i < 100; i++) {
        matrix.getCanvas().getCanvasSection("mycanvassection")?.setRepresentation([
            ...matrix.getCanvas().getCanvasSection("mycanvassection")?.representation || [],
            ...getRandomPixelInstructions(`randompixel-${i}`),
        ]);
        await delay(Math.random() * 100, { verbose: false });
    }

    await delay(1000 * 1);
    clearInterval(interval);
    matrix.clear();
})();


