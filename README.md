# Airtribe — LLM-Powered File System Assistant

A minimal Node.js project that exposes file-system tools to an LLM (OpenAI) via a tools registry. The assistant can read files (PDF/DOCX/TXT), list directory contents, write/append to files, and search within files. It demonstrates wiring tools into chat-based tool-calling via `llm_file_assistant.js`.

**Quick Summary**
- **Language:** Node.js (CommonJS)
- **Main files:** `index.js`, `llm_file_assistant.js`, `fs_tools.js`, `tool_registery.js`
- **Dependencies:** `dotenv`, `mammoth`, `pdf-parse`, `openai`

**Requirements**
- Node.js 16+ (or compatible)
- An OpenAI API key

**Environment**

```bash
cp .env.example .env
```

OPENAI_API_KEY=<YOUR_OPENAI_API_KEY>
OPENAI_MODEL=<OPTIONAL_CUSTOM_MODEL>

**Install**

```bash
npm install
```

**Run (example)**

```bash
node index.js
```

`index.js` runs a small set of example prompts against the assistant by calling `run_assistant` from `llm_file_assistant.js`.

**Project structure**
- `index.js` — example runner that demonstrates prompts to the assistant.
- `llm_file_assistant.js` — core loop that sends messages to OpenAI, receives tool call responses, and dispatches calls to local tools from `fs_tools.js` using the tool schema in `tool_registery.js`.
- `fs_tools.js` — implementations of filesystem helper functions (exposed to the assistant):
  - `read_file({ filepath })` — supports `.pdf`, `.docx`, and `.txt`. Uses `pdf-parse` and `mammoth`. Returns a JSON-stringified object with `success`, `content`, and `metadata`.
  - `list_files({ directory, extension = null })` — lists files in a directory; optional extension filter.
  - `check_file(filePath)` — ensures the target file/directory exists; creates directories as needed.
  - `write_file({ filepath, data })` — ensures the target exists then appends `data` to the file using `fs.appendFile` and returns a JSON-stringified result.
  - `search_in_file({ filepath, keyword })` — searches file content for `keyword` and returns matching lines and counts in a JSON-stringified response.

- `tool_registery.js` — registers tool schemas used when calling the model (function names, descriptions, and parameter schemas). These are passed to the OpenAI SDK as `tools` so the model can choose tool calls.

**How the assistant loop works**
1. `llm_file_assistant.run_assistant({ userPrompt, systemPrompt?, verbose? })` builds a system+user message array.
2. It calls the OpenAI chat completions endpoint with `tools_registry` and expects the model to return tool call instructions.
3. For each tool call returned by the model, the assistant dispatches to the corresponding function in `fs_tools.js`, collects the tool result, and sends it back into the conversation as a `tool` role message.
4. The loop continues until the model returns a final textual assistant response (no more tool calls).

**Notes & Behavior Details**
- `read_file` returns full file text for supported types. For PDFs it relies on `pdf-parse`; for `.docx` it uses `mammoth.extractRawText`.
- `write_file` currently uses `fs.appendFile` after ensuring directories exist. That means data will be appended if the file exists. Otherwise it creates a directory with the provided path and then write the content ot it.
- All tool functions return JSON-stringified responses (the assistant code expects stringified tool outputs and passes them back to the LLM loop).

**Environment variables**
- `OPENAI_API_KEY` — required for OpenAI SDK calls.
- `OPENAI_MODEL` — optional; defaults to `gpt-4o` in `llm_file_assistant.js` if not set.

**Author & License**
- Author: Adarsh Shukla
- License: ISC (see `package.json`)

**Extending**
- Add more file-format parsers or support streaming large files.
- Add options to `write_file` to control overwrite vs append and to set encoding or atomic writes.
- Improve `search_in_file` to return context windows or regex options.
- Add memory for chat history.

