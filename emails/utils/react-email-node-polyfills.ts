import { createRequire } from "module";

type WebStreamsModule = {
  ReadableStream?: unknown;
  WritableStream?: unknown;
  TransformStream?: unknown;
};

type ProcessWithBuiltinModule = NodeJS.Process & {
  getBuiltinModule?: (id: string) => WebStreamsModule | undefined;
};

const processWithBuiltinModule = process as ProcessWithBuiltinModule;
const nodeRequire = createRequire(__filename);
const webStreams =
  typeof processWithBuiltinModule.getBuiltinModule === "function"
    ? processWithBuiltinModule.getBuiltinModule("stream/web")
    : (nodeRequire("stream/web") as WebStreamsModule);

if (
  typeof globalThis.ReadableStream === "undefined" &&
  webStreams?.ReadableStream
) {
  globalThis.ReadableStream =
    webStreams.ReadableStream as typeof globalThis.ReadableStream;
}

if (
  typeof globalThis.WritableStream === "undefined" &&
  webStreams?.WritableStream
) {
  globalThis.WritableStream =
    webStreams.WritableStream as typeof globalThis.WritableStream;
}

if (
  typeof globalThis.TransformStream === "undefined" &&
  webStreams?.TransformStream
) {
  globalThis.TransformStream =
    webStreams.TransformStream as typeof globalThis.TransformStream;
}
