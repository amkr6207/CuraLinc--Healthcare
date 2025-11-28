import OpenAI from 'openai';

class AIService {
    constructor() {
        if (!process.env.OPENAI_API_KEY) {
            console.warn('⚠️  OpenAI API key not configured - AI features will be disabled');
            this.openai = null;
        } else {
            this.openai = new OpenAI({
                apiKey: process.env.OPENAI_API_KEY
            });
        }
    }

    // Extract medical conditions from natural language
    async extractConditions(text) {
        if (!this.openai) {
            return [text]; // Return input as-is if AI not available
        }
        try {
            const response = await this.openai.chat.completions.create({
                model: 'gpt-3.5-turbo',
                messages: [{
                    role: 'system',
                    content: 'You are a medical NLP assistant. Extract medical conditions, diseases, and symptoms from the user input. Return only a JSON array of conditions.'
                }, {
                    role: 'user',
                    content: text
                }],
                temperature: 0.3
            });

            const content = response.choices[0].message.content;
            try {
                return JSON.parse(content);
            } catch {
                // Fallback: split by common delimiters
                return content.split(/[,;]/).map(c => c.trim()).filter(Boolean);
            }
        } catch (error) {
            console.error('Condition extraction error:', error.message);
            // Fallback: return the input as a single condition
            return [text];
        }
    }

    // Generate AI summary for clinical trials or publications
    async generateSummary(content, type = 'trial') {
        if (!this.openai) {
            return null; // Return null if AI not available
        }
        try {
            const systemPrompt = type === 'trial'
                ? 'You are a medical expert. Summarize this clinical trial in simple, patient-friendly language (2-3 sentences).'
                : 'You are a medical expert. Summarize this research publication in simple language (2-3 sentences).';

            const response = await this.openai.chat.completions.create({
                model: 'gpt-3.5-turbo',
                messages: [{
                    role: 'system',
                    content: systemPrompt
                }, {
                    role: 'user',
                    content: content
                }],
                temperature: 0.5,
                max_tokens: 150
            });

            return response.choices[0].message.content;
        } catch (error) {
            console.error('Summary generation error:', error.message);
            return null;
        }
    }

    // Get personalized recommendations based on user profile
    async getRecommendations(userProfile, items, type = 'trial') {
        try {
            const { conditions, researchInterests, specialties } = userProfile;
            const keywords = [...(conditions || []), ...(researchInterests || []), ...(specialties || [])];

            if (keywords.length === 0) {
                return items.slice(0, 10); // Return first 10 if no keywords
            }

            // Simple keyword matching (can be enhanced with embeddings)
            const scored = items.map(item => {
                let score = 0;
                const searchText = JSON.stringify(item).toLowerCase();

                keywords.forEach(keyword => {
                    if (searchText.includes(keyword.toLowerCase())) {
                        score += 1;
                    }
                });

                return { ...item, score };
            });

            // Sort by score and return top results
            return scored
                .sort((a, b) => b.score - a.score)
                .slice(0, 10);
        } catch (error) {
            console.error('Recommendation error:', error.message);
            return items.slice(0, 10);
        }
    }
}

export default new AIService();
