import { describe, it, expect } from 'vitest';
import { preprocessContent } from './preprocessContent';

describe('preprocessContent', () => {
  // --- Null/empty ---
  it('returns null/undefined/empty as-is', () => {
    expect(preprocessContent(null)).toBe(null);
    expect(preprocessContent(undefined)).toBe(undefined);
    expect(preprocessContent('')).toBe('');
  });

  // --- Step 1: Corrupted LaTeX backslashes ---
  describe('corrupted backslash restoration', () => {
    it('restores form-feed + rac → \\frac', () => {
      expect(preprocessContent('\x0Crac{1}{2}')).toContain('\\frac{1}{2}');
    });

    it('restores tab + imes → \\times', () => {
      expect(preprocessContent('\times')).toContain('\\times');
    });

    it('restores tab + ext → \\text', () => {
      expect(preprocessContent('\text{hello}')).toContain('\\text{hello}');
    });

    it('restores tab + heta → \\theta', () => {
      expect(preprocessContent('\theta')).toContain('\\theta');
    });

    it('restores backspace + egin → \\begin', () => {
      expect(preprocessContent('\x08egin{equation}')).toContain('\\begin{equation}');
    });

    it('restores CR + ho → \\rho', () => {
      expect(preprocessContent('\rho')).toContain('\\rho');
    });
  });

  // --- Step 2: Literal \\n → newline ---
  describe('literal \\n conversion', () => {
    it('converts \\n before uppercase', () => {
      expect(preprocessContent('hello\\nWorld')).toContain('hello\nWorld');
    });

    it('converts \\n before digit', () => {
      expect(preprocessContent('line\\n123')).toContain('line\n123');
    });

    it('converts \\n at end of string', () => {
      expect(preprocessContent('line\\n')).toBe('line\n');
    });

    it('preserves \\nabla', () => {
      const result = preprocessContent('\\nabla f');
      expect(result).toContain('\\nabla');
    });

    it('preserves \\nu', () => {
      expect(preprocessContent('\\nu')).toContain('\\nu');
    });

    it('preserves \\theta (not converted to tab)', () => {
      expect(preprocessContent('\\theta')).toContain('\\theta');
    });

    it('preserves \\times', () => {
      expect(preprocessContent('\\times')).toContain('\\times');
    });
  });

  // --- Step 3: Dollar-number escaping ---
  describe('dollar-number escaping', () => {
    it('escapes $100 to \\$100', () => {
      expect(preprocessContent('costs $100')).toContain('\\$100');
    });

    it('does NOT escape $x', () => {
      expect(preprocessContent('$x$ is var')).not.toContain('\\$x');
    });

    it('does NOT escape $ in code blocks', () => {
      const result = preprocessContent('```\nprice is $100\n```');
      expect(result).toContain('$100');
      expect(result).not.toContain('\\$100');
    });

    it('does NOT escape $ in inline code', () => {
      const result = preprocessContent('use `$100` for price');
      expect(result).toContain('`$100`');
    });
  });

  // --- LaTeX delimiter normalization: single → double backslash.
  //     Reason: CommonMark parses `\(` / `\[` as punctuation escapes and
  //     strips the backslash before MathJax sees the HTML. We emit `\\(`
  //     so markdown reduces it to `\(` in the rendered output.
  describe('LaTeX delimiters doubled for markdown survival', () => {
    it('doubles \\[...\\] to \\\\[...\\\\]', () => {
      const input = '\\[E = mc^2\\]';
      const result = preprocessContent(input);
      expect(result).toContain('\\\\[E = mc^2\\\\]');
    });

    it('doubles \\(...\\) to \\\\(...\\\\)', () => {
      const input = 'inline \\(x^2\\) here';
      const result = preprocessContent(input);
      expect(result).toContain('\\\\(x^2\\\\)');
    });

    it('preserves $...$ inline math as-is', () => {
      const input = 'inline $x^2$ here';
      const result = preprocessContent(input);
      expect(result).toContain('$x^2$');
    });

    it('preserves $$...$$ display math as-is', () => {
      const input = '$$E = mc^2$$';
      const result = preprocessContent(input);
      expect(result).toContain('$$E = mc^2$$');
    });
  });

  // --- Step 3: Bare delimiter fix ---
  describe('bare delimiters without backslash', () => {
    // Кейс 1: display with spaces
    it('case1: [ t\' = \\frac{...} ]', () => {
      const input = "[ t' = \\frac{t}{\\sqrt{1 - v^2/c^2}} ]";
      const result = preprocessContent(input);
      expect(result).toMatch(/^\\\\\[/);
      expect(result).toMatch(/\\\\\]$/);
    });

    // Кейс 2: Unicode π and Λ
    it('case2: [ G_{\\mu\\nu} + Λg_{\\mu\\nu} = ... ]', () => {
      const input = '[ G_{\\mu\\nu} + Λg_{\\mu\\nu} = \\frac{8πG}{c^4} T_{\\mu\\nu} ]';
      const result = preprocessContent(input);
      expect(result).toMatch(/^\\\\\[/);
    });

    // Кейс 3: nested parens inside [ ]
    it('case3: [ ... (7500/3 \\times 10^{8})^2 ... ]', () => {
      const input = '[ t\' = \\frac{1 \\text{ sec}}{\\sqrt{1 - (7500/3 \\times 10^{8})^2}} \\approx 1.000000469 \\text{ seconds} ]';
      const result = preprocessContent(input);
      expect(result).toMatch(/^\\\\\[/);
    });

    // Кейс 4: superscripts and subscripts
    it('case4: [ x\'^{\\mu} = \\Lambda^{\\mu}_{\\nu}(v) x^{\\nu} ]', () => {
      const input = "[ x'^{\\mu} = \\Lambda^{\\mu}_{\\nu}(v) x^{\\nu} ]";
      const result = preprocessContent(input);
      expect(result).toMatch(/^\\\\\[/);
    });

    // Кейс 5: unclosed [ without ]
    it('case5: [\\Delta t\' = \\frac{...} = (no closing bracket)', () => {
      const input = "[\\Delta t' = \\frac{\\Delta t}{\\gamma} =";
      const result = preprocessContent(input);
      expect(result).toMatch(/^\\\\\[/);
      expect(result).toMatch(/\\\\\]$/);
    });

    // Кейс 6: display with nested parens and \\cdot
    it('case6: [ \\Delta t\' = \\sqrt{...} \\cdot 1yr ≈ 0.5 yr ]', () => {
      const input = "[ \\Delta t' = \\sqrt{1-\\frac{(0.866)^2}{(3\\times10^8)^2}} \\cdot 1yr \\approx 0.5 yr ]";
      const result = preprocessContent(input);
      expect(result).toMatch(/^\\\\\[/);
    });

    // Кейс 7: no spaces around content
    it('case7: [\\frac{\\Delta f}{f} = - \\frac{2GM}{c^2 r}]', () => {
      const input = '[\\frac{\\Delta f}{f} = - \\frac{2GM}{c^2 r}]';
      const result = preprocessContent(input);
      expect(result).toMatch(/^\\\\\[/);
    });

    // Кейс 8: another nested paren variant
    it('case8: [ \\Delta t\' = \\sqrt{...}\\cdot 1yr ]', () => {
      const input = "[ \\Delta t' = \\sqrt{1-\\frac{(0.866)^2}{(3\\times10^8)^2}}\\cdot 1yr \\approx 0.5 yr ]";
      const result = preprocessContent(input);
      expect(result).toMatch(/^\\\\\[/);
    });

    // Кейс 9: Unicode π
    it('case9: [ G_{00} = -8πT_{00}/c^4 ]', () => {
      const input = '[ G_{00} = -8πT_{00}/c^4 ]';
      const result = preprocessContent(input);
      expect(result).toMatch(/^\\\\\[/);
    });

    // Кейс 10: Unicode ×
    it('case10: [ G_{00} \\approx 1.5 ×10^{-9}\\text{ s}^{-2} ]', () => {
      const input = '[ G_{00} \\approx 1.5 ×10^{-9}\\text{ s}^{-2} ]';
      const result = preprocessContent(input);
      expect(result).toMatch(/^\\\\\[/);
    });

    // Inline math
    it('converts bare ( \\text{kg} ) to \\\\(...\\\\)', () => {
      const input = 'mass is ( m = 1 \\, \\text{kg} ) here';
      const result = preprocessContent(input);
      expect(result).toContain('\\\\(');
      expect(result).toContain('\\\\)');
    });

    it('handles nested parens in inline: ( c = 3.00 \\times 10^8 \\, \\text{m/s} )', () => {
      const input = 'speed ( c = 3.00 \\times 10^8 \\, \\text{m/s} ) approx';
      const result = preprocessContent(input);
      expect(result).toContain('\\\\(');
    });

    // Safety: don't touch normal text
    it('does NOT convert regular parentheses without LaTeX', () => {
      const input = 'Einstein (born 1879) was German';
      const result = preprocessContent(input);
      expect(result).toBe(input);
    });

    it('does NOT convert regular brackets without LaTeX', () => {
      const input = '[References: 1] en.wikipedia.org';
      const result = preprocessContent(input);
      expect(result).toBe(input);
    });

    it('doubles backslashes on lines already having \\( \\)', () => {
      const input = 'already \\(x^2\\) fixed';
      const result = preprocessContent(input);
      expect(result).toContain('\\\\(x^2\\\\)');
    });

    it('does NOT touch code blocks', () => {
      const input = '```\n[ \\frac{1}{2} ]\n```';
      const result = preprocessContent(input);
      expect(result).toContain('[ \\frac{1}{2} ]');
    });
  });

  // --- Integration ---
  describe('real-world agent output', () => {
    it('handles mixed content with delimited math', () => {
      const input = 'Energy: \\(E = mc^2\\) is famous. Display:\n\\[\\frac{a}{b}\\]';
      const result = preprocessContent(input);
      expect(result).toContain('\\\\(E = mc^2\\\\)');
      expect(result).toContain('\\\\[\\frac{a}{b}\\\\]');
    });

    it('handles price + formula in same text', () => {
      const input = 'A $50 item. Force: \\(F = ma\\).';
      const result = preprocessContent(input);
      expect(result).toContain('\\$50');
      expect(result).toContain('\\\\(F = ma\\\\)');
    });

    it('does not hang on large content', () => {
      const para = 'This is a paragraph with some math \\(x^2 + y^2 = z^2\\) and text. ';
      const largeContent = para.repeat(200);
      const start = Date.now();
      const result = preprocessContent(largeContent);
      const elapsed = Date.now() - start;
      expect(elapsed).toBeLessThan(200);
      expect(result).toContain('\\\\(x^2 + y^2 = z^2\\\\)');
    });
  });
});
