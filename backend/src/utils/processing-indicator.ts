const FRAMES = ["◐", "◓", "◑", "◒"];

export interface ProcessingIndicatorOptions {
    interactive?: boolean;
    write?: (message: string) => void;
    log?: (message: string) => void;
    setIntervalFn?: typeof setInterval;
    clearIntervalFn?: typeof clearInterval;
}

export class ProcessingIndicator {
    private readonly startedAt = Date.now();
    private readonly interactive: boolean;
    private readonly write: (message: string) => void;
    private readonly log: (message: string) => void;
    private readonly setIntervalFn: typeof setInterval;
    private readonly clearIntervalFn: typeof clearInterval;
    private timer: ReturnType<typeof setInterval> | undefined;
    private frame = 0;
    private stage = "Preparing document";

    constructor(
        private readonly requestId: string,
        options: ProcessingIndicatorOptions = {}
    ) {
        this.interactive = options.interactive ?? Boolean(process.stdout.isTTY);
        this.write = options.write ?? (message => process.stdout.write(message));
        this.log = options.log ?? (message => console.log(message));
        this.setIntervalFn = options.setIntervalFn ?? setInterval;
        this.clearIntervalFn = options.clearIntervalFn ?? clearInterval;
    }

    start(stage: string): void {
        this.stage = stage;

        if (!this.interactive) {
            this.log(this.formatLog("START", stage));
            return;
        }

        this.render();
        this.timer = this.setIntervalFn(() => {
            this.frame = (this.frame + 1) % FRAMES.length;
            this.render();
        }, 100);
        this.timer.unref?.();
    }

    update(stage: string): void {
        this.stage = stage;

        if (this.interactive) {
            this.render();
        } else {
            this.log(this.formatLog("STEP", stage));
        }
    }

    succeed(message: string): void {
        this.stop();
        const elapsed = this.elapsed();

        if (this.interactive) {
            this.write(`\r\u001b[2K\u001b[32m✓\u001b[0m ${message} \u001b[2m(${elapsed})\u001b[0m\n`);
        } else {
            this.log(this.formatLog("DONE", `${message} (${elapsed})`));
        }
    }

    fail(message: string): void {
        this.stop();
        const elapsed = this.elapsed();

        if (this.interactive) {
            this.write(`\r\u001b[2K\u001b[31m×\u001b[0m ${message} \u001b[2m(${elapsed})\u001b[0m\n`);
        } else {
            this.log(this.formatLog("FAIL", `${message} (${elapsed})`));
        }
    }

    private render(): void {
        this.write(
            `\r\u001b[2K\u001b[36m${FRAMES[this.frame]}\u001b[0m ${this.stage} \u001b[2mrequest=${this.shortId()}\u001b[0m`
        );
    }

    private stop(): void {
        if (this.timer) {
            this.clearIntervalFn(this.timer);
            this.timer = undefined;
        }
    }

    private elapsed(): string {
        return `${((Date.now() - this.startedAt) / 1000).toFixed(1)}s`;
    }

    private shortId(): string {
        return this.requestId.slice(0, 8);
    }

    private formatLog(event: string, message: string): string {
        return `[document:${this.shortId()}] ${event} ${message}`;
    }
}
