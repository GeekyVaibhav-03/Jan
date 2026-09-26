import { GoogleGenerativeAI } from '@google/generative-ai';
import '../config/env.js';

class AIService {
  constructor() {
    this.provider = process.env.AI_PROVIDER || 'gemini';

    // Initialize Gemini only if API key exists
    if (
      this.provider === 'gemini' &&
      process.env.GEMINI_API_KEY
    ) {
      try {
        this.genAI = new GoogleGenerativeAI(
          process.env.GEMINI_API_KEY
        );

        this.model =
          this.genAI.getGenerativeModel({
            model: 'gemini-3.5-flash-lite'
          });

        console.log('Gemini AI initialized');
      } catch (error) {
        console.log(
          'Gemini initialization failed, using fallback AI'
        );
      }
    } else {
      console.log(
        'No Gemini API key found, using fallback AI'
      );
    }
  }

  /**
   * Analyze complaint and extract intent, category, priority
   */
  async analyzeComplaint(
    complaintText,
    language = 'en'
  ) {
    try {
      const prompt = this.buildAnalysisPrompt(
        complaintText,
        language
      );

      // Use Gemini if available
      if (
        this.provider === 'gemini' &&
        this.model
      ) {
        return await this.analyzeWithGemini(prompt);
      }

      // Fallback response
      return this.getFallbackAnalysis(
        complaintText
      );
    } catch (error) {
      console.error(
        'AI Analysis Error:',
        error
      );

      return this.getFallbackAnalysis(
        complaintText
      );
    }
  }

  /**
   * Build AI Prompt
   */
  buildAnalysisPrompt(
    complaintText,
    language
  ) {
    const languageNote = {
      en: 'The complaint is in English.',
      hi: 'The complaint is in Hindi.',
      hinglish:
        'The complaint is in Hinglish.'
    }[language] || 'The complaint is in English.';

    return `
You are an expert government grievance classification system.

Analyze the following complaint and provide a JSON response.

Complaint:
"${complaintText}"

${languageNote}

Return ONLY JSON in this format:

{
  "intent": "",
  "category": "",
  "priority": "",
  "priorityReason": "",
  "keywords": [],
  "confidence": 75,
  "suggestedDepartment": "",
  "summary": ""
}

Rules:
- category should be one of:
  Water Supply
  Electricity
  Roads
  Waste Management
  Public Health
  General

- priority should be:
  High
  Medium
  Low

- return only JSON
`;
  }

  /**
   * Gemini AI Analysis
   */
  async analyzeWithGemini(prompt) {
    try {
      const result =
        await this.model.generateContent(
          prompt
        );

      const responseText =
        result.response.text();

      let cleanedResponse =
        responseText.trim();

      // Remove markdown if present
      if (
        cleanedResponse.startsWith(
          '```json'
        )
      ) {
        cleanedResponse =
          cleanedResponse
            .replace(/```json\n?/, '')
            .replace(/```\n?$/, '');
      }

      if (
        cleanedResponse.startsWith('```')
      ) {
        cleanedResponse =
          cleanedResponse
            .replace(/```\n?/, '')
            .replace(/```\n?$/, '');
      }

      const analysis = JSON.parse(
        cleanedResponse
      );

      return {
        success: true,
        data: {
          intent:
            analysis.intent ||
            'General Complaint',

          category:
            analysis.category ||
            'Public Services',

          priority:
            analysis.priority ||
            'Medium',

          priorityReason:
            analysis.priorityReason ||
            'Automatically assigned',

          keywords:
            analysis.keywords || [],

          confidence:
            analysis.confidence || 70,

          suggestedDepartment:
            analysis.suggestedDepartment ||
            'Public Services',

          summary:
            analysis.summary || '',

          rawResponse: analysis
        }
      };
    } catch (error) {
      console.error(
        'Gemini Parse Error:',
        error
      );

      return this.getFallbackAnalysis(
        prompt
      );
    }
  }

  /**
   * Fallback AI
   */
  getFallbackAnalysis(
    complaintText
  ) {
    let category =
      'General';

    let priority = 'Medium';

    const text =
      complaintText.toLowerCase();

    if (
      text.includes('water') ||
      text.includes('pani')
    ) {
      category =
        'Water Supply';
    }

    if (
      text.includes(
        'electricity'
      ) ||
      text.includes('bijli') ||
      text.includes('light')
    ) {
      category =
        'Electricity';
    }

    if (
      text.includes('road') ||
      text.includes('sadak')
    ) {
      category =
        'Roads';
    }

    if (
      text.includes(
        'hospital'
      ) ||
      text.includes('health')
    ) {
      category =
        'Public Health';
    }

    if (
      text.includes('urgent') ||
      text.includes(
        'emergency'
      )
    ) {
      priority = 'High';
    }

    return {
      success: true,
      data: {
        intent:
          'Citizen Complaint',

        category,

        priority,

        priorityReason:
          'Fallback AI assigned priority',

        keywords:
          complaintText
            .split(' ')
            .slice(0, 5),

        confidence: 70,

        suggestedDepartment:
          category,

        summary:
          complaintText.substring(
            0,
            120
          ),

        rawResponse: {}
      }
    };
  }

  /**
   * Translate complaint
   */
  async translateComplaint(
    text,
    targetLanguage
  ) {
    try {
      if (
        this.provider === 'gemini' &&
        this.model
      ) {
        const prompt = `
Translate this text to ${targetLanguage}.

Return only translated text.

Text:
"${text}"
`;

        const result =
          await this.model.generateContent(
            prompt
          );

        return result.response.text();
      }

      return text;
    } catch (error) {
      console.error(
        'Translation Error:',
        error
      );

      return text;
    }
  }

  /**
   * Suggested admin response
   */
  async generateSuggestedResponse(
    complaint
  ) {
    try {
      if (
        this.provider === 'gemini' &&
        this.model
      ) {
        const prompt = `
Generate a professional government response.

Complaint:
${complaint.description}

Department:
${complaint.department}
`;

        const result =
          await this.model.generateContent(
            prompt
          );

        return result.response.text();
      }

      return `
Your complaint has been received and forwarded to the ${complaint.department} department. Necessary action will be taken soon.
`;
    } catch (error) {
      console.error(
        'Response Generation Error:',
        error
      );

      return `
Your complaint has been received successfully.
`;
    }
  }
}

export default new AIService();