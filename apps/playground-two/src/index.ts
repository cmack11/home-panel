import { Canvas } from "@packages/canvas";

const canvas = new Canvas();

await canvas.paint();

await new Promise(resolve => setTimeout(resolve, 500));

await canvas.paint(10, 10);

await new Promise(resolve => setTimeout(resolve, 500));

await canvas.paint(20, 20);

await new Promise(resolve => setTimeout(resolve, 500));

await canvas.clear();