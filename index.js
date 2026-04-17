const tools = require('./fs_tools');

async function main() {
    try {
        // const data = await tools.readFile('./files/Keshav_Resume.pdf');
        // console.log('File content:', data);

        // const files = await tools.listFiles('./files');
        // console.log('Files in directory:', files);

        // const response = await tools.writeFile('./adarsh/output.txt', "Hello, this is a test.");
        // console.log(response);

        // const searchResult = await tools.searchInFile('./files/Keshav_Resume.docx', 'sc');
        // console.log('Search results:', searchResult);
    } catch (error) {
        console.error('Error:', error);
    }
}

main();