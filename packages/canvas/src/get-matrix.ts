import { LedMatrix, GpioMapping, LedMatrixUtils, PixelMapperType, RuntimeFlag } from "rpi-led-matrix"

export const getMatrix = () => {
    return new LedMatrix({
		...LedMatrix.defaultMatrixOptions(),
		rows: 32,
		cols: 64,
		chainLength: 2,
		hardwareMapping: GpioMapping.AdafruitHat,
		pixelMapperConfig: LedMatrixUtils.encodeMappers({
			type: PixelMapperType.U,
		}),
        showRefreshRate: true,
	}, {
		...LedMatrix.defaultRuntimeOptions(),
        // @ts-expect-error
		gpioSlowdown: 7,
		dropPrivileges: RuntimeFlag.On,
	})
}