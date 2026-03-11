import { getPainterMatrix } from "@packages/matrix";
import path from 'node:path';
import { delay } from "./utils";

const WIDTH = 64;
const HEIGHT = 64;

const {matrix, controls} = await getPainterMatrix();
const {DrawMode, CanvasSection, EffectType, PaintingInstruction } = controls;

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

const getGreetingInstructions = (): PaintingInstruction[] => {
    const greeting = "Hi!";
    return [{
            id: "hi",
            drawMode: DrawMode.TEXT,
            color: 0x800000,
            drawModeOptions: { font: "5x7", fontPath: pathToFont },
            points: { x: WIDTH / 2 - greeting.length*5 / 2, y: 1, z: 0 },
            text: greeting,
            layer: 1
        }]
}

const getWelcomeMessageInstructions = (): PaintingInstruction[] => {
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

const getImageInstructions = (): PaintingInstruction[] => {
    return [{
        id: "sabrina",
        drawMode: DrawMode.IMAGE,
        color: 0x000000,
        imagePath: pathToImage,
        points: { x: 0, y: 0, z: 0 },
        layer: 7
    }]
}

const getBufferInstructions = async (): Promise<PaintingInstruction[]> => {
    // const response = await fetch("https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExcWNvNDZidW55djRpYmdvd3BuN2QwZGkxbTY2Y2E3OHA4cW14OWtvdiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/IJw8FZ7WrMHoB2kidG/giphy.gif")
    // const arrayBuffer = await response.arrayBuffer();
    // const gifBuffer = Buffer.from(arrayBuffer);

    const baseBuffer = [...Array((WIDTH/2) * (HEIGHT/2) * 3).keys()];
    const buffer1 = Buffer.of(...baseBuffer.map(() => Math.random() < 0.1 ? 0xFF : 0x00));
    return [{
        id: "bufferdemo",
        drawMode: DrawMode.BUFFER,
        buffer: buffer1,
        color: 0x000000,
        height: HEIGHT/2,
        width: WIDTH/2,
        points: { x: 10, y: 10, z: 0 },
        layer: 1
    }]
}

const getRandomPixelInstructions = (id: string) => {
    const num = Math.random() * WIDTH*HEIGHT
    const x = Math.floor(num % WIDTH);
    const y = Math.floor(num / HEIGHT);

    return [{
        id,
        drawMode: DrawMode.PIXEL,
        color: getRandomColor(),
        height: 1,
        width: 1,
        drawModeOptions: { effects: [{ effectType: EffectType.PULSE, effectOptions: { rate: Math.random() * 1000 + 100 } }] },
        points: [{ x, y, z: 0 }],
        layer: 1
    }]
}

(async () => {
    matrix.getCanvas().addCanvasSection(new CanvasSection("mycanvassection", 0, 0, 1, WIDTH, HEIGHT, [], true));
    const interval = setInterval(() => matrix.paint(), 5);
    // Display greeting
    matrix.getCanvas().getCanvasSection("mycanvassection")?.setRepresentation(getGreetingInstructions());
    await delay(1000 * 1);

    // Display welcome message with effects
    matrix.getCanvas().getCanvasSection("mycanvassection")?.setRepresentation([
        ...matrix.getCanvas().getCanvasSection("mycanvassection")?.representation || [],
        ...getWelcomeMessageInstructions(),
    ]);
    await new Promise((resolve) => setTimeout(resolve, 1000 * 1));

    // Display image
    matrix.getCanvas().getCanvasSection("mycanvassection")?.setRepresentation(getImageInstructions());
    await delay(1000 * 1);

    // Clear
    matrix.getCanvas().getCanvasSection("mycanvassection")?.setRepresentation([])

    // Display random pixels with effects
    for (let i = 0; i < 20; i++) {
        matrix.getCanvas().getCanvasSection("mycanvassection")?.setRepresentation([
            ...matrix.getCanvas().getCanvasSection("mycanvassection")?.representation || [],
            ...getRandomPixelInstructions(`randompixel-${i}`),
        ]);
        await delay(Math.random() * 100, { verbose: false });
    }
    await delay(1000 * 1);
    
    matrix.getCanvas().getCanvasSection("mycanvassection")?.setRepresentation([])
    await delay(1000 * 1);

    // Display buffer
    matrix.getCanvas().getCanvasSection("mycanvassection")?.setRepresentation(await getBufferInstructions());
    await delay(1000 * 5);

    clearInterval(interval);
    matrix.clear();
})();


