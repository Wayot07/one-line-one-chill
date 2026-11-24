import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const ENTRY =
  "The voicemail from my dead mother ended with her whispering not to answer when she calls again, because something has learned her voice.";

const OUTPUT_PATH = join("/output", "entry.txt");

function fail(message: string): never {
  console.error(`error: ${message}`);
  process.exit(1);
}

function validate(line: string): void {
  const chars = [...line].length;
  if (chars < 1 || chars > 200) {
    fail(`entry must be 1-200 characters, got ${chars}`);
  }
  if (line.trim().length === 0) {
    fail("entry must not be only whitespace");
  }
  if (line.includes("\n") || line.includes("\r")) {
    fail("entry must be a single line");
  }
  if (line !== line.trim()) {
    fail("entry must not have leading or trailing whitespace");
  }
  const terminators = line.match(/[.!?]/g) ?? [];
  if (terminators.length !== 1 || !line.endsWith(".")) {
    fail("entry must be exactly one sentence ending with a period");
  }
}

validate(ENTRY);

mkdirSync(dirname(OUTPUT_PATH), { recursive: true });
writeFileSync(OUTPUT_PATH, ENTRY, "utf8");

const written = readFileSync(OUTPUT_PATH, "utf8");
if (written !== ENTRY) {
  fail("post-write byte-identity check failed: file contents differ from entry");
}
const writtenBytes = Buffer.byteLength(written, "utf8");
if (Buffer.byteLength(ENTRY, "utf8") !== writtenBytes) {
  fail("post-write byte-length check failed");
}

console.log(`wrote ${OUTPUT_PATH}`);
console.log(`entry: ${ENTRY}`);
console.log(`characters: ${[...ENTRY].length}`);
console.log(`bytes: ${writtenBytes}`);
console.log(`single sentence: yes`);
