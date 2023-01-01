import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
    const { priceMin, priceMax, gender, age, hobbies } = req.body
    const prompt = generatePrompt(priceMin, priceMax, gender, age, hobbies)
    if (!configuration.apiKey) {
        res.status(500).json({
            error: {
                message: "OpenAI API key not configured, please follow instructions in README.md",
            }
        });
        return;
    }
    const completion = await openai.createCompletion({
        model: 'text-davinci-003',
        prompt,
        temperature: 0.9,
        max_tokens: 4000
    })
    res.status(200).json({ result: completion.data.choices[0].text })
}

function generatePrompt(priceMin, priceMax, gender, age, hobbies) {
    return `suggest 3 Christmas gift ideas between ${priceMin}$ and ${priceMax}$ for a ${age} 
    years old ${gender} that is into ${hobbies}.`;
}
