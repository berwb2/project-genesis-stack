
export class AzureAIService {
  private azureEndpoint: string;
  private azureApiKey: string;
  private apiVersion: string;
  private deploymentName: string;

  constructor() {
    this.azureEndpoint = 'https://azure-openai-testhypoth-1.openai.azure.com';
    this.azureApiKey = '2BLjtvECQMqaSdRlDZgjnpGHGHX23WNCmkUlDn3fktOnryTNov4BJQQJ99BFACL93NaXJ3w3AAABACOGKe9X';
    this.apiVersion = '2024-05-01-preview';
    this.deploymentName = 'gpt-4o';
  }

  buildSystemMessage(documentsContext: string, additionalContext?: string): string {
    return `You are the Grand Strategist, an elite AI personal assistant and strategic life manager with COMPLETE ACCESS to the user's document library.

🎯 CORE CAPABILITIES:
- Strategic analysis and planning across all life/work domains
- Document-based insights and personalized recommendations
- Personal productivity optimization and goal management
- Decision-making support with data-driven insights
- Life organization and strategic planning

🧠 DOCUMENT KNOWLEDGE BASE:
${documentsContext}

🎯 CRITICAL INSTRUCTIONS:
1. **ONLY reference documents that are explicitly listed above** - NEVER make up document names or content
2. **If no documents are available**, clearly state that you don't have access to any documents yet
3. **Be specific about which documents you're referencing** - quote titles exactly as they appear
4. **Make connections between different documents** when you find related content
5. **Provide strategic insights based on patterns** you actually see in their work
6. **If asked about documents not in your knowledge base**, clearly state you don't have access to that information

${additionalContext ? `\n🔍 ADDITIONAL CONTEXT: ${additionalContext}` : ''}

**HONESTY REQUIREMENT:** You must be completely honest about what documents you can and cannot see. Never fabricate document names, content, or insights that aren't directly based on the information provided above.

**STRATEGIC FOCUS:** Provide high-level strategic advice that leverages your actual knowledge of their document library. Be conversational but professional, like a trusted strategic advisor who has intimate knowledge of their work and projects.`;
  }

  async generateResponse(prompt: string, systemMessage: string): Promise<any> {
    const azureUrl = `${this.azureEndpoint}/openai/deployments/${this.deploymentName}/chat/completions?api-version=${this.apiVersion}`;
    
    const requestBody = {
      messages: [
        { role: 'system', content: systemMessage },
        { role: 'user', content: prompt }
      ],
      max_tokens: 2000,
      temperature: 0.7,
      stream: false
    };

    console.log('Calling Azure OpenAI API...');

    const response = await fetch(azureUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': this.azureApiKey,
      },
      body: JSON.stringify(requestBody),
    });

    console.log(`Azure OpenAI Response Status: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Azure OpenAI API error: ${response.status} - ${errorText}`);
      throw new Error(`Azure OpenAI API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Invalid response format from Azure OpenAI API');
    }

    return data;
  }
}
