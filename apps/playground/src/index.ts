import { getPainterMatrix } from "@packages/matrix";
import path from 'node:path';


(async () => {
    const { matrix, controls } = await getPainterMatrix();
    const { DrawMode, CanvasSection, EffectType } = controls;
    const pathToFont = path.join(__dirname, "fonts", "5x7.bdf");
    console.log("Path to font:", pathToFont);
    const response = await fetch("https://tenor.com/vW5Sam3G2kp.gif");
    console.log("Fetched image, status:", response.status);
    const arrayBuffer = await response.arrayBuffer();
    // Convert ArrayBuffer to Node.js Buffer
    const buffer = Buffer.from(arrayBuffer);
    matrix.getCanvas().addCanvasSection(new CanvasSection("mycanvassection", 0, 0, 1, 64, 64, [], true));
    const interval = setInterval(() => matrix.paint(), 5);
    matrix.getCanvas().getCanvasSection("mycanvassection")?.setRepresentation([
        {
            id: "hi",
            drawMode: DrawMode.TEXT,
            color: 0x800000,
            drawModeOptions: { font: "5x7", fontPath: pathToFont },
            points: { x: 0, y: 10, z: 0 },
            text: "Hi!",
            layer: 1
        }
    ]);

    await new Promise((resolve) => setTimeout(resolve, 1000 * 3));
    matrix.getCanvas().getCanvasSection("mycanvassection")?.setRepresentation([
        ...matrix.getCanvas().getCanvasSection("mycanvassection")?.representation || [],
        {
            id: "demo",
            drawMode: DrawMode.TEXT,
            color: 0x27D3F5,
            drawModeOptions: { font: "5x7", fontPath: pathToFont, effects: [{ effectType: EffectType.PULSE, effectOptions: { rate: 500 } }, { effectType: EffectType.SCROLLLEFT, effectOptions: { rate: 50 } }] },
            points: { x: 0, y: 25, z: 0 },
            text: "Welcome to my demo!",
            layer: 1
        }
    ]);

    await new Promise((resolve) => setTimeout(resolve, 1000 * 5));

    matrix.getCanvas().getCanvasSection("mycanvassection")?.setRepresentation([
        {
            id: "sabrina",
            drawMode: DrawMode.IMAGE,
            color: 0x000000,
            imagePath: path.join(__dirname, "images", "sabrina-64.png"),
            points: { x: 0, y: 0, z: 0 },
            width: 32,
            height: 32,
            layer: 7
        }
    ]);

    await new Promise((resolve) => setTimeout(resolve, 1000 * 5));

    matrix.getCanvas().getCanvasSection("mycanvassection")?.setRepresentation([
        {
            id: "buffer",
            drawMode: DrawMode.BUFFER,
            color: 0x000000,
            buffer: buffer,
            points: { x: 0, y: 0, z: 0 },
            width: 32,
            height: 32,
            layer: 7
        }
    ]);

    await new Promise((resolve) => setTimeout(resolve, 1000 * 5));

    clearInterval(interval);
    matrix.clear();
})();
