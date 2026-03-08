export const getPainterMatrix = async () => {
	const { RpiLedMatrix, Painter, DrawMode, CanvasSection } = require('rpi-led-matrix-painter');
    const { LedMatrix, GpioMapping, LedMatrixUtils, PixelMapperType } = RpiLedMatrix;

	const matrix = new Painter({
		...LedMatrix.defaultMatrixOptions(),
		rows: 32,
		cols: 64,
		chainLength: 2,
		hardwareMapping: GpioMapping.AdafruitHat,
		pixelMapperConfig: LedMatrixUtils.encodeMappers({
			type: PixelMapperType.U,
		})

	}, {
		...LedMatrix.defaultRuntimeOptions(),
		gpioSlowdown: 4,
		dropPrivileges: 0,
	});


	return {matrix, DrawMode, CanvasSection};
};