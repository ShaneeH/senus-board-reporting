import assert from "node:assert/strict";
import { AddressInfo } from "node:net";
import test from "node:test";

import app from "./app";

test("serves health responses with security headers and request IDs", async () => {
    const server = app.listen(0);

    try {
        await new Promise<void>(resolve => server.once("listening", resolve));
        const port = (server.address() as AddressInfo).port;
        const response = await fetch(`http://127.0.0.1:${port}/api/health`);

        assert.equal(response.status, 200);
        assert.equal(response.headers.get("x-powered-by"), null);
        assert.equal(response.headers.get("x-content-type-options"), "nosniff");
        assert.equal(response.headers.get("x-frame-options"), "DENY");
        assert.match(response.headers.get("x-request-id") ?? "", /^[A-Za-z0-9-]+$/);
    } finally {
        await new Promise<void>((resolve, reject) => {
            server.close(error => error ? reject(error) : resolve());
        });
    }
});

test("returns safe errors for unknown routes and invalid JSON", async () => {
    const server = app.listen(0);

    try {
        await new Promise<void>(resolve => server.once("listening", resolve));
        const port = (server.address() as AddressInfo).port;

        const missing = await fetch(`http://127.0.0.1:${port}/api/missing`);
        assert.equal(missing.status, 404);
        assert.equal((await missing.json() as { error: string }).error, "Route not found.");

        const malformed = await fetch(`http://127.0.0.1:${port}/api/openai/status`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: "{broken"
        });
        assert.equal(malformed.status, 400);
        assert.equal(
            (await malformed.json() as { error: string }).error,
            "The request body contains invalid JSON."
        );
    } finally {
        await new Promise<void>((resolve, reject) => {
            server.close(error => error ? reject(error) : resolve());
        });
    }
});
