import { GoogleGenAI, Type, Schema } from "@google/genai";
import { FeedbackAnalysis } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    summary: {
      type: Type.STRING,
      description: "客户反馈的简明摘要。",
    },
    sentiment: {
      type: Type.STRING,
      enum: ["正面", "中立", "负面", "混合"],
      description: "反馈的整体情绪基调。",
    },
    key_requests: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "客户提出的具体、可执行的修改要求列表。",
    },
    ambiguities: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "模糊的术语（如'大气'、'更现代'）或不明确的指令，需要进一步确认。",
    },
    suggested_questions: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "设计师应该向客户提出的专业问题，以以此澄清上述模糊点。",
    },
    next_steps_suggestion: {
      type: Type.STRING,
      description: "基于此反馈，对当前设计阶段的下一步战略建议。",
    }
  },
  required: ["summary", "sentiment", "key_requests", "ambiguities", "suggested_questions", "next_steps_suggestion"],
};

export const analyzeFeedback = async (text: string, currentPhase: string): Promise<FeedbackAnalysis> => {
  try {
    const prompt = `
      你是一位资深的工业设计项目经理。
      你的目标是在"${currentPhase}"阶段帮助设计师消化和理解客户的反馈意见。
      
      请分析以下的客户反馈文本/会议记录。
      识别出具体的修改请求，以及那些模糊、主观且容易引起混淆的评论。
      建议一些具体的问题，以便设计师向客户寻求澄清。
      
      反馈内容:
      "${text}"
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        temperature: 0.3, // 保持分析的客观性
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as FeedbackAnalysis;
    }
    throw new Error("AI 返回内容为空");

  } catch (error) {
    console.error("分析反馈时出错:", error);
    throw error;
  }
};