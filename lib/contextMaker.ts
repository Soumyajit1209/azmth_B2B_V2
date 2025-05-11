import { StringOutputParser } from '@langchain/core/output_parsers';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { ChatGroq } from '@langchain/groq';

// Initialize models
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const chat = new ChatGroq({
    temperature: 0,
    model: "llama-3.1-8b-instant",
    apiKey: GROQ_API_KEY
});

export async function companyContextMakingLLM(companyDetails: string) {
    /**
     * Process input through LLM and save the result in Firestore.
     * 
     * @param {string} companyDetails - Raw input fetched from company data.
     * @param {string} companyId - The document ID under which the result will be saved.
     * @param {object} companyManager - Object with an `updateCompany` method to save data.
     */
    const contextMaker = `
    **Objective:** Summarize the provided company document comprehensively, ensuring that all critical aspects—including brand identity, operations, sales strategies, organizational structure, and other key elements—are retained and presented in a well-organized format.  
    **Instructions:**  
    1. **Read and Analyze:** Carefully process the entire document to understand its structure and key themes. Identify sections related to company operations, branding, sales strategies, organizational hierarchy, financial models, and any other significant business-related content.  
    2. **Summarization Structure:** Provide a structured summary under the following headings:  
       - **Company Overview:** A brief introduction covering the company's mission, vision, and industry positioning.  
       - **Brand Identity:** Core values, branding elements, messaging, and unique selling points.  
       - **Products/Services:** A concise breakdown of offerings, their features, and target markets.  
       - **Sales and Marketing Strategies:** Sales models, marketing channels, customer acquisition strategies, and revenue streams.  
       - **Operational Structure:** Key departments, workflow, and internal processes.  
       - **Financial Insights (if available):** Revenue models, investment strategies, and key financial highlights.  
       - **Key Takeaways:** Major insights, business strengths, and any potential challenges mentioned in the document.  
    3. **Retention of Key Data:** Ensure that numerical data, statistics, names, and industry-specific terms are preserved for accuracy.  
    4. **Conciseness and Clarity:** Maintain brevity while ensuring completeness. Use bullet points or structured paragraphs for easy readability.  
    5. **Maintain Original Intent:** Keep the original tone and intent intact, avoiding misinterpretation of any statements.  
    6. **Avoid Redundancy:** If certain points are repeated in the document, condense them into a single, clear statement without losing critical information.  
    7. **Format Consistency:** Use consistent formatting with clear section headings to improve readability.  
    **Output Format Example:**  
    \`\`\`
    # Company Overview  
    (Summary of company background, mission, and vision)  
    # Brand Identity  
    (Summary of branding elements, core values, and messaging)  
    # Products/Services  
    (Detailed but concise list of offerings and target market)  
    # Sales and Marketing Strategies  
    (Overview of sales approach, marketing channels, and revenue generation methods)  
    # Operational Structure  
    (Description of key departments, roles, and workflow processes)  
    # Financial Insights  
    (Important financial details, if available)  
    # Key Takeaways  
    (Summary of major findings, business strengths, and challenges)  
    \`\`\`
    Ensure that the summary retains all crucial insights while eliminating unnecessary fluff. The goal is to extract and structure the essence of the company document in a way that is both informative and easy to navigate.  
    ---
    This prompt ensures the LLM processes the document with a high degree of precision, organizing it in a way that retains all key details while making it easier to consume. 🚀
    `;

    try {
        // Create the prompt
        const prompt = ChatPromptTemplate.fromMessages([
            { role: "system", content: contextMaker },
            { role: "human", content: companyDetails }
        ]);
        const outputParser = new StringOutputParser();
        const chain = prompt.pipe(chat).pipe(outputParser);
        
        const result = await chain.invoke({})
        return result;

    } catch (error) {
        console.error(`Error in company context generation: ${error}`);
        throw new Error(`Failed to generate company context: ${error}`);
    }
}