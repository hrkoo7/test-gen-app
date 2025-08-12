
const axios = require('axios');

const API_KEY = process.env.GEMINI_API_KEY;
const MODEL = 'gemini-2.5-flash-lite';
const URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;

const headers = {
  'Content-Type': 'application/json',
  'x-goog-api-key': API_KEY
};

exports.getTestSummaries = async (files) => {
  const promptContent = files
    .map(f => `File: ${f.filename}\n${f.content.slice(0, 500)}`)
    .join('\n\n');

  const body = {
    contents: [
      {
        parts: [
          { text: `Suggest 2 test cases scenario for this code:\n\n${promptContent} just theary no code` }
        ]
      }
    ],
    generationConfig: {
      temperature: 0.3,
      maxOutputTokens: 2048
    }
  };

  try {
    const { data } = await axios.post(URL, body, { headers });
    const candidate = data.candidates?.[0];
    console.log('finishReason:', candidate?.finishReason);
    console.log('text:', candidate?.content?.parts?.[0]?.text);
    return candidate?.content?.parts?.[0]?.text?.trim() || '';
  } catch (err) {
    console.error('Gemini API Error:', err.response?.data || err.message);
    throw new Error('Gemini API failed');
  }
};







exports.getTestCodeFromSummary = async (summaryText, fileContent, filename) => {
  const prompt = 
    `You are a software test-generator. Given the following summary and file content, ` +
    `provide a test skeleton (in a neutral style) appropriate for the file's programming language.\n\n` +
    `Filename: ${filename}\n` +
    `Summary:\n${summaryText}\n\n` +
    `Content Preview:\n` +
    `${fileContent.slice(0, 2000)}\n\n` +
    `Please output complete test code only (no explanation).`;

  const body = {
    contents: [
      {
        parts: [{ text: prompt }]
      }
    ],
    generationConfig: {
      temperature: 0.3,
      maxOutputTokens: 2028
    }
  };

  try {
    const { data } = await axios.post(URL, body, { headers });
    const candidate = data.candidates?.[0];
    console.log('Test-code finishReason:', candidate?.finishReason);
    const text = candidate?.content?.parts?.[0]?.text;
    console.log('Generated test code:', text);
    return text?.trim() || '';
  } catch (err) {
    console.error('Gemini (test code) Error:', err.response?.data || err.message);
    throw new Error('Failed to generate test code');
  }
};
