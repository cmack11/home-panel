import * as matrix from "wesleytabaka-rpi-led-matrix";
import { Canvas } from "./canvas";
import { CanvasSection } from "./canvassection";
import { DrawMode } from "./drawmode";
import { DrawModeOption } from "./drawmodeoption";
import { PaintingInstruction } from "./paintinginstruction";
import { Point } from "./point";
import { EffectType } from "./effecttype";
import { Image } from "./image";
import Jimp from "jimp";
import { PaintingInstructionCache } from "./paintinginstructioncache";

export class Painter {

    private canvas: Canvas;
    private matrix: matrix.LedMatrixInstance;
    private fontCache: matrix.FontInstance[];
    private imageCache: Image[];
    private paintingInstructionCache: PaintingInstructionCache;

    private startTime: Date;
    private currentTime: Date;
    private duration: number;

    private renderers: Record<DrawMode, Function>;

    constructor(matrixOptions: matrix.MatrixOptions, runtimeOptions: matrix.RuntimeOptions){

        this.canvas = new Canvas(matrixOptions, runtimeOptions);
        this.matrix = new matrix.LedMatrix(matrixOptions, runtimeOptions);

        this.fontCache = [];
        this.imageCache = [];
        this.paintingInstructionCache = {} as PaintingInstructionCache;

        this.startTime = new Date();
        this.currentTime = new Date();
        this.duration = 0;

        this.renderers = {
            [DrawMode.LINE]: this.renderLine.bind(this),
            [DrawMode.RECTANGLE]: this.renderRectangle.bind(this),
            [DrawMode.CIRCLE]: this.renderCircle.bind(this),
            [DrawMode.POLYGON]: this.renderPolygon.bind(this),
            [DrawMode.PIXEL]: this.renderPixel.bind(this),
            [DrawMode.TEXT]: this.renderText.bind(this),
            [DrawMode.IMAGE]: this.renderImage.bind(this),
            [DrawMode.BUFFER]: this.renderBuffer.bind(this),
            [DrawMode.ELLIPSE]: () => {throw new Error("DrawMode.ELLIPSE is not supported yet")},
        };
    }

    private tick(){
        this.currentTime = new Date();
        this.duration = this.currentTime.getTime() - this.startTime.getTime();
    }

    public clear(){
        this.matrix.clear();
    }

    public resetClock(){
        this.startTime = new Date();
        this.tick();
    }

    public getCanvas(){
        return this.canvas;
    }

    private cloneInstruction(instr: PaintingInstruction): PaintingInstruction {

        return {
            ...instr,
            buffer: instr.buffer,
            points: Array.isArray(instr.points)
                ? instr.points.map(p => ({...p}))
                : {...instr.points}
        } as PaintingInstruction;
    }

    private translatePoint(point: Point, section: CanvasSection): Point {
    return {
        x: point.x + section.x,
        y: point.y + section.y,
        z: point.z
    };
}

    public getFontInstance(name: string, path: string){

        let cached = this.fontCache.find(f => f.name() == name && f.path() == path);

        if(!cached){
            cached = new matrix.Font(name, path);
            this.fontCache.push(cached);
        }

        return cached;
    }

    public getImageInstance(path: string): Promise<Image>{

        return new Promise((resolve,reject)=>{

            let cached = this.imageCache.find(i=>i.path == path);

            if(cached){
                resolve(cached);
                return;
            }

            Jimp.read(path).then((img: Jimp)=>{

                const width = img.getWidth();
                const height = img.getHeight();

                const content:number[][] = Array(width);

                for(let x=0;x<width;x++){

                    content[x] = Array(height);

                    for(let y=0;y<height;y++){
                        content[x][y] = img.getPixelColor(x,y) >>> 0;
                    }
                }

                const image:Image = {
                    path,
                    width,
                    height,
                    content
                };

                this.imageCache.push(image);
                resolve(image);

            }).catch(reject);

        });

    }

