import { getMatrix } from "../get-matrix";


const matrix = getMatrix();
matrix.brightness(25).sync();
const fill = () => {
    for (let x = 0; x < matrix.width(); x++) {
        const color = { r: Math.random() * 255, g: Math.random() * 255, b: Math.random() * 255 };
        for (let y = 0; y < matrix.height(); y++) {
            matrix.fgColor(color).brightness(25).setPixel(x, y);
        }
    }
}
matrix.afterSync(() => {
    fill();
    setTimeout(() => {
        matrix.sync();
    }, 1000);
});
fill();
matrix.sync();

await new Promise((resolve) => setTimeout(() => {
    matrix.afterSync(() => undefined);
    matrix.sync();
    resolve(undefined);
}, 1000 * 10));

await new Promise((resolve) => setTimeout(() => {
    matrix.clear().sync();
    resolve(undefined);
}, 1000 * 10));