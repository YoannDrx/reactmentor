import { createRequire } from "module";

const nodeRequire = createRequire(import.meta.url);
const webStreams =
  typeof process.getBuiltinModule === "function"
    ? process.getBuiltinModule("stream/web")
    : nodeRequire("stream/web");

if (
  typeof globalThis.ReadableStream === "undefined" &&
  webStreams?.ReadableStream
) {
  globalThis.ReadableStream = webStreams.ReadableStream;
}

if (
  typeof globalThis.WritableStream === "undefined" &&
  webStreams?.WritableStream
) {
  globalThis.WritableStream = webStreams.WritableStream;
}

if (
  typeof globalThis.TransformStream === "undefined" &&
  webStreams?.TransformStream
) {
  globalThis.TransformStream = webStreams.TransformStream;
}
