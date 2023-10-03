import { ChatGPTAPI } from "chatgpt"

export default async function handler(req, res) {

    if (req.method === 'POST') {

        const api = new ChatGPTAPI({
            apiKey: process.env.OPENAI_API_KEY,
            completionParams: {
                model: 'gpt-4',
            }
        })
    
        const description = req.body.description;
        const ingredients = req.body.ingredients;
        
        const gptRes = await api.sendMessage(`Write a JSON response in this format 
        
        {
            Description:""
            IngredientsCO2:[
               itemName: ""
               CO2: "1.0 kg"
               Reason: ""
           ]
           TotalCO2: ""
        }

        Take this draft text: ${description} and these ${ingredients} and create a great text that can be written on a restaurant menu

        For every ingredient the average CO2 emission (in kg) should be given and the reason why this CO2 emission was given for the following ingredients: ${ingredients}

        Also the total CO2 emission should be given
        
        `)

        // Regular expression to match the JSON content within the ```json``` or ```JSON``` delimiters
        const regex = /```(?:json|JSON)\n([\s\S]+?)```/;

        // Use regex to extract the JSON content
        const match = regex.exec(gptRes.text);

        if (match) {
            const jsonContent = match[1]; // The extracted JSON content
            const parsedData = JSON.parse(jsonContent); // Parse the JSON string into an object
          
            // Return the parsed JSON data
            res.status(200).json(parsedData)
            
        } else {
            res.status(500).json({status: "Internal Server Error"});
        }

    } else {
        res.status(405).json({status: "Method Not Allowed"});
    }
}