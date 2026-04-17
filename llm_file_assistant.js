require("dotenv/config");
const tools = require('./fs_tools');
const OpenAI = require("openai");
const { tools_registry } = require('./tool_registery');

const client = new OpenAI();

async function run_assistant({ systemPrompt = "You are a helpful assistant that can perform file system operations using the provided tools.", userPrompt, verbose = false }) {
    try {
        let messages = [
            {
                "role": "system",
                "content": systemPrompt
            },
            {
                "role": "user",
                "content": userPrompt
            }
        ]

        let keep_going = true;

        while (keep_going) {
            const response = await client.chat.completions.create({
                "model": process.env.OPENAI_MODEL || "gpt-4o",
                "tools": tools_registry,
                "messages": messages,
                "tool_choice": "auto"
            });

            const assistantMessage = response.choices[0].message;

            if (assistantMessage.tool_calls) {
                messages.push(assistantMessage);

                for (const toolCall of assistantMessage.tool_calls) {
                    const functionName = toolCall.function.name;
                    const functionArgs = JSON.parse(toolCall.function.arguments);

                    if (verbose) {
                        console.log(`Tool called: ${functionName} with arguments: ${JSON.stringify(functionArgs)}`);
                    }

                    if (functionName in tools) {
                        const toolData = await tools[functionName](functionArgs);

                        messages.push({
                            "role": "tool",
                            "tool_call_id": toolCall.id,
                            "name": functionName,
                            "content": toolData,
                        });
                    }else {
                        messages.push({
                            "role": "tool",
                            "tool_call_id": toolCall.id,
                            "name": functionName,
                            "content": JSON.stringify({
                                success: false,
                                content: null,
                                error: `Tool ${functionName} not found`
                            }),
                        });
                    }

                }
            } else {
                keep_going = false;
                console.log(assistantMessage.content);
            }
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

module.exports = {
    run_assistant
};