
import { HistoryContext } from './history.service.js';

export async function* generateExplanationStream({ topic, level, language, signal }, addHistoryItem) {
    const mockContent = `
### Explaining ${topic} at a ${level} level in ${language}.

This is a simulated response from the Gemini API. In a real application, this content would be generated dynamically based on your request.

#### Key Concepts

1.  **Concept One**: A detailed explanation of the first key concept, tailored to the selected cognitive depth. For a 'Kids' level, this would be a simple analogy. For an 'Expert' level, it would include technical jargon and complex relationships.
2.  **Concept Two**: Further elaboration on another important aspect of the topic.
3.  **Concept Three**: A third point to provide a well-rounded understanding.

#### Example

Here's a practical example related to **${topic}**:

\`\`\`javascript
// This is a code block example
function greet(name) {
  console.log(\`Hello, \${name}!\`);
}
\`\`\`

#### Conclusion

In summary, ${topic} is a fascinating subject. This explanation provides a foundational understanding at the ${level} level. Further exploration is encouraged for a deeper dive.
    `;

    const words = mockContent.trim().split(' ');
    let fullResponse = '';
    
    for (const word of words) {
        if (signal.aborted) {
            console.log('Stream aborted by user.');
            return;
        }
        await new Promise(resolve => setTimeout(resolve, 50));
        const chunk = word + ' ';
        fullResponse += chunk;
        yield chunk;
    }
    
    // Once streaming is done, save to history
    addHistoryItem({ topic, level, content: fullResponse });
}
