const systemPrompt = `You are Thundra AI, an expert video editing consultant.

You have deep knowledge of:
* Video editing principles (retention, pacing, visual hierarchy, J-cuts/L-cuts, storytelling, audience psychology)
* Adobe Premiere Pro (timeline optimization, proxies, keyboard shortcuts, performance fixes, export settings)
* After Effects (motion graphics, expressions, compositing, VFX, text animations)
* DaVinci Resolve (color page nodes, Fusion, Fairlight audio mixing, CST/color space transform, grading scopes)
* CapCut (mobile workflows, reels, shorts, viral loops, transitions, stickers, auto-captions)
* Final Cut Pro (magnetic timeline, compound clips, auditions, background rendering optimization)
* Color grading (LUT workflows, cinematic film emulation, skin tone vectorscope balancing, split-toning)
* Sound design (parametric EQ, noise gating, vocal enhancements, compression, limiter, sidechain ducking)
* Content Creation strategy (YouTube hooks, average watch duration retention peaks/valleys, vertical hooks)
* AI Video Tools (Runway, Kling, Veo, ElevenLabs, Descript, Opus Clip, Topaz Video AI, and when to recommend each)

Always provide professional, detailed, actionable advice.
Never provide generic or one-paragraph responses.
Think like a senior video editor, post-production supervisor, and content strategist.

Format all responses using professional Markdown subheadings:
- #### 📝 Overview
  [A thorough explanation of the topic/problem, context, and software implications]
- #### 🎬 Step-by-Step Workflow
  [A numbered list of actionable instructions to execute the task/solve the issue]
- #### 🛠️ Recommended Tools
  [List of software, plugins, or hardware tools recommended]
- #### ⚙️ Recommended Settings
  [Export bitrates, project settings, frame rates, color spaces, or compressor thresholds]
- #### ⚠️ Common Mistakes
  [Pitfalls to avoid, such as wrong codecs, linear keyframes, over-compressed audio]
- #### 💡 Professional Tips
  [Niche industry secrets, timeline shortcuts, keyboard bindings, editor psychological tricks]
- #### 🚀 Advanced Techniques
  [Planar tracking, expressions code, dynamic masking, shared color nodes, sound brick-walls]`;

exports.chatHandler = async (req, res) => {
  const { message, history } = req.body;

  const apiKeyGemini = process.env.GEMINI_API_KEY;
  const apiKeyOpenAI = process.env.OPENAI_API_KEY;
  const apiKeyClaude = process.env.CLAUDE_API_KEY || process.env.ANTHROPIC_API_KEY;

  if (!message) {
    return res.status(400).json({ error: "Bad Request", message: "Prompt message is required." });
  }

  try {
    if (apiKeyGemini) {
      // 1. GEMINI API CALL
      const formattedContents = [];
      
      if (history && history.length > 0) {
        history.forEach(msg => {
          formattedContents.push({
            role: msg.sender === 'user' ? 'user' : 'model',
            parts: [{ text: msg.text }]
          });
        });
      }

      if (formattedContents.length === 0 || formattedContents[formattedContents.length - 1].role !== 'user') {
        formattedContents.push({
          role: 'user',
          parts: [{ text: message }]
        });
      }

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKeyGemini}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: formattedContents,
          systemInstruction: {
            parts: [{ text: systemPrompt }]
          }
        })
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Gemini API returned ${response.status}: ${errText}`);
      }

      const data = await response.json();
      const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response generated from Gemini.";
      return res.status(200).json({ content: aiText });

    } else if (apiKeyOpenAI) {
      // 2. OPENAI API CALL
      const formattedMessages = [
        { role: 'system', content: systemPrompt }
      ];

      if (history && history.length > 0) {
        history.forEach(msg => {
          formattedMessages.push({
            role: msg.sender === 'user' ? 'user' : 'assistant',
            content: msg.text
          });
        });
      }

      if (formattedMessages[formattedMessages.length - 1].role !== 'user') {
        formattedMessages.push({
          role: 'user',
          content: message
        });
      }

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKeyOpenAI}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: formattedMessages
        })
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`OpenAI API returned ${response.status}: ${errText}`);
      }

      const data = await response.json();
      const aiText = data.choices?.[0]?.message?.content || "No response generated from OpenAI.";
      return res.status(200).json({ content: aiText });

    } else if (apiKeyClaude) {
      // 3. CLAUDE (ANTHROPIC) API CALL
      const formattedMessages = [];

      if (history && history.length > 0) {
        history.forEach(msg => {
          formattedMessages.push({
            role: msg.sender === 'user' ? 'user' : 'assistant',
            content: msg.text
          });
        });
      }

      if (formattedMessages.length === 0 || formattedMessages[formattedMessages.length - 1].role !== 'user') {
        formattedMessages.push({
          role: 'user',
          content: message
        });
      }

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKeyClaude,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-5-sonnet-20240620',
          system: systemPrompt,
          messages: formattedMessages,
          max_tokens: 4096
        })
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Claude API returned ${response.status}: ${errText}`);
      }

      const data = await response.json();
      const aiText = data.content?.[0]?.text || "No response generated from Claude.";
      return res.status(200).json({ content: aiText });

    } else {
      // 4. MISSING CONFIGURATION FALLBACK (INSTRUCTIONS ALERT)
      return res.status(400).json({
        error: "Missing API Key",
        message: "No AI API key found in the backend configuration. Please add `GEMINI_API_KEY`, `OPENAI_API_KEY`, or `CLAUDE_API_KEY` to your backend `.env` file to activate the live assistant."
      });
    }
  } catch (error) {
    console.error("Live AI Assistant API error:", error);
    return res.status(500).json({
      error: "AI Service Connection Failed",
      message: error.message || "An unexpected error occurred while communicating with the AI service."
    });
  }
};
