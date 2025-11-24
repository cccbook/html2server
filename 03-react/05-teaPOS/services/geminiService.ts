import { GoogleGenAI } from "@google/genai";
import { PRODUCTS } from "../constants";

export const getAIRecommendation = async (): Promise<string> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      console.warn("API Key not found");
      return "請設定 API Key 以啟用 AI 推薦功能。今天推薦您試試看我們的招牌珍珠奶茶！";
    }

    const ai = new GoogleGenAI({ apiKey });
    const menuList = PRODUCTS.map(p => p.name).join(", ");
    
    const prompt = `
      你是一個台灣手搖飲料店的熱情店員。
      現在時間是 ${new Date().toLocaleTimeString()}。
      請從這份菜單中隨機推薦一個飲品給客人：[${menuList}]。
      
      請依照現在的時間和一般人的喝茶習慣（例如下午適合提神，晚上適合無咖啡因），
      給出一個幽默且簡短的推薦理由（不超過50個字）。
      
      格式：
      ✨ 店長推薦：[飲品名稱]
      💬 [推薦理由]
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "系統繁忙，推薦您喝杯水冷靜一下！";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "AI 正在休息喝茶中... 請稍後再試。";
  }
};