    private getPaintingInstructionSize(instr: PaintingInstruction){

        switch(instr.drawMode){

            case DrawMode.TEXT:

                const text = instr.text as string;

                const font = this.getFontInstance(
                    (instr.drawModeOptions as DrawModeOption).font!,
                    (instr.drawModeOptions as DrawModeOption).fontPath!
                );

                return {
                    width: font.stringWidth(text),
                    height: font.height()
                };

            case DrawMode.IMAGE:

                return {
                    width: instr.width!,
                    height: instr.height!
                };

            default:

                return {
                    width: instr.width!,
                    height: instr.height!
                };

        }

    }

    private applyEffects(instr: PaintingInstruction, section: CanvasSection){

        const newInstr = instr;
        const dims = this.getPaintingInstructionSize(instr);

        let dx = 0;
        let dy = 0;
        let draw = true;

        instr.drawModeOptions?.effects?.forEach(effect=>{

            switch(effect.effectType){

                case EffectType.SCROLLLEFT:

                    dx = section.width - ((this.duration / effect.effectOptions.rate) % (dims.width + section.width));
                    break;

                case EffectType.SCROLLRIGHT:

                    dx = ((this.duration / effect.effectOptions.rate) % (dims.width + section.width)) - dims.width;
                    break;

                case EffectType.SCROLLUP:

                    dy = section.height + ((this.duration / effect.effectOptions.rate) % (dims.height + section.height));
                    break;

                case EffectType.SCROLLDOWN:

                    dy = ((this.duration / effect.effectOptions.rate) % (dims.height + section.height)) - dims.height;
                    break;

                case EffectType.BLINK:

                    if(Math.floor(this.duration / effect.effectOptions.rate) % 2 == 1)
                        draw=false;
                    break;

                case EffectType.PULSE:

                    const c = instr.color;

                    const r = ((c>>16)&255) * ((effect.effectOptions.rate-(this.duration%effect.effectOptions.rate))/effect.effectOptions.rate);
                    const g = ((c>>8)&255) * ((effect.effectOptions.rate-(this.duration%effect.effectOptions.rate))/effect.effectOptions.rate);
                    const b = (c&255) * ((effect.effectOptions.rate-(this.duration%effect.effectOptions.rate))/effect.effectOptions.rate);

                    newInstr.color = (r<<16)|(g<<8)|b;

                    break;

            }

        });

        if(Array.isArray(newInstr.points)){

            newInstr.points.forEach(p=>{
                p.x += dx;
                p.y += dy;
            });

        } else {

            newInstr.points.x += dx;
            newInstr.points.y += dy;

        }

        return draw ? newInstr : null;

    }

    public paint(){

        this.tick();
        this.matrix.clear();

        const promises:Promise<any>[] = [];

        this.canvas.getCanvasSections()
        .sort((a,b)=>a.z-b.z)
        .forEach(section=>{

            this.matrix.fgColor(0x000000);
            this.matrix.fill(section.x,section.y,section.x+section.width-1,section.y+section.height-1);

            section.get().representation
            .sort((a,b)=>a.layer-b.layer)
            .forEach(instr=>{

                const clone = this.cloneInstruction(instr);

                if(!this.paintingInstructionCache[clone.id]){
                    this.paintingInstructionCache[clone.id] = clone;
                }

                const effected = this.applyEffects(clone,section);
                if(!effected) return;

                const renderer = this.renderers[effected.drawMode];

                if(renderer){

                    const p = renderer(effected,section);

                    if(p instanceof Promise)
                        promises.push(p);

                }

            });

        });

        Promise.all(promises).then(()=>{
            this.matrix.sync();
        });

    }

    private renderLine(instr:PaintingInstruction,section:CanvasSection){

        const pts = instr.points as Point[];

        const p0 = this.translatePoint(pts[0],section);
        const p1 = this.translatePoint(pts[1],section);

        this.matrix.fgColor(instr.color);
        this.matrix.drawLine(p0.x,p0.y,p1.x,p1.y);

    }

