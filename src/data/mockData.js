export const mockUser = {
  name: 'Alex Developer',
  plan: 'Pro Plan',
  avatar: null,
};

export const mockConversations = [
  { id: '0', title: 'Markdown Elements Demo', date: '2026-03-22' },
  { id: '1', title: 'React Hooks Explanation', date: '2026-03-22' },
  { id: '2', title: 'Python Data Analysis Script', date: '2026-03-22' },
  { id: '3', title: 'Marketing Strategy 2024', date: '2026-03-21' },
  { id: '4', title: 'Translate English to Japanese', date: '2026-03-21' },
  { id: '5', title: 'Build a REST API with Node.js', date: '2026-03-20' },
];

// ------------------------------------------------------------------
// Markdown demo content — demonstrates every supported element
// ------------------------------------------------------------------
const markdownDemoContent = `# Heading Level 1
## Heading Level 2
### Heading Level 3
#### Heading Level 4
##### Heading Level 5
###### Heading Level 6

---

## Paragraphs and Line Breaks

This is a standard paragraph with regular text. Paragraphs are separated by blank lines in markdown.

This is another paragraph.
This line has a manual line break using two trailing spaces.

---

## Text Formatting

Here is some *italic text* using emphasis.

Here is some **bold text** using strong emphasis.

Here is some ***bold and italic text*** combined.

Here is some ~~strikethrough text~~ that has been deleted.

---

## Lists

### Unordered List

- First item in unordered list
- Second item in unordered list
- Third item with nested list:
  - Nested item one
  - Nested item two
- Fourth item

### Ordered List

1. First step
2. Second step
3. Third step with nested ordered list:
   1. Sub-step A
   2. Sub-step B
4. Fourth step

### Task List (Checkboxes)

- [x] Completed task
- [ ] Incomplete task
- [x] Another completed task
- [ ] Work in progress

---

## Links and Images

Here is a [standard hyperlink](https://example.com) to an external website.

You can also use [GitHub](https://github.com) or [Stack Overflow](https://stackoverflow.com) as references.

Auto-linked URL: https://www.example.com

---

## Blockquotes

> This is a simple blockquote. It's often used to highlight important information or quotes from other sources.

### Nested Blockquotes

> This is the first level of quotation.
>
> > This is a nested blockquote inside the first one.
> >
> > > And this is a third level of nesting.

---

## Code Examples

### Inline Code

Use the \`console.log()\` function to print output in JavaScript. You can also use \`useState\` hook in React.

### Code Blocks

\`\`\`javascript
// JavaScript example
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}
console.log(fibonacci(10)); // Output: 55
\`\`\`

\`\`\`python
# Python example
def quick_sort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quick_sort(left) + middle + quick_sort(right)

print(quick_sort([3, 6, 8, 10, 1, 2, 1]))
\`\`\`

\`\`\`html
<!-- HTML example -->
<div class="container">
  <h1>Welcome to My Website</h1>
  <p>This is a paragraph with <strong>bold text</strong>.</p>
</div>
\`\`\`

---

## Horizontal Rules

The lines above and below are horizontal rules (created with \`---\`).

---

## Tables

| Feature | Description | Status |
|---------|-------------|--------|
| Markdown Support | Full markdown rendering with syntax highlighting | ✅ Active |
| Code Blocks | Syntax-highlighted code with copy functionality | ✅ Active |
| Tables | Responsive table layouts with hover effects | ✅ Active |
| LaTeX Math | Mathematical equation rendering | 🚧 Coming Soon |

---

## Character Escaping

You can escape special markdown characters using backslash:

- \\* This asterisk won't create italic
- \\# This won't be a heading
- \\[This\\] won't be a link

---

## Footnotes

Here is a sentence with a footnote[^1]. And here is another one[^2].

[^1]: This is the first footnote with additional context and explanation.
[^2]: This is the second footnote providing more detailed information.

---

## HTML Embedding

You can embed raw HTML directly in markdown:

<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 1.5rem; border-radius: 0.5rem; color: white; margin: 1rem 0;">
  <h3 style="margin: 0 0 0.5rem 0; font-size: 1.25rem;">Custom HTML Block</h3>
  <p style="margin: 0;">This is a custom-styled div with gradient background created using raw HTML and inline styles.</p>
</div>

---

## Collapsible Sections

<details>
<summary>Click to expand: What is React?</summary>

React is a JavaScript library for building user interfaces. It was developed by Facebook and is maintained by Meta and a community of individual developers and companies.

Key features include:

- Component-based architecture
- Virtual DOM for efficient updates
- Unidirectional data flow
- JSX syntax

</details>

<details>
<summary>Click to expand: Advanced Code Example</summary>

\`\`\`javascript
// React Hook Example
import { useState, useEffect } from 'react';

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      const response = await fetch(\`/api/users/\${userId}\`);
      const data = await response.json();
      setUser(data);
      setLoading(false);
    }
    fetchUser();
  }, [userId]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="profile">
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  );
}
\`\`\`

</details>

<details>
<summary>Click to expand: Performance Tips</summary>

Here are some performance optimization techniques:

1. **Code Splitting:** Break your bundle into smaller chunks
2. **Lazy Loading:** Load components only when needed
3. **Memoization:** Use React.memo and useMemo to prevent unnecessary re-renders
4. **Virtualization:** Render only visible items in long lists

</details>`;

