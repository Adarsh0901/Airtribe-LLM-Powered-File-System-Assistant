const fs = require('fs').promises;
const path = require('path');
const {PDFParse} = require('pdf-parse');
const mammoth = require('mammoth');

/**
 * Reads resume files and returns structured content and metadata.
 * Allowed formats: PDF, DOCX, TXT
 * @param {string} filepath - Path to the file.
 * @returns {Promise<Object>} - An object containing success status, content, and metadata or error message.
 */
async function read_file({filepath}) {
    try {
        const extension = path.extname(filepath).toLowerCase();
        const fileBuffer = await fs.readFile(filepath);
        const stats = await fs.stat(filepath);

        let content = '';

        switch (extension) {
            case '.pdf':
                const pdfData = await new PDFParse({url:filepath});
                content = (await pdfData.getText()).text;
                break;

            case '.docx':
                const docxData = await mammoth.extractRawText({ buffer: fileBuffer });
                content = docxData.value;
                break;

            case '.txt':
                content = fileBuffer.toString('utf8');
                break;

            default:
                throw new Error(`Unsupported file extension: ${extension}`);
        }

        return JSON.stringify({
            success: true,
            content: content,
            metadata: {
                fileName: path.basename(filepath),
                fileSize: stats.size,
                extension: extension,
                lastModified: stats.mtime
            }
        });

    } catch (error) {
        return JSON.stringify({
            success: false,
            content: null,
            error: error.message
        });
    }
}

/**
 * List all files in a directory
 * @param {string} directory - Path to the directory.
 * @param {string|null} extension - Optional file extension filter (e.g., '.pdf')
 * @returns {Promise<Object>}
 */
async function list_files({directory, extension = null}) {
    try {
        const files = await fs.readdir(directory);
        const filteredFiles = extension
            ? files.filter(file => path.extname(file).toLowerCase() === extension)
            : files;

        return JSON.stringify({
            success: true,
            files: filteredFiles
        });
    } catch (error) {
        return JSON.stringify({
            success: false,
            files: [],
            error: error.message
        });
    }
}

/**
 * Check if a file exists, if not create it along with necessary directories.
 * @param {string} filepath - Path to the file.
 */
async function check_file(filePath) {
  try {
    await fs.access(filePath, fs.constants.F_OK);
  } catch {
    const dir = path.dirname(filePath);
    await fs.mkdir(dir, { recursive: true });
  }
}

/**
 * Writes data to a file, creating it if it doesn't exist.
 * @param {string} filepath - Path to the file.
 * @param {string} data - The content to write to the file.
 * @returns {Promise<Object>}
 */
async function write_file({filepath, data}) {
    try {
        if(!filepath || !data) {
            throw new Error('Filepath and data are required');
        }

       await check_file(filepath)

        await fs.appendFile(filepath, data, 'utf8');
        return JSON.stringify({
            success: true,
            message: `Data written to ${filepath}`
        });
    } catch (error) {
        return JSON.stringify({
            success: false,
            error: error.message
        });
    }
}

/**
 * Searches for a keyword in a file and returns matches with context.
 * @param {string} filepath - Path to the file.
 * @param {string} keyword - The term to search for.
 * @returns {Object} - An object containing an array of matches or an error.
 */
async function search_in_file({filepath, keyword}) {
    try {
        // Read file content synchronously (use fs.readFile for async)
        const content = (await read_file({filepath})).content;
        const lines = content.split(/\r?\n/);
        const matches = [];

        // Case-insensitive regex
        const regex = new RegExp(keyword, 'gi');

        lines.forEach((line, index) => {
            if (regex.test(line)) {
                matches.push({
                    lineNumber: index + 1,
                    text: line.trim()
                });
            }
        });

        return JSON.stringify({
            keyword: keyword,
            count: matches.length,
            results: matches
        });

    } catch (error) {
        return JSON.stringify({
            error: `Could not read file: ${error.message}`
        });
    }
}

module.exports = {
    read_file: read_file,
    list_files: list_files,
    write_file: write_file,
    search_in_file: search_in_file
};