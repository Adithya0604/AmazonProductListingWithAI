import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function AiServiceForAmazonProduct(originalData) {
  const prompt = `
You are an expert Amazon product listing optimizer. Your task is to create an enhanced, SEO-optimized product listing based on the provided data.

ORIGINAL PRODUCT DATA:
${JSON.stringify(originalData, null, 2)}

CRITICAL REQUIREMENTS - ALL FIELDS MUST BE FILLED:

1. **title**: Create a keyword-rich, compelling title (50-200 characters)
   - Include brand, product type, key features
   - Make it search-friendly and readable
   - If original title is missing, create one based on available features/bullet points

2. **Description**: Write a persuasive, detailed description (150-500 words)
   - MUST be present and substantial (never empty)
   - If original has no description, create one from features/bullet points
   - Highlight benefits, use cases, and value proposition
   - Be persuasive but compliant with Amazon policies
   - Use natural language, avoid excessive capitalization

3. **bullet_points**: Provide 5-7 clear, benefit-focused bullet points
   - Each point should be 1-2 sentences
   - Start with key benefit or feature
   - Be specific and informative
   - If original points are weak, enhance them significantly

4. **features**: A concise summary of key features (100-200 words)
   - Highlight technical specs and unique selling points
   - Make it informative and scannable

5. **price**: Keep EXACTLY as provided in original data (do not modify)

6. **keywords**: Provide 5-10 relevant SEO keywords/phrases
   - Focus on search terms customers would use
   - Include product category, use cases, and attributes
   - Avoid repetition of words already in title

IMPORTANT RULES:
- NEVER return empty strings for title, Description, features, or bullet_points
- If original data is minimal, be creative and generate compelling content based on what's available
- Maintain factual accuracy - don't invent specifications
- All content must be Amazon-compliant (no promotional language like "best", "cheapest", etc.)
- Return ONLY a valid JSON object, no markdown or explanations

RESPONSE FORMAT (JSON only):
{
  "title": "Enhanced product title here",
  "Description": "Detailed persuasive description here (MUST be substantial)",
  "features": "Key features summary here",
  "bullet_points": [
    "Benefit-focused bullet point 1",
    "Benefit-focused bullet point 2",
    "Benefit-focused bullet point 3",
    "Benefit-focused bullet point 4",
    "Benefit-focused bullet point 5"
  ],
  "price": "${originalData.price}",
  "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"]
}
`;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
    const result = await model.generateContent(prompt);
    let assistantReply = result.response.text().trim();

    // Remove markdown code blocks if present
    assistantReply = assistantReply.replace(/```json\n?/g, "").replace(/```\n?/g, "");
    
    // Find JSON object
    let jsonStart = assistantReply.indexOf("{");
    let jsonEnd = assistantReply.lastIndexOf("}");
    
    if (jsonStart === -1 || jsonEnd === -1) {
      throw new Error("Valid JSON object not found in AI response");
    }
    
    const jsonStr = assistantReply.slice(jsonStart, jsonEnd + 1);
    const parsedData = JSON.parse(jsonStr);

    // Validate and ensure all required fields are present and non-empty
    const validated = {
      title: parsedData.title?.trim() || "Product Title Not Available",
      Description: parsedData.Description?.trim() || parsedData.description?.trim() || 
                   "This product offers quality and value. Please refer to the features and specifications for more details.",
      features: parsedData.features?.trim() || "Features information not available",
      bullet_points: Array.isArray(parsedData.bullet_points) && parsedData.bullet_points.length > 0
        ? parsedData.bullet_points.filter(point => point?.trim())
        : ["Quality product", "Great value", "Reliable performance"],
      price: originalData.price || parsedData.price || "",
      keywords: Array.isArray(parsedData.keywords) && parsedData.keywords.length > 0
        ? parsedData.keywords.filter(kw => kw?.trim()).slice(0, 10)
        : ["product", "quality", "value"],
    };

    // Final check: ensure Description is substantial
    if (validated.Description.length < 50) {
      validated.Description = `This product offers excellent quality and value. ${validated.features} Check out the key features and specifications above for complete details.`;
    }

    return validated;
  } catch (error) {
    console.error("Gemini AI error:", error.message);
    
    // Return fallback structure if AI fails
    return {
      title: originalData.title || "Product Information",
      Description: originalData.features || originalData.bullet_points?.join(". ") || 
                   "Product details are being processed. Please check back soon.",
      features: originalData.features || "Features information available soon",
      bullet_points: originalData.bullet_points?.length > 0 
        ? originalData.bullet_points 
        : ["Quality product", "Customer satisfaction guaranteed"],
      price: originalData.price || "",
      keywords: ["product", "amazon", "quality"],
    };
  }
}