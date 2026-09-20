export class Logger {

    private static instance: Logger;

    private constructor() {
        // Private = nobody can do 'new Logger()' from outside!
    }

    static getInstance(): Logger {
        if (!Logger.instance) {
            Logger.instance = new Logger();
        }
        return Logger.instance;
    }

    info(message: string): void {
        const timestamp = new Date().toISOString().replace('T', ' ').split('.')[0];
        console.log(`[${timestamp}] [INFO]  ${message}`);
    }

    success(message: string): void {
        const timestamp = new Date().toISOString().replace('T', ' ').split('.')[0];
        console.log(`[${timestamp}] [PASS]  ✅ ${message}`);
    }

    error(message: string): void {
        const timestamp = new Date().toISOString().replace('T', ' ').split('.')[0];
        console.log(`[${timestamp}] [ERROR] ❌ ${message}`);
    }

    warn(message: string): void {
        const timestamp = new Date().toISOString().replace('T', ' ').split('.')[0];
        console.log(`[${timestamp}] [WARN]  ⚠️ ${message}`);
    }

    step(message: string): void {
        const timestamp = new Date().toISOString().replace('T', ' ').split('.')[0];
        console.log(`[${timestamp}] [STEP]  → ${message}`);
    }
}