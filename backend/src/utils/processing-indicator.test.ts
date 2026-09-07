import assert from "node:assert/strict";
import test from "node:test";

import { ProcessingIndicator } from "./processing-indicator";

test("uses readable stage logs outside an interactive terminal", () => {
    const messages: string[] = [];
    const indicator = new ProcessingIndicator("12345678-abcd", {
        interactive: false,
        log: message => messages.push(message)
    });

    indicator.start("Validating PDF");
    indicator.update("Extracting periods");
    indicator.succeed("Saved report");

    assert.match(messages[0], /START Validating PDF/);
    assert.match(messages[1], /STEP Extracting periods/);
    assert.match(messages[2], /DONE Saved report/);
    assert.match(messages[2], /document:12345678/);
});
