require("dotenv/config");
const { run_assistant } = require('./llm_file_assistant');

async function main() {
    try {
        let promts = [
            "Read all resumes in the resumes folder.",
            "Find resumes mentioning Python experience.",
            "Search for the keyword 'JavaScript' in Adarsh_Shukla_Resume.pdf and return the matching lines.",
            "Create a summary file for Adarsh_Shukla_Resume.pdf in resumes directory."
        ];
        
        for (const prompt of promts) {
            console.log(`\nUser Prompt: ${prompt}`);
            const response = await run_assistant({
                userPrompt: prompt,
                verbose: true
            });
            console.log(`Assistant Response: ${response}`);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

main();