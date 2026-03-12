export const delay = (ms: number, options: { verbose: boolean } = { verbose: true }) => {
    if (options.verbose) {
        console.log(`Delaying for ${(ms / 1000).toFixed(2)}s...`);
    }
    return new Promise(resolve => setTimeout(resolve, ms))
}
