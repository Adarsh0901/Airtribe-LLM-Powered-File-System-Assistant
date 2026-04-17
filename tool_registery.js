const tools_registry = [
    {
        type: "function",
        function: {
            name: "read_file",
            description: "Read the content of a file and return structured data and metadata.",
            parameters: {
                type: "object",
                properties: {
                    filepath: {
                        type: "string",
                        description: "The path to the file to read. Allowed formats: PDF, DOCX, TXT.",
                    },
                },
                required: ["filepath"],
            },
        },
    },
    {
        type: "function",
        function: {
            name: "list_files",
            description: "List all files in a directory.",
            parameters: {
                type: "object",
                properties: {
                    directory: {
                        type: "string",
                        description: "The path to the directory to list files in.",
                    },
                    extension: {
                        type: "string",
                        description: "Optional file extension filter (e.g., '.pdf')",
                    },
                },
                required: ["directory"],
            },
        },
    },
    {
        type: "function",
        function: {
            name: "write_file",
            description: "Write data to a file, creating it if it doesn't exist.",
            parameters: {
                type: "object",
                properties: {
                    filepath: {
                        type: "string",
                        description: "The path to the file to write with extension.",
                    },
                    data: {
                        type: "string",
                        description: "The content to write to the file.",
                    },
                },
                required: ["filepath", "data"],
            },
        },
    },
    {
        type: "function",
        function: {
            name: "search_in_file",
            description: "Search for a keyword in a file and return matches with context.",
            parameters: {
                type: "object",
                properties: {
                    filepath: {
                        type: "string",
                        description: "The path to the file to search in.",
                    },
                    keyword: {
                        type: "string",
                        description: "The term to search for.",
                    },
                },
                required: ["filepath", "keyword"],
            },
        },
    }
];

module.exports = {
    tools_registry
};