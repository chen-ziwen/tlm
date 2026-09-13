class PlatformError extends Error {
    constructor(message: string, readonly platform?: string) {
        super(message);
        this.name = "PlatformError";
    }
}

export { PlatformError };
