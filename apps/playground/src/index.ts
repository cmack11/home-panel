import { getBasicMatrix, getPainterMatrix } from "@packages/matrix";
import path from 'node:path';

if (process.argv.includes('--painter')) {

    (async () => {
        const { matrix, controls } = await getPainterMatrix();
        const { DrawMode, CanvasSection, EffectType } = controls;
        const pathToFont = path.join(__dirname, "fonts", "5x7.bdf");
        console.log("Path to font:", pathToFont);
        matrix.getCanvas().addCanvasSection(new CanvasSection("mycanvassection", 0, 0, 1, 64, 64, [], true));
        const interval = setInterval(() => matrix.paint(), 5);
        matrix.getCanvas().getCanvasSection("mycanvassection")?.setRepresentation([
            {
                id: "hi", 
                drawMode: DrawMode.TEXT, 
                color: 0x800000, 
                drawModeOptions: { font: "5x7", fontPath: pathToFont }, 
                points: { x: 0, y: 10, z: 0 }, 
                text: "Hi Smoobie!", 
                layer: 1
            }
        ]);

        await new Promise((resolve) => setTimeout(resolve, 5000));
        matrix.getCanvas().getCanvasSection("mycanvassection")?.setRepresentation([
            ...matrix.getCanvas().getCanvasSection("mycanvassection")?.representation || [],
            {
                id: "ily", 
                drawMode: DrawMode.TEXT, 
                color: 0x800000, 
                drawModeOptions: { font: "5x7", fontPath: pathToFont, effects: [{effectType: EffectType.BLINK, effectOptions: {rate: 500}}] }, 
                points: { x: 0, y: 25, z: 0 }, 
                text: "I <3 you!", 
                layer: 1
            }
        ]);

        await new Promise((resolve) => setTimeout(resolve, 5000));

        clearInterval(interval);
        matrix.clear();
    })();

} else {

    (async () => {
        const matrix = await getBasicMatrix();

        matrix
            .clear() // clear the display
            .brightness(100) // set the panel brightness to 100%
            .fgColor(0x0000ff) // set the active color to blue
            .fill() // color the entire diplay blue
            .fgColor(0xffff00) // set the active color to yellow
            // draw a yellow circle around the display
            .drawCircle(matrix.width() / 2, matrix.height() / 2, matrix.width() / 2 - 1)
            // draw a yellow rectangle
            .drawRect(
                matrix.width() / 4,
                matrix.height() / 4,
                matrix.width() / 2,
                matrix.height() / 2
            )
            // sets the active color to red
            .fgColor({ r: 255, g: 0, b: 0 })
            // draw two diagonal red lines connecting the corners
            .drawLine(0, 0, matrix.width(), matrix.height())
            .drawLine(matrix.width() - 1, 0, 0, matrix.height() - 1)
            .sync();

        await new Promise((resolve) => setTimeout(resolve, 5000));

        matrix.clear().sync();
    })();
}
