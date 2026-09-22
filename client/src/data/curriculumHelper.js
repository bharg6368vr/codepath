import pythonData from './curriculum/python.json'
import javaData from './curriculum/java.json'
import cppData from './curriculum/cpp.json'
import cData from './curriculum/c.json'

const CURRICULA = {
  python: pythonData,
  java: javaData,
  cpp: cppData,
  c: cData,
}

export function getFallbackModules(languageId) {
  const data = CURRICULA[languageId]
  if (!data || !data.modules) return []
  return data.modules.map((m, idx) => ({
    id: `${languageId}-mod-${m.order || idx + 1}`,
    languageId,
    order: m.order || idx + 1,
    title: m.title,
    pages: m.pages || [],
    codeExamples: m.codeExamples || [],
    practiceProblem: m.practiceProblem || null,
  }))
}

export function getFallbackQuiz(languageId) {
  const data = CURRICULA[languageId]
  if (!data) return null

  // Collect all practice questions or build a default 10-question set
  const questions = [
    {
      id: 1,
      type: 'mcq',
      moduleTitle: 'Syntax Basics',
      prompt: `Which of the following is a primary characteristic of ${data.name}?`,
      options: ['Strong typing and structured syntax', 'No syntax required', 'Cannot handle numbers', 'Runs without execution memory'],
      correctAnswer: 'Strong typing and structured syntax',
      explanation: 'Every language has a core paradigm and structured type syntax.',
    },
    {
      id: 2,
      type: 'mcq',
      moduleTitle: 'Data Types',
      prompt: 'What happens if you compare floating point numbers directly after multiple arithmetic operations?',
      options: ['Precision errors can make exact equality comparisons fail', 'Floats always compare 100% exact', 'Floating numbers are stored as arbitrary strings', 'It throws a syntax compilation error'],
      correctAnswer: 'Precision errors can make exact equality comparisons fail',
      explanation: 'IEEE-754 binary floating-point representation cannot represent all decimal fractions exactly.',
    },
    {
      id: 3,
      type: 'mcq',
      moduleTitle: 'Control Flow',
      prompt: 'What is the purpose of a loop break statement?',
      options: ['Immediately terminates the loop and transfers execution to the statement following the loop', 'Pauses the processor for 1 second', 'Restarts the computer', 'Skips only the current iteration'],
      correctAnswer: 'Immediately terminates the loop and transfers execution to the statement following the loop',
      explanation: 'Break immediately exits the enclosing loop block.',
    },
    {
      id: 4,
      type: 'true_false',
      moduleTitle: 'Memory & Scope',
      prompt: 'Local variables declared inside a function block are destroyed when the function finishes execution in stack-based languages.',
      options: ['true', 'false'],
      correctAnswer: 'true',
      explanation: 'Stack frames are deallocated upon function return.',
    },
    {
      id: 5,
      type: 'mcq',
      moduleTitle: 'Functions & Methods',
      prompt: 'What is a pure function in programming?',
      options: ['A function whose return value depends only on its arguments and has no side effects', 'A function written without comments', 'A function with no arguments', 'A function that returns null'],
      correctAnswer: 'A function whose return value depends only on its arguments and has no side effects',
      explanation: 'Pure functions produce identical outputs for identical inputs without mutating state.',
    },
    {
      id: 6,
      type: 'mcq',
      moduleTitle: 'Data Structures',
      prompt: 'What is the average time complexity for looking up an element by key in a Hash Map / Dictionary?',
      options: ['O(1)', 'O(n)', 'O(n^2)', 'O(log n)'],
      correctAnswer: 'O(1)',
      explanation: 'Hash tables offer O(1) constant average lookup time through hashing.',
    },
    {
      id: 7,
      type: 'true_false',
      moduleTitle: 'Error Handling',
      prompt: 'Using exception handling prevents programs from abruptly terminating on runtime faults.',
      options: ['true', 'false'],
      correctAnswer: 'true',
      explanation: 'Try-catch / try-except blocks catch exceptions and allow graceful recovery.',
    },
    {
      id: 8,
      type: 'mcq',
      moduleTitle: 'Object Oriented Programming',
      prompt: 'Which OOP principle hides the internal representation of an object from the outside world?',
      options: ['Encapsulation', 'Inheritance', 'Compilation', 'Recursion'],
      correctAnswer: 'Encapsulation',
      explanation: 'Encapsulation binds data and functions together, restricting direct outside access.',
    },
    {
      id: 9,
      type: 'mcq',
      moduleTitle: 'Algorithms',
      prompt: 'What algorithm strategy does Binary Search use to find an item in a sorted array?',
      options: ['Divide and Conquer (halving the search range each step)', 'Random selection', 'Checking every element sequentially', 'Sorting repeatedly'],
      correctAnswer: 'Divide and Conquer (halving the search range each step)',
      explanation: 'Binary Search halves the search space each step, achieving O(log n) time.',
    },
    {
      id: 10,
      type: 'fill_blank',
      moduleTitle: 'Best Practices',
      prompt: 'Writing clean, well-tested code helps avoid technical ______ in software projects.',
      options: [],
      correctAnswer: 'debt',
      explanation: 'Technical debt describes the implied cost of future reworking caused by choosing an easy solution now.',
    },
  ]

  return {
    attemptId: `local-attempt-${languageId}-${Date.now()}`,
    languageId,
    languageName: data.name,
    passingThreshold: 70,
    questions,
  }
}