export const mockMessages = {
  '0': [
    {
      id: 'md-q',
      role: 'user',
      content:
        'Show me all markdown elements with examples: headings, paragraphs, line breaks, italic, bold, strikethrough, lists, checkboxes, links, images, quotes, code blocks, tables, footnotes, HTML, and collapsible sections.',
    },
    {
      id: 'md-a',
      role: 'assistant',
      content: markdownDemoContent,
      rating: null,
    },
  ],
  '1': [
    {
      id: 'm1',
      role: 'user',
      content:
        'Can you explain how React hooks work under the hood? Specifically, how does it maintain state between renders without using classes?',
    },
    {
      id: 'm2',
      role: 'assistant',
      content: `React hooks are a fascinating abstraction. Under the hood, React doesn't use magic; it uses simple JavaScript arrays (or specifically, linked lists) to track state and side effects.

Here is a simplified mental model of how \`useState\` works:

\`\`\`javascript
let state = [];
let setters = [];
let firstRun = true;
let cursor = 0;

function createSetter(cursor) {
  return function setterWithCursor(newVal) {
    state[cursor] = newVal;
    render(); // Triggers a re-render
  };
}

// Pseudo-implementation of useState
export function useState(initVal) {
  if (firstRun) {
    state.push(initVal);
    setters.push(createSetter(cursor));
    firstRun = false;
  }
  const setter = setters[cursor];
  const value = state[cursor];
  cursor++;
  return [value, setter];
}
\`\`\`

Key concepts to understand:

- **Order matters:** Because React relies on the call order (the \`cursor\`), hooks must be called in the exact same order on every render. This is why you cannot put hooks inside conditionals or loops.
- **Fiber Architecture:** In actual React, this state isn't kept in a global array. It's stored on the **Fiber node** representing the component. Each component has its own linked list of hooks.`,
      rating: null,
    },
    {
      id: 'm3',
      role: 'user',
      content:
        'That makes sense! Can you show me a practical example of useEffect with cleanup?',
    },
    {
      id: 'm4',
      role: 'assistant',
      content: `Absolutely! Here's a practical example of \`useEffect\` with cleanup — a window resize listener:

\`\`\`javascript
import { useState, useEffect } from 'react';

function useWindowSize() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);

    // Cleanup function — runs when component
    // unmounts or before effect re-runs
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []); // Empty deps = run once on mount

  return size;
}
\`\`\`

The **cleanup function** (the returned function) is critical for preventing memory leaks. React calls it:

1. **Before re-running the effect** (if dependencies change)
2. **When the component unmounts**

Without cleanup, the event listener would persist even after the component is removed from the DOM, causing a memory leak.`,
      rating: null,
    },
  ],
  '2': [
    {
      id: 'm5',
      role: 'user',
      content:
        'Write me a Python script that reads a CSV file and creates a summary with statistics.',
    },
    {
      id: 'm6',
      role: 'assistant',
      content: `Here's a clean Python script using \`pandas\` for CSV analysis:

\`\`\`python
import pandas as pd
import sys

def analyze_csv(filepath):
    """Read a CSV file and print summary statistics."""
    df = pd.read_csv(filepath)

    print(f"Shape: {df.shape[0]} rows x {df.shape[1]} columns")
    print(f"\\nColumns: {', '.join(df.columns)}")
    print(f"\\nData Types:\\n{df.dtypes}")

    # Numeric summary
    numeric_cols = df.select_dtypes(include='number')
    if not numeric_cols.empty:
        print(f"\\nNumeric Summary:\\n{numeric_cols.describe()}")

    # Missing values
    missing = df.isnull().sum()
    if missing.any():
        print(f"\\nMissing Values:\\n{missing[missing > 0]}")

if __name__ == "__main__":
    filepath = sys.argv[1] if len(sys.argv) > 1 else "data.csv"
    analyze_csv(filepath)
\`\`\`

Run it with:

\`\`\`bash
python analyze.py your_data.csv
\`\`\`

This gives you a quick overview of any CSV file including shape, data types, numeric statistics, and missing values.`,
      rating: null,
    },
  ],
  '3': [
    {
      id: 'm7',
      role: 'user',
      content:
        'Help me brainstorm a digital marketing strategy for a SaaS product launch.',
    },
    {
      id: 'm8',
      role: 'assistant',
      content: `Here's a comprehensive launch strategy framework:

**Pre-Launch (4-6 weeks before)**
- Build a landing page with an email waitlist
- Create teaser content on social media
- Reach out to beta testers and gather testimonials
- Write SEO-optimized blog posts about the problem you solve

**Launch Week**
- Product Hunt launch (aim for Tuesday-Thursday)
- Email blast to waitlist with early-bird pricing
- Press outreach to tech blogs and niche publications
- Social media blitz across LinkedIn, Twitter/X, and relevant communities

**Post-Launch (ongoing)**
- Content marketing: case studies, tutorials, comparison guides
- Paid ads: Google Ads for high-intent keywords, LinkedIn for B2B
- Community building: Discord/Slack group, webinars, AMAs
- Referral program with incentives for existing users

The key is to **validate your messaging** with the beta group before going broad. Their language becomes your ad copy.`,
      rating: null,
    },
  ],
  '4': [],
  '5': [],
};

