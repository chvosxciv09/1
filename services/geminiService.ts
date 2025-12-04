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
        temperature: 0.3,
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

export const summarizeProjectFile = async (fileContent: string, fileName: string): Promise<string> => {
  try {
    const prompt = `
      请阅读以下工业设计项目文件（文件名: ${fileName}）的内容，并生成一份专业的摘要。
      摘要应包含关键发现、数据点或设计要求。
      
      文件内容:
      "${fileContent.substring(0, 10000)}" // 限制长度以防止超出 token
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return response.text || "无法生成摘要";
  } catch (error) {
    console.error("总结文件时出错:", error);
    return "总结失败，请稍后重试。";
  }
};

export const askProjectAssistant = async (query: string, projectContext: string): Promise<string> => {
  try {
    const prompt = `
      你是一个名为 "DesignFlow Assistant" 的智能助手，服务于一家工业设计工作室。
      
      以下是当前工作室所有项目的实时数据（JSON格式）：
      ${projectContext}
      
      用户问题: "${query}"
      
      请根据提供的项目数据回答用户问题。
      规则：
      1. 如果用户询问进度，请根据 'progress' 字段回答。
      2. 如果用户询问截止日期，请根据 'dueDate' 提醒剩余时间。
      3. 如果用户询问特定项目，请提供该项目的详细状态、阶段和团队信息。
      4. 保持回答简练、专业、有帮助。
      5. 使用中文回答。
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return response.text || "抱歉，我暂时无法回答这个问题。";
  } catch (error) {
    console.error("AI 助手出错:", error);
    return "系统繁忙，请稍后再试。";
  }
};