    private renderRectangle(instr:PaintingInstruction,section:CanvasSection){

        const p = this.translatePoint(instr.points as Point,section);

        this.matrix.fgColor(instr.color);

        if(instr.drawModeOptions?.fill)
            this.matrix.drawFilledRect(p.x,p.y,instr.width!,instr.height!);
        else
            this.matrix.drawRect(p.x,p.y,instr.width!,instr.height!);

    }

    private renderCircle(instr:PaintingInstruction,section:CanvasSection){

        const p = this.translatePoint(instr.points as Point,section);

        const r = instr.width!/2;

        this.matrix.fgColor(instr.color);

        if(instr.drawModeOptions?.fill)
            this.matrix.drawFilledCircle(p.x,p.y,r);
        else
            this.matrix.drawCircle(p.x,p.y,r);

    }

    private renderPolygon(instr:PaintingInstruction,section:CanvasSection){

        const coords:number[]=[];

        (instr.points as Point[]).forEach(p=>{

            const t = this.translatePoint(p,section);

            coords.push(t.x);
            coords.push(t.y);

        });

        this.matrix.fgColor(instr.color);

        if(instr.drawModeOptions?.fill)
            this.matrix.drawFilledPolygon(coords);
        else
            this.matrix.drawPolygon(coords);

    }

    private renderPixel(instr:PaintingInstruction,section:CanvasSection){

        this.matrix.fgColor(instr.color);

        (instr.points as Point[]).forEach(p=>{

            const t = this.translatePoint(p,section);

            this.matrix.setPixel(t.x,t.y);

        });

    }

    private renderText(instr:PaintingInstruction,section:CanvasSection){

        const text = instr.text!;
        const p = this.translatePoint(instr.points as Point,section);

        const font = this.getFontInstance(
            (instr.drawModeOptions as DrawModeOption).font!,
            (instr.drawModeOptions as DrawModeOption).fontPath!
        );

        this.matrix.font(font);
        this.matrix.fgColor(instr.color);

        let x = p.x;

        for(let c=0;c<text.length;c++){

            const ch = text.charAt(c);

            this.matrix.drawText(ch,x,p.y);

            x += font.stringWidth(ch);

        }

    }

    private async renderImage(instr:PaintingInstruction,section:CanvasSection){

        const img = await this.getImageInstance(instr.imagePath!);

        const p = this.translatePoint(instr.points as Point,section);

        for(let y=0;y<img.height;y++){

            for(let x=0;x<img.width;x++){

                const color = img.content[x][y];

                if((color & 0x000000FF)!=0){

                    this.matrix.fgColor(color>>>8);
                    this.matrix.setPixel(p.x+x,p.y+y);

                }

            }

        }

    }

    private renderBuffer(instr:PaintingInstruction,section:CanvasSection){

        const p = this.translatePoint(instr.points as Point,section);

        const src = instr.buffer!;
        const width = instr.width!;
        const height = instr.height!;

        const matrixWidth = this.matrix.width();
        const matrixHeight = this.matrix.height();

        const dest = Buffer.alloc(matrixWidth * matrixHeight * 3);

        for(let y=0;y<height;y++){
            for(let x=0;x<width;x++){

                const srcIndex = (y*width+x)*3;

                const dx = p.x + x;
                const dy = p.y + y;

                if(dx<0||dx>=matrixWidth||dy<0||dy>=matrixHeight) continue;

                const destIndex = (dy*matrixWidth+dx)*3;

                dest[destIndex] = src[srcIndex];
                dest[destIndex+1] = src[srcIndex+1];
                dest[destIndex+2] = src[srcIndex+2];

            }
        }

        this.matrix.drawBuffer(dest,matrixWidth,matrixHeight);

    }

}