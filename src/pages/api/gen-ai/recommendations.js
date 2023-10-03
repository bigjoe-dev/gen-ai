import { ChatGPTAPI } from "chatgpt"

export default async function handler(req, res) {

    const wines = "Cabernet Sauvignon, Merlot, Tempranillo, Chardonnay, Syrah, Garancha, Sauvignon Blanc"

    if (req.method === 'POST') {

        const api = new ChatGPTAPI({
            apiKey: process.env.OPENAI_API_KEY,
            completionParams: {
                model: 'gpt-4',
            }
        })
    
        const items = req.body.items;
        
        const gptRes = await api.sendMessage(`Write a JSON response in this format 
        
        {
            "suggestedWines": [
              {
                "reason": "White wines generally pair well with lighter dishes like pasta with pesto, offering a crisp and refreshing complement to the dish.",
                "title": "Pasta with Pesto",
                "CO2": "0.5k",
                "Explanation": "An average-sized dish of pasta with pesto has an estimated carbon footprint of 0.5 kg of CO2."
              },
            ],
        }
          

        Take this list of wines ${wines} and these items ${items} and suggest which wine would fit well, also explain the reason and how much CO2 is in the dish (including the wine)
        
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