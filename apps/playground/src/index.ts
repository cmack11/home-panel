import { getBasicMatrix, getPainterMatrix } from "@packages/matrix";

if (process.argv.includes('--painter')) {

    (async () => {
        const {matrix, DrawMode} = await getPainterMatrix();
        matrix.getCanvas().getCanvasSection("mycanvassection")?.setRepresentation([
            {
                id: "helloworld",
                drawMode: DrawMode.TEXT,
                color: 0x800000,
                drawModeOptions: { font: "5x7", fontPath: "/home/pi/code/rpi-led-matrix-painter-test/fonts/5x7.bdf" },
                points: { x: 0, y: 0, z: 1 },
                text: "Hello, world!",
                layer: 1
            }
        ]);
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
