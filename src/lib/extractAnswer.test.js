import { describe, it, expect } from 'vitest';
import { extractAnswer, isResearchPending } from './extractAnswer';

describe('extractAnswer', () => {
  it('returns null for null/undefined', () => {
    expect(extractAnswer(null)).toBe(null);
    expect(extractAnswer(undefined)).toBe(null);
    expect(extractAnswer('string')).toBe(null);
  });

  it('extracts from { final_answer: { answer_text } }', () => {
    const data = { final_answer: { answer_text: 'hello world' } };
    expect(extractAnswer(data)).toBe('hello world');
  });

  it('extracts from { final_answer: { answer } }', () => {
    const data = { final_answer: { answer: 'hello' } };
    expect(extractAnswer(data)).toBe('hello');
  });

  it('prefers answer_text over answer in object', () => {
    const data = { final_answer: { answer_text: 'preferred', answer: 'fallback' } };
    expect(extractAnswer(data)).toBe('preferred');
  });

  it('extracts from { final_answer: "plain markdown" }', () => {
    const data = { final_answer: '# Hello\nWorld' };
    expect(extractAnswer(data)).toBe('# Hello\nWorld');
  });

  it('extracts from JSON-stringified final_answer', () => {
    const inner = JSON.stringify({ answer_text: 'unwrapped' });
    const data = { final_answer: inner };
    expect(extractAnswer(data)).toBe('unwrapped');
  });

  it('handles invalid JSON in final_answer string gracefully', () => {
    const data = { final_answer: '{not valid json' };
    expect(extractAnswer(data)).toBe('{not valid json');
  });

  it('extracts from top-level { answer }', () => {
    const data = { answer: 'top level' };
    expect(extractAnswer(data)).toBe('top level');
  });

  it('extracts from top-level { report }', () => {
    const data = { report: 'report text' };
    expect(extractAnswer(data)).toBe('report text');
  });

  it('prefers final_answer over top-level answer', () => {
    const data = { final_answer: 'primary', answer: 'fallback' };
    expect(extractAnswer(data)).toBe('primary');
  });

  it('returns null for empty object', () => {
    expect(extractAnswer({})).toBe(null);
  });

  it('returns null for { final_answer: {} } with no text fields', () => {
    expect(extractAnswer({ final_answer: { status: 'done' } })).toBe(null);
  });
});

describe('isResearchPending', () => {
  it('returns true for running', () => {
    expect(isResearchPending({ status: 'running' })).toBe(true);
  });

  it('returns true for in_progress', () => {
    expect(isResearchPending({ status: 'in_progress' })).toBe(true);
  });

  it('returns true for pending', () => {
    expect(isResearchPending({ status: 'pending' })).toBe(true);
  });

  it('returns false for completed', () => {
    expect(isResearchPending({ status: 'completed' })).toBe(false);
  });

  it('returns false for null/undefined', () => {
    expect(isResearchPending(null)).toBe(false);
    expect(isResearchPending(undefined)).toBe(false);
  });
});