export const mockAIResponses = [
  `That's a great question! Let me break it down for you.

The key insight is that modern frameworks use a **virtual DOM** diffing algorithm to minimize actual DOM manipulations. Here's how it works:

\`\`\`javascript
function diff(oldVNode, newVNode) {
  if (oldVNode.type !== newVNode.type) {
    return { type: 'REPLACE', newVNode };
  }
  // Compare props and children recursively
  const propPatches = diffProps(oldVNode.props, newVNode.props);
  const childPatches = diffChildren(oldVNode.children, newVNode.children);
  return { propPatches, childPatches };
}
\`\`\`

This approach is what makes React and similar frameworks so performant — they batch DOM updates and apply only the minimum necessary changes.`,

  `Here's a concise explanation:

1. **First**, the data flows from parent to child via props
2. **Then**, each component manages its own local state
3. **Finally**, side effects are handled in \`useEffect\`

This unidirectional data flow makes applications predictable and easier to debug.

\`\`\`javascript
// Example of the data flow
function App() {
  const [count, setCount] = useState(0);

  return (
    <Counter
      value={count}
      onIncrement={() => setCount(c => c + 1)}
    />
  );
}
\`\`\``,

  `Great observation! Here are the best practices to keep in mind:

- **Keep components small and focused** — each component should do one thing well
- **Use custom hooks** to extract reusable logic
- **Memoize expensive computations** with \`useMemo\`
- **Avoid premature optimization** — measure first, then optimize

Remember: readable code is more valuable than clever code. Your future self will thank you!`,
];
