import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';
import { notifyProgressUpdate } from '../utils/events';

// ====================================================
// EXPANDED QUESTION POOL: BUG HUNT (20+ Rich Scenarios)
// ====================================================
const ALL_BUG_HUNT_ROUNDS = [
  {
    id: 'bh_py_1',
    language: 'python',
    title: 'Off-By-One List Slicing',
    lines: [
      'def get_first_three(items):',
      '    # We want only the first 3 elements (indices 0, 1, 2)',
      '    result = items[0:2]',
      '    return result'
    ],
    bugLineIndex: 2,
    fixExplanation: 'In Python, items[0:2] only takes 2 elements (0 and 1). Use items[0:3] to get 3 items!'
  },
  {
    id: 'bh_java_1',
    language: 'java',
    title: 'String Reference Comparison',
    lines: [
      'public boolean checkPass(String input, String expected) {',
      '    // Check if input matches expected password',
      '    if (input == expected) {',
      '        return true;',
      '    }',
      '    return false;',
      '}'
    ],
    bugLineIndex: 2,
    fixExplanation: 'In Java, `==` compares object memory references. Use `input.equals(expected)` for string value equality!'
  },
  {
    id: 'bh_cpp_1',
    language: 'cpp',
    title: 'Vector Out of Bounds Access',
    lines: [
      '#include <vector>',
      'int getLast(const std::vector<int>& vec) {',
      '    if (vec.empty()) return -1;',
      '    return vec[vec.size()];',
      '}'
    ],
    bugLineIndex: 3,
    fixExplanation: 'Vectors are 0-indexed. The last element is at `vec[vec.size() - 1]` or `vec.back()`!'
  },
  {
    id: 'bh_c_1',
    language: 'c',
    title: 'Dangling Pointer to Local Stack Array',
    lines: [
      '#include <stdlib.h>',
      'int* createArray(int size) {',
      '    int arr[size];',
      '    return arr;',
      '}'
    ],
    bugLineIndex: 3,
    fixExplanation: 'Returning a pointer to a stack-allocated local array leads to undefined behavior! Use `malloc()` on heap.'
  },
  {
    id: 'bh_py_2',
    language: 'python',
    title: 'Mutable Default Argument',
    lines: [
      'def append_item(element, target_list=[]):',
      '    target_list.append(element)',
      '    return target_list'
    ],
    bugLineIndex: 0,
    fixExplanation: 'Default arguments in Python are evaluated once at definition time. Use `target_list=None`.'
  },
  {
    id: 'bh_java_2',
    language: 'java',
    title: 'Integer Division Truncation',
    lines: [
      'public double calculateRatio(int count, int total) {',
      '    // Calculate percentage ratio as a decimal',
      '    double ratio = count / total;',
      '    return ratio;',
      '}'
    ],
    bugLineIndex: 2,
    fixExplanation: '`count / total` performs integer division (e.g. 1/2 = 0). Cast one operand: `(double) count / total`.'
  },
  {
    id: 'bh_cpp_2',
    language: 'cpp',
    title: 'Dangling Reference to Temporary Object',
    lines: [
      '#include <string>',
      'const std::string& getFormatted(int num) {',
      '    const std::string& s = std::to_string(num);',
      '    return s;',
      '}'
    ],
    bugLineIndex: 2,
    fixExplanation: '`std::to_string()` returns a temporary that is destroyed when the function returns! Return by value `std::string`.'
  },
  {
    id: 'bh_c_2',
    language: 'c',
    title: 'Missing Address-Of Operator in scanf',
    lines: [
      '#include <stdio.h>',
      'void readInput() {',
      '    int score;',
      '    scanf("%d", score);',
      '}'
    ],
    bugLineIndex: 3,
    fixExplanation: '`scanf` expects a pointer to store input into! It must be `scanf("%d", &score);`.'
  },
  {
    id: 'bh_py_3',
    language: 'python',
    title: 'Modifying Collection During Iteration',
    lines: [
      'def remove_negatives(numbers):',
      '    for num in numbers:',
      '        if num < 0:',
      '            numbers.remove(num)',
      '    return numbers'
    ],
    bugLineIndex: 1,
    fixExplanation: 'Modifying a list while iterating over it skips elements! Iterate over a copy `for num in numbers[:]:`.'
  },
  {
    id: 'bh_java_3',
    language: 'java',
    title: 'Missing Break in Switch Statement',
    lines: [
      'public String getDayType(int day) {',
      '    switch (day) {',
      '        case 1: return "Monday";',
      '        case 6: System.out.println("Weekend");',
      '        case 7: return "Sunday";',
      '        default: return "Weekday";',
      '    }',
      '}'
    ],
    bugLineIndex: 3,
    fixExplanation: 'Case 6 falls through into case 7 because it lacks a `return` or `break` statement!'
  },
  {
    id: 'bh_cpp_3',
    language: 'cpp',
    title: 'Pass-by-Value Copy Modification',
    lines: [
      '#include <vector>',
      'void doubleElements(std::vector<int> nums) {',
      '    for (int& x : nums) {',
      '        x *= 2;',
      '    }',
      '}'
    ],
    bugLineIndex: 1,
    fixExplanation: '`std::vector<int> nums` is passed by value (copied). Pass by reference `std::vector<int>& nums` to modify the caller’s vector!'
  },
  {
    id: 'bh_c_3',
    language: 'c',
    title: 'Buffer Overflow in String Allocation',
    lines: [
      '#include <stdlib.h>',
      '#include <string.h>',
      'char* copyString(const char* src) {',
      '    char* dest = (char*)malloc(strlen(src));',
      '    strcpy(dest, src);',
      '    return dest;',
      '}'
    ],
    bugLineIndex: 3,
    fixExplanation: '`strlen(src)` does NOT account for the null terminator `\\0`. Allocate `strlen(src) + 1` bytes!'
  },
  {
    id: 'bh_py_4',
    language: 'python',
    title: 'Missing Self Parameter in Class Method',
    lines: [
      'class User:',
      '    def __init__(self, name):',
      '        self.name = name',
      '    def get_display_name():',
      '        return f"User: {self.name}"'
    ],
    bugLineIndex: 3,
    fixExplanation: 'Instance methods in Python must accept `self` as the first argument: `def get_display_name(self):`.'
  },
  {
    id: 'bh_java_4',
    language: 'java',
    title: 'Array Index Length Out of Bounds',
    lines: [
      'public int findMax(int[] arr) {',
      '    int max = arr[0];',
      '    for (int i = 0; i <= arr.length; i++) {',
      '        if (arr[i] > max) max = arr[i];',
      '    }',
      '    return max;',
      '}'
    ],
    bugLineIndex: 2,
    fixExplanation: '`i <= arr.length` causes an `ArrayIndexOutOfBoundsException` on the last iteration. Use `i < arr.length`!'
  },
  {
    id: 'bh_c_4',
    language: 'c',
    title: 'sizeof Pointer Decay in Function Parameter',
    lines: [
      '#include <stdio.h>',
      'int arraySum(int arr[10]) {',
      '    int count = sizeof(arr) / sizeof(arr[0]);',
      '    return count;',
      '}'
    ],
    bugLineIndex: 2,
    fixExplanation: 'Array parameters decay to pointers in C functions, so `sizeof(arr)` is the size of `int*` (4 or 8 bytes), not the array length!'
  }
];

// ====================================================
// EXPANDED QUESTION POOL: OUTPUT ORACLE (25+ Questions)
// ====================================================
const ALL_OUTPUT_QUESTIONS = [
  {
    id: 'oo_py_1',
    language: 'python',
    code: 'x = [1, 2, 3]\ny = x\ny.append(4)\nprint(len(x))',
    options: ['4', '3', 'TypeError', 'None'],
    correct: '4',
    explanation: 'Lists are passed by reference in Python. Modifying `y` mutates the same underlying list object as `x`.'
  },
  {
    id: 'oo_java_1',
    language: 'java',
    code: 'System.out.println(10 + 20 + "30");',
    options: ['3030', '102030', '60', 'Error'],
    correct: '3030',
    explanation: 'Java evaluates left-to-right: 10 + 20 = 30 (int addition), then 30 + "30" = "3030" (string concatenation).'
  },
  {
    id: 'oo_java_2',
    language: 'java',
    code: 'System.out.println("30" + 10 + 20);',
    options: ['301020', '3030', '60', 'Error'],
    correct: '301020',
    explanation: '"30" + 10 becomes "3010", then "3010" + 20 becomes "301020" due to string concatenation.'
  },
  {
    id: 'oo_cpp_1',
    language: 'cpp',
    code: 'int a = 5;\nint b = a++;\nstd::cout << b << " " << a;',
    options: ['5 6', '6 6', '5 5', '6 5'],
    correct: '5 6',
    explanation: 'Post-increment `a++` assigns the initial value (5) to `b` before `a` becomes 6.'
  },
  {
    id: 'oo_cpp_2',
    language: 'cpp',
    code: 'int a = 5;\nint b = ++a;\nstd::cout << b << " " << a;',
    options: ['6 6', '5 6', '5 5', '6 5'],
    correct: '6 6',
    explanation: 'Pre-increment `++a` increments `a` to 6 first, then assigns 6 to `b`.'
  },
  {
    id: 'oo_c_1',
    language: 'c',
    code: 'int arr[] = {10, 20, 30};\nint *p = arr;\nprintf("%d", *(p + 1));',
    options: ['20', '10', '30', 'Address'],
    correct: '20',
    explanation: '`*(p + 1)` dereferences the pointer stepped forward by 1 integer, which is `arr[1]` (20).'
  },
  {
    id: 'oo_py_2',
    language: 'python',
    code: 'print(bool("False"), bool(""))',
    options: ['True False', 'False False', 'True True', 'False True'],
    correct: 'True False',
    explanation: 'Any non-empty string in Python is truthy, including "False". Only empty string "" is falsy.'
  },
  {
    id: 'oo_py_3',
    language: 'python',
    code: 'a = [1, 2]\nb = a * 2\nprint(b)',
    options: ['[1, 2, 1, 2]', '[2, 4]', '[[1, 2], [1, 2]]', 'Error'],
    correct: '[1, 2, 1, 2]',
    explanation: 'Multiplying a Python list by an integer duplicates its sequence: `[1, 2] * 2` yields `[1, 2, 1, 2]`.'
  },
  {
    id: 'oo_java_3',
    language: 'java',
    code: 'String s1 = "code";\nString s2 = "code";\nSystem.out.println(s1 == s2);',
    options: ['true', 'false', 'Error', 'NullPointerException'],
    correct: 'true',
    explanation: 'String literals are stored in the String Constant Pool and reuse the identical instance in memory.'
  },
  {
    id: 'oo_java_4',
    language: 'java',
    code: 'String s1 = new String("code");\nString s2 = new String("code");\nSystem.out.println(s1 == s2);',
    options: ['false', 'true', 'Error', 'NullPointerException'],
    correct: 'false',
    explanation: 'The `new` keyword explicitly allocates separate objects on the heap, so `s1 == s2` evaluates to false.'
  },
  {
    id: 'oo_cpp_3',
    language: 'cpp',
    code: 'int x = 10;\nint& ref = x;\nref += 5;\nstd::cout << x;',
    options: ['15', '10', '5', 'Error'],
    correct: '15',
    explanation: '`ref` is an alias for `x`. Modifying `ref` directly changes the value of `x` to 15.'
  },
  {
    id: 'oo_c_2',
    language: 'c',
    code: 'printf("%d", 5 / 2);',
    options: ['2', '2.5', '2.0', '3'],
    correct: '2',
    explanation: 'Integer division in C discards the fractional part (truncates towards zero), producing 2.'
  },
  {
    id: 'oo_c_3',
    language: 'c',
    code: 'int x = 5;\nprintf("%d", x ^ x);',
    options: ['0', '5', '1', '10'],
    correct: '0',
    explanation: 'Bitwise XOR (`^`) of any integer with itself produces 0.'
  },
  {
    id: 'oo_py_4',
    language: 'python',
    code: 'data = {1, 1.0, "1", True}\nprint(len(data))',
    options: ['2', '4', '3', '1'],
    correct: '2',
    explanation: 'In Python, `1 == 1.0 == True` and their hash values match! The set only keeps `1` and `"1"`, so length is 2.'
  },
  {
    id: 'oo_py_5',
    language: 'python',
    code: 's = "CodePath"\nprint(s[::-1][0:4])',
    options: ['htaP', 'Path', 'edoC', 'htap'],
    correct: 'htaP',
    explanation: '`s[::-1]` reverses the string into `"htaPedoC"`, and `[0:4]` takes the first 4 characters: `"htaP"`.'
  },
  {
    id: 'oo_cpp_4',
    language: 'cpp',
    code: 'int a = 0;\nif (0 && ++a) {}\nstd::cout << a;',
    options: ['0', '1', 'Undefined', 'Error'],
    correct: '0',
    explanation: 'Short-circuit evaluation stops at the first `false` in an `&&` expression, so `++a` is never executed.'
  },
  {
    id: 'oo_java_5',
    language: 'java',
    code: 'System.out.println(true ? 1 : 2.0);',
    options: ['1.0', '1', '2.0', 'Error'],
    correct: '1.0',
    explanation: 'Ternary operator performs numeric type promotion: the int `1` is promoted to double `1.0`.'
  },
  {
    id: 'oo_c_4',
    language: 'c',
    code: 'char c = \'A\' + 3;\nprintf("%c", c);',
    options: ['D', 'A', '3', '68'],
    correct: 'D',
    explanation: 'Character arithmetic in C adds ASCII values: \'A\' (65) + 3 = 68, which corresponds to character \'D\'.'
  }
];

// ====================================================
// EXPANDED QUESTION POOL: CODE ASSEMBLER (8+ Puzzles)
// ====================================================
const ALL_ASSEMBLER_PUZZLES = [
  {
    id: 'asm_py_pal',
    language: 'python',
    title: 'Palindrome Checker Function',
    goal: 'Assemble a function that checks if a string reads the same forwards and backwards.',
    scrambledBlocks: [
      { id: '1', text: 'def is_palindrome(text):' },
      { id: '2', text: '    clean = text.lower().replace(" ", "")' },
      { id: '3', text: '    return clean == clean[::-1]' }
    ],
    correctOrder: ['1', '2', '3']
  },
  {
    id: 'asm_java_fact',
    language: 'java',
    title: 'Recursive Factorial in Java',
    goal: 'Assemble a recursive factorial method with base case.',
    scrambledBlocks: [
      { id: '1', text: 'public static int factorial(int n) {' },
      { id: '2', text: '    if (n <= 1) return 1;' },
      { id: '3', text: '    return n * factorial(n - 1);' },
      { id: '4', text: '}' }
    ],
    correctOrder: ['1', '2', '3', '4']
  },
  {
    id: 'asm_cpp_swap',
    language: 'cpp',
    title: 'Pointer Swap Function in C++',
    goal: 'Assemble a function to swap two integers using pointers.',
    scrambledBlocks: [
      { id: '1', text: 'void swap(int* a, int* b) {' },
      { id: '2', text: '    int temp = *a;' },
      { id: '3', text: '    *a = *b;' },
      { id: '4', text: '    *b = temp;' },
      { id: '5', text: '}' }
    ],
    correctOrder: ['1', '2', '3', '4', '5']
  },
  {
    id: 'asm_py_fib',
    language: 'python',
    title: 'Iterative Fibonacci Generator',
    goal: 'Assemble an iterative function that computes the nth Fibonacci number.',
    scrambledBlocks: [
      { id: '1', text: 'def fibonacci(n):' },
      { id: '2', text: '    a, b = 0, 1' },
      { id: '3', text: '    for _ in range(n):' },
      { id: '4', text: '        a, b = b, a + b' },
      { id: '5', text: '    return a' }
    ],
    correctOrder: ['1', '2', '3', '4', '5']
  },
  {
    id: 'asm_c_rev',
    language: 'c',
    title: 'String Length Counter in C',
    goal: 'Assemble a function that calculates the length of a null-terminated C string.',
    scrambledBlocks: [
      { id: '1', text: 'int my_strlen(const char* str) {' },
      { id: '2', text: '    int len = 0;' },
      { id: '3', text: '    while (str[len] != \'\\0\') {' },
      { id: '4', text: '        len++;' },
      { id: '5', text: '    }' },
      { id: '6', text: '    return len;' },
      { id: '7', text: '}' }
    ],
    correctOrder: ['1', '2', '3', '4', '5', '6', '7']
  },
  {
    id: 'asm_java_max',
    language: 'java',
    title: 'Find Maximum in Array',
    goal: 'Assemble a method to find the maximum integer in an array.',
    scrambledBlocks: [
      { id: '1', text: 'public static int findMax(int[] arr) {' },
      { id: '2', text: '    int max = arr[0];' },
      { id: '3', text: '    for (int i = 1; i < arr.length; i++) {' },
      { id: '4', text: '        if (arr[i] > max) max = arr[i];' },
      { id: '5', text: '    }' },
      { id: '6', text: '    return max;' },
      { id: '7', text: '}' }
    ],
    correctOrder: ['1', '2', '3', '4', '5', '6', '7']
  },
  {
    id: 'asm_cpp_bin',
    language: 'cpp',
    title: 'Binary Search Implementation',
    goal: 'Assemble a binary search algorithm in C++.',
    scrambledBlocks: [
      { id: '1', text: 'int binarySearch(const std::vector<int>& arr, int target) {' },
      { id: '2', text: '    int low = 0, high = arr.size() - 1;' },
      { id: '3', text: '    while (low <= high) {' },
      { id: '4', text: '        int mid = low + (high - low) / 2;' },
      { id: '5', text: '        if (arr[mid] == target) return mid;' },
      { id: '6', text: '        if (arr[mid] < target) low = mid + 1;' },
      { id: '7', text: '        else high = mid - 1;' },
      { id: '8', text: '    }' },
      { id: '9', text: '    return -1;' },
      { id: '10', text: '}' }
    ],
    correctOrder: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']
  }
];

// Helper: Shuffle array randomly
function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function Arcade() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [activeGame, setActiveGame] = useState(null); // 'bug_hunt' | 'output_oracle' | 'assembler' | null
  const [stats, setStats] = useState({
    totalXp: 0,
    userLevel: 1,
    highScores: { bugHunt: 0, outputOracle: 0, codeAssembler: 0 },
    gamesPlayed: 0
  });
  const [leaderboard, setLeaderboard] = useState([]);
  const [tab, setTab] = useState('games'); // 'games' | 'leaderboard'
  const [lastGameResult, setLastGameResult] = useState(null);

  useEffect(() => {
    loadLocalAndServerStats();
    fetchLeaderboard();
  }, [user]);

  const loadLocalAndServerStats = async () => {
    try {
      const local = JSON.parse(localStorage.getItem('codepath_arcade_stats') || '{}');
      if (local && local.totalXp) {
        setStats(prev => ({ ...prev, ...local }));
      }
    } catch (e) {}

    if (user) {
      try {
        const res = await client.get('/arcade/stats');
        if (res.data) {
          setStats(res.data);
          localStorage.setItem('codepath_arcade_stats', JSON.stringify(res.data));
        }
      } catch (e) {
        console.error('Error fetching server arcade stats:', e);
      }
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const res = await client.get('/arcade/leaderboard');
      setLeaderboard(res.data || []);
    } catch (e) {
      console.error(e);
    }
  };

  const handleScoreSubmit = async (gameType, score, xp) => {
    const gameKey = gameType === 'bug_hunt' ? 'bugHunt' : gameType === 'output_oracle' ? 'outputOracle' : 'codeAssembler';

    setStats(prev => {
      const newTotalXp = (prev.totalXp || 0) + xp;
      const newLevel = Math.floor(newTotalXp / 250) + 1;
      const prevBest = prev.highScores?.[gameKey] || 0;
      const newHighScores = {
        ...(prev.highScores || {}),
        [gameKey]: Math.max(prevBest, score)
      };

      const updated = {
        totalXp: newTotalXp,
        userLevel: newLevel,
        highScores: newHighScores,
        gamesPlayed: (prev.gamesPlayed || 0) + 1
      };

      localStorage.setItem('codepath_arcade_stats', JSON.stringify(updated));
      return updated;
    });

    setLastGameResult({ gameType, score, xpEarned: xp });

    if (user) {
      try {
        await client.post('/arcade/submit-score', { gameType, score, xpEarned: xp });
        notifyProgressUpdate();
        fetchLeaderboard();
      } catch (err) {
        console.error('Failed to submit score to backend:', err);
      }
    }
  };

  const handleExitGame = () => {
    setActiveGame(null);
    setTab('games');
    loadLocalAndServerStats();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 md:p-10">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header with Arcade Level and XP */}
        <div className="border-b border-slate-800 pb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-3xl animate-float">🕹️</span>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white flex items-center gap-2">
                CodePath <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">Arcade</span>
              </h1>
            </div>
            <p className="text-slate-400 text-sm">Fresh, dynamic microlearning mini-games with randomized challenges every run!</p>
          </div>

          {/* User Level & XP Banner */}
          <div className="flex items-center gap-4 bg-slate-900/90 border border-slate-800 p-3.5 rounded-2xl shadow-xl">
            <div className="text-center px-2">
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Level</p>
              <p className="text-2xl font-black text-emerald-400">Lv {stats.userLevel || 1}</p>
            </div>
            <div className="h-8 w-px bg-slate-800" />
            <div className="text-center px-2">
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Arcade XP</p>
              <p className="text-xl font-bold text-amber-400">⚡ {stats.totalXp || 0} XP</p>
            </div>
          </div>
        </div>

        {/* Tab Selector (Games vs Arcade Leaderboard) */}
        {!activeGame && (
          <div className="flex gap-2">
            <button
              onClick={() => setTab('games')}
              className={`px-5 py-2.5 rounded-xl font-bold text-sm transition cursor-pointer flex items-center gap-2 ${
                tab === 'games'
                  ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              🎮 Mini-Games Hub
            </button>
            <button
              onClick={() => setTab('leaderboard')}
              className={`px-5 py-2.5 rounded-xl font-bold text-sm transition cursor-pointer flex items-center gap-2 ${
                tab === 'leaderboard'
                  ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              🏆 Arcade High Scores
            </button>
          </div>
        )}

        {/* --- SCREEN: GAME CARDS (MAIN HUB) --- */}
        {!activeGame && tab === 'games' && (
          <div className="space-y-6 animate-fade-in-up">
            
            {/* Last Game Result Toast */}
            {lastGameResult && (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-between gap-4 animate-fade-in-up">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🎉</span>
                  <div>
                    <p className="text-sm font-bold text-emerald-400">Game Completed Successfully!</p>
                    <p className="text-xs text-slate-300">
                      Score: <strong>{lastGameResult.score} pts</strong> · Earned <strong>+{lastGameResult.xpEarned} XP</strong>
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setLastGameResult(null)}
                  className="text-xs text-slate-400 hover:text-white px-2 py-1 bg-slate-800 rounded-lg cursor-pointer"
                >
                  Dismiss ✕
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Game 1: Speed Bug Hunt */}
              <div className="card p-6 bg-gradient-to-b from-slate-900 to-slate-900/40 border border-slate-800 hover:border-red-500/50 transition-all flex flex-col justify-between group hover:shadow-2xl hover:shadow-red-500/10">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-4xl p-3 bg-red-500/10 border border-red-500/20 rounded-2xl group-hover:scale-110 transition-transform">
                      🐛
                    </span>
                    <span className="text-[10px] uppercase font-bold text-red-400 bg-red-500/10 px-2.5 py-1 rounded-full border border-red-500/20">
                      5 Dynamic Bugs · 20s
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white group-hover:text-red-400 transition-colors">Speed Bug Hunt</h3>
                  <p className="text-slate-400 text-xs mt-2 leading-relaxed">
                    Spot the exact syntax or logic bug in dynamically generated code snippets before the timer expires. Click the buggy line to score!
                  </p>
                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-slate-400">High Score:</span>
                    <span className="font-bold text-amber-400">{stats.highScores?.bugHunt || 0} pts</span>
                  </div>
                </div>
                <button
                  onClick={() => setActiveGame('bug_hunt')}
                  className="mt-6 w-full py-3 bg-red-500 hover:bg-red-400 text-slate-950 font-bold text-sm rounded-xl transition shadow-lg shadow-red-500/20 cursor-pointer"
                >
                  Start Bug Hunt 🚀
                </button>
              </div>

              {/* Game 2: Output Oracle */}
              <div className="card p-6 bg-gradient-to-b from-slate-900 to-slate-900/40 border border-slate-800 hover:border-purple-500/50 transition-all flex flex-col justify-between group hover:shadow-2xl hover:shadow-purple-500/10">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-4xl p-3 bg-purple-500/10 border border-purple-500/20 rounded-2xl group-hover:scale-110 transition-transform">
                      🔮
                    </span>
                    <span className="text-[10px] uppercase font-bold text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-full border border-purple-500/20">
                      6 Random Questions · Blitz
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors">Output Oracle</h3>
                  <p className="text-slate-400 text-xs mt-2 leading-relaxed">
                    Fast-paced 45s blitz! Guess the exact stdout output of shuffled tricky questions across Python, Java, C++, and C.
                  </p>
                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-slate-400">High Score:</span>
                    <span className="font-bold text-amber-400">{stats.highScores?.outputOracle || 0} pts</span>
                  </div>
                </div>
                <button
                  onClick={() => setActiveGame('output_oracle')}
                  className="mt-6 w-full py-3 bg-purple-500 hover:bg-purple-400 text-white font-bold text-sm rounded-xl transition shadow-lg shadow-purple-500/20 cursor-pointer"
                >
                  Start Output Oracle ⚡
                </button>
              </div>

              {/* Game 3: Code Block Assembler */}
              <div className="card p-6 bg-gradient-to-b from-slate-900 to-slate-900/40 border border-slate-800 hover:border-cyan-500/50 transition-all flex flex-col justify-between group hover:shadow-2xl hover:shadow-cyan-500/10">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-4xl p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl group-hover:scale-110 transition-transform">
                      🧩
                    </span>
                    <span className="text-[10px] uppercase font-bold text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-full border border-cyan-500/20">
                      3 Random Puzzles · Logic
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">Block Assembler</h3>
                  <p className="text-slate-400 text-xs mt-2 leading-relaxed">
                    Solve Parsons algorithm puzzles! Reorder scrambled lines of code to form correct, executable algorithm sequences.
                  </p>
                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-slate-400">High Score:</span>
                    <span className="font-bold text-amber-400">{stats.highScores?.codeAssembler || 0} pts</span>
                  </div>
                </div>
                <button
                  onClick={() => setActiveGame('assembler')}
                  className="mt-6 w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm rounded-xl transition shadow-lg shadow-cyan-500/20 cursor-pointer"
                >
                  Start Assembler 🧩
                </button>
              </div>

            </div>
          </div>
        )}

        {/* --- SCREEN: ARCADE LEADERBOARD --- */}
        {!activeGame && tab === 'leaderboard' && (
          <div className="card p-6 border border-slate-800 animate-fade-in-up">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              🏆 Global Arcade Leaders
            </h3>
            {leaderboard.length > 0 ? (
              <div className="space-y-2">
                {leaderboard.map((player) => (
                  <div
                    key={player.userId}
                    className="flex items-center justify-between p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                        player.rank === 1 ? 'bg-amber-400 text-slate-950' :
                        player.rank === 2 ? 'bg-slate-300 text-slate-950' :
                        player.rank === 3 ? 'bg-amber-700 text-white' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {player.rank <= 3 ? ['🥇', '🥈', '🥉'][player.rank - 1] : `#${player.rank}`}
                      </span>
                      <div>
                        <p className="text-sm font-bold text-white capitalize">{player.name}</p>
                        <p className="text-xs text-slate-400">Level {player.level} · {player.gamesPlayed} games played</p>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-amber-400">⚡ {player.totalXp} XP</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-slate-400 py-8">Play any mini-game to record the first high score!</p>
            )}
          </div>
        )}

        {/* --- ACTIVE GAME 1: BUG HUNT --- */}
        {activeGame === 'bug_hunt' && (
          <BugHuntGame
            onExit={handleExitGame}
            onSubmitScore={(score, xp) => handleScoreSubmit('bug_hunt', score, xp)}
          />
        )}

        {/* --- ACTIVE GAME 2: OUTPUT ORACLE --- */}
        {activeGame === 'output_oracle' && (
          <OutputOracleGame
            onExit={handleExitGame}
            onSubmitScore={(score, xp) => handleScoreSubmit('output_oracle', score, xp)}
          />
        )}

        {/* --- ACTIVE GAME 3: CODE ASSEMBLER --- */}
        {activeGame === 'assembler' && (
          <CodeAssemblerGame
            onExit={handleExitGame}
            onSubmitScore={(score, xp) => handleScoreSubmit('code_assembler', score, xp)}
          />
        )}

      </div>
    </div>
  );
}

// ----------------------------------------------------
// SUB-GAME 1: BUG HUNT COMPONENT (Dynamic 5 Rounds)
// ----------------------------------------------------
function BugHuntGame({ onExit, onSubmitScore }) {
  const [rounds, setRounds] = useState([]);
  const [roundIdx, setRoundIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [hearts, setHearts] = useState(3);
  const [timeLeft, setTimeLeft] = useState(20);
  const [selectedLine, setSelectedLine] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [gameOver, setGameOver] = useState(false);

  // Initialize with a fresh randomized selection of 5 rounds every play session
  useEffect(() => {
    const freshSelection = shuffle(ALL_BUG_HUNT_ROUNDS).slice(0, 5);
    setRounds(freshSelection);
    setRoundIdx(0);
    setScore(0);
    setHearts(3);
    setTimeLeft(20);
    setFeedback(null);
    setGameOver(false);
  }, []);

  const currentRound = rounds[roundIdx] || ALL_BUG_HUNT_ROUNDS[0];

  useEffect(() => {
    if (gameOver || feedback || rounds.length === 0) return;
    if (timeLeft <= 0) {
      handleTimeout();
      return;
    }
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, gameOver, feedback, rounds]);

  const handleTimeout = () => {
    const nextH = hearts - 1;
    setHearts(nextH);
    if (nextH <= 0) {
      endGame(score);
    } else {
      setFeedback({
        isCorrect: false,
        explanation: `⏰ Time's up! The bug was on line ${currentRound.bugLineIndex + 1}: ${currentRound.fixExplanation}`
      });
    }
  };

  const handleLineClick = (idx) => {
    if (feedback || gameOver) return;
    setSelectedLine(idx);

    if (idx === currentRound.bugLineIndex) {
      const addedScore = 100 + timeLeft * 5;
      const newScore = score + addedScore;
      setScore(newScore);
      setFeedback({
        isCorrect: true,
        explanation: `🎯 Bingo! Line ${idx + 1} was buggy! ${currentRound.fixExplanation}`
      });
    } else {
      const nextHearts = hearts - 1;
      setHearts(nextHearts);
      if (nextHearts <= 0) {
        endGame(score);
      } else {
        setFeedback({
          isCorrect: false,
          explanation: `❌ Line ${idx + 1} is valid! The bug was on line ${currentRound.bugLineIndex + 1}: ${currentRound.fixExplanation}`
        });
      }
    }
  };

  const handleNextRound = () => {
    setFeedback(null);
    setSelectedLine(null);
    setTimeLeft(20);

    if (roundIdx + 1 < rounds.length) {
      setRoundIdx((r) => r + 1);
    } else {
      endGame(score + 100);
    }
  };

  const endGame = (finalScore) => {
    setGameOver(true);
    const xp = Math.round(finalScore * 1.5);
    onSubmitScore(finalScore, xp);
  };

  const restartWithNewQuestions = () => {
    const fresh = shuffle(ALL_BUG_HUNT_ROUNDS).slice(0, 5);
    setRounds(fresh);
    setRoundIdx(0);
    setScore(0);
    setHearts(3);
    setTimeLeft(20);
    setFeedback(null);
    setSelectedLine(null);
    setGameOver(false);
  };

  if (gameOver) {
    const isVictory = hearts > 0;
    return (
      <div className="card p-8 text-center max-w-lg mx-auto space-y-6 animate-fade-in-up border border-slate-800 shadow-2xl">
        <span className="text-6xl block animate-bounce">{isVictory ? '🏆' : '💀'}</span>
        <div>
          <h2 className="text-2xl font-black text-white">
            {isVictory ? 'Bug Hunt Cleared!' : 'Out of Hearts!'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {isVictory ? 'You spotted all software bugs in record time!' : 'Keep practicing to master your debugging reflexes!'}
          </p>
        </div>

        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 grid grid-cols-2 gap-4">
          <div className="text-center">
            <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Final Score</p>
            <p className="text-3xl font-black text-emerald-400 mt-1">{score} pts</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">XP Earned</p>
            <p className="text-3xl font-black text-amber-400 mt-1">+{Math.round(score * 1.5)} XP</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={onExit}
            className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm rounded-xl transition shadow-lg shadow-emerald-500/20 cursor-pointer"
          >
            ⬅️ Return to Arcade Hub
          </button>
          <button
            onClick={restartWithNewQuestions}
            className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm rounded-xl transition border border-slate-700 cursor-pointer"
          >
            New Questions 🔄
          </button>
        </div>
      </div>
    );
  }

  if (rounds.length === 0) return null;

  return (
    <div className="card p-6 border border-slate-800 space-y-6 animate-fade-in-up">
      {/* Game status bar */}
      <div className="flex justify-between items-center border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <button onClick={onExit} className="text-xs text-slate-400 hover:text-white px-3 py-1.5 bg-slate-800 rounded-lg cursor-pointer transition">
            ← Exit Game
          </button>
          <span className="text-sm font-bold text-white">Round {roundIdx + 1} of {rounds.length}</span>
          <span className="text-xs uppercase font-semibold px-2 py-0.5 rounded bg-slate-800 text-emerald-400">
            {currentRound.language.toUpperCase()}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-lg">
            {'❤️'.repeat(Math.max(0, hearts))}
            {'🖤'.repeat(Math.max(0, 3 - hearts))}
          </div>
          <div className="text-sm font-mono font-bold text-amber-400">
            ⏱️ {timeLeft}s
          </div>
          <div className="text-sm font-bold text-emerald-400">
            Score: {score}
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold text-white mb-1">Click the line that has the BUG! 🎯</h3>
        <p className="text-xs text-slate-400">Scenario: {currentRound.title}</p>
      </div>

      {/* Code Snippet with Clickable Lines */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden font-mono text-sm">
        {currentRound.lines.map((line, idx) => {
          let lineStyle = 'hover:bg-slate-900 border-l-4 border-transparent';
          if (feedback) {
            if (idx === currentRound.bugLineIndex) {
              lineStyle = 'bg-red-500/20 border-l-4 border-red-500 text-red-200';
            } else if (selectedLine === idx) {
              lineStyle = 'bg-slate-800 border-l-4 border-slate-600 opacity-60';
            }
          }

          return (
            <div
              key={idx}
              onClick={() => handleLineClick(idx)}
              className={`px-4 py-2.5 flex items-center gap-4 cursor-pointer transition-colors ${lineStyle}`}
            >
              <span className="text-slate-600 select-none w-6 text-right text-xs">{idx + 1}</span>
              <span className="text-slate-200">{line}</span>
            </div>
          );
        })}
      </div>

      {/* Feedback Panel */}
      {feedback && (
        <div className={`p-4 rounded-xl border animate-fade-in-up ${
          feedback.isCorrect ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300' : 'bg-red-500/10 border-red-500/40 text-red-300'
        }`}>
          <p className="text-sm font-medium">{feedback.explanation}</p>
          <button
            onClick={handleNextRound}
            className="mt-3 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition cursor-pointer shadow-md shadow-emerald-500/20"
          >
            {roundIdx + 1 < rounds.length ? 'Next Bug →' : 'View Final Score 🎉'}
          </button>
        </div>
      )}
    </div>
  );
}

// ----------------------------------------------------
// SUB-GAME 2: OUTPUT ORACLE COMPONENT (Dynamic 6 Questions)
// ----------------------------------------------------
function OutputOracleGame({ onExit, onSubmitScore }) {
  const [questions, setQuestions] = useState([]);
  const [qIdx, setQIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(45);
  const [gameOver, setGameOver] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [correctCount, setCorrectCount] = useState(0);

  // Initialize with a fresh randomized selection of 6 questions with shuffled options
  useEffect(() => {
    const fresh = shuffle(ALL_OUTPUT_QUESTIONS).slice(0, 6).map(q => ({
      ...q,
      shuffledOptions: shuffle(q.options)
    }));
    setQuestions(fresh);
    setQIdx(0);
    setScore(0);
    setTimeLeft(45);
    setGameOver(false);
    setFeedback(null);
    setCorrectCount(0);
  }, []);

  const currentQ = questions[qIdx] || ALL_OUTPUT_QUESTIONS[0];

  useEffect(() => {
    if (gameOver || questions.length === 0) return;
    if (timeLeft <= 0) {
      endGame(score);
      return;
    }
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, gameOver, questions]);

  const handleAnswer = (choice) => {
    if (feedback) return;
    const isCorrect = choice === currentQ.correct;

    if (isCorrect) {
      const added = 50 + Math.floor(timeLeft / 2);
      const newScore = score + added;
      setScore(newScore);
      setCorrectCount(c => c + 1);
      setFeedback({ isCorrect: true, text: `✅ Correct! (+${added} pts) ${currentQ.explanation}` });
    } else {
      setFeedback({ isCorrect: false, text: `❌ Incorrect! Output is "${currentQ.correct}". ${currentQ.explanation}` });
    }

    setTimeout(() => {
      setFeedback(null);
      if (qIdx + 1 < questions.length) {
        setQIdx((q) => q + 1);
      } else {
        endGame(score + (isCorrect ? 50 : 0));
      }
    }, 1400);
  };

  const endGame = (finalScore) => {
    setGameOver(true);
    const xp = Math.round(finalScore * 1.5);
    onSubmitScore(finalScore, xp);
  };

  const restartWithNewQuestions = () => {
    const fresh = shuffle(ALL_OUTPUT_QUESTIONS).slice(0, 6).map(q => ({
      ...q,
      shuffledOptions: shuffle(q.options)
    }));
    setQuestions(fresh);
    setQIdx(0);
    setScore(0);
    setTimeLeft(45);
    setFeedback(null);
    setGameOver(false);
    setCorrectCount(0);
  };

  if (gameOver) {
    return (
      <div className="card p-8 text-center max-w-lg mx-auto space-y-6 animate-fade-in-up border border-slate-800 shadow-2xl">
        <span className="text-6xl block animate-bounce">🔮</span>
        <div>
          <h2 className="text-2xl font-black text-white">Output Oracle Complete!</h2>
          <p className="text-xs text-slate-400 mt-1">
            Answered {correctCount} of {questions.length} questions correctly!
          </p>
        </div>

        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 grid grid-cols-2 gap-4">
          <div className="text-center">
            <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Total Score</p>
            <p className="text-3xl font-black text-purple-400 mt-1">{score} pts</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">XP Earned</p>
            <p className="text-3xl font-black text-amber-400 mt-1">+{Math.round(score * 1.5)} XP</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={onExit}
            className="w-full py-3 bg-purple-500 hover:bg-purple-400 text-white font-extrabold text-sm rounded-xl transition shadow-lg shadow-purple-500/20 cursor-pointer"
          >
            ⬅️ Return to Arcade Hub
          </button>
          <button
            onClick={restartWithNewQuestions}
            className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm rounded-xl transition border border-slate-700 cursor-pointer"
          >
            New Questions 🔄
          </button>
        </div>
      </div>
    );
  }

  if (questions.length === 0) return null;

  return (
    <div className="card p-6 border border-slate-800 space-y-6 animate-fade-in-up">
      {/* Status Bar */}
      <div className="flex justify-between items-center border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <button onClick={onExit} className="text-xs text-slate-400 hover:text-white px-3 py-1.5 bg-slate-800 rounded-lg cursor-pointer transition">
            ← Exit Game
          </button>
          <span className="text-sm font-bold text-white">Question {qIdx + 1} of {questions.length}</span>
          <span className="text-xs uppercase font-semibold px-2 py-0.5 rounded bg-slate-800 text-purple-400">
            {currentQ.language.toUpperCase()}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-sm font-mono font-bold text-amber-400">
            ⏱️ {timeLeft}s Left
          </div>
          <div className="text-sm font-bold text-purple-400">
            Score: {score}
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold text-white mb-2">What will this code print to standard output? 🖥️</h3>
        <pre className="p-4 bg-slate-950 border border-slate-800 rounded-xl font-mono text-sm text-emerald-300 overflow-x-auto">
          <code>{currentQ.code}</code>
        </pre>
      </div>

      {/* Multiple Choice Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {(currentQ.shuffledOptions || currentQ.options).map((opt, i) => (
          <button
            key={i}
            onClick={() => handleAnswer(opt)}
            disabled={Boolean(feedback)}
            className="p-4 bg-slate-900/90 hover:bg-purple-500/20 border border-slate-800 hover:border-purple-500/50 rounded-xl text-left font-mono text-sm text-white transition cursor-pointer"
          >
            {opt}
          </button>
        ))}
      </div>

      {/* Answer Feedback Toast */}
      {feedback && (
        <div className={`p-3.5 rounded-xl border animate-fade-in-up ${
          feedback.isCorrect ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300' : 'bg-red-500/10 border-red-500/40 text-red-300'
        }`}>
          <p className="text-sm font-medium">{feedback.text}</p>
        </div>
      )}
    </div>
  );
}

// ----------------------------------------------------
// SUB-GAME 3: CODE BLOCK ASSEMBLER (Dynamic 3 Puzzles)
// ----------------------------------------------------
function CodeAssemblerGame({ onExit, onSubmitScore }) {
  const [puzzles, setPuzzles] = useState([]);
  const [puzzleIdx, setPuzzleIdx] = useState(0);
  const [blocks, setBlocks] = useState([]);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [gameWon, setGameWon] = useState(false);

  // Initialize with a fresh randomized selection of 3 puzzles on game start
  useEffect(() => {
    const fresh = shuffle(ALL_ASSEMBLER_PUZZLES).slice(0, 3);
    setPuzzles(fresh);
    setPuzzleIdx(0);
    setScore(0);
    setFeedback(null);
    setGameWon(false);
  }, []);

  const currentPuzzle = puzzles[puzzleIdx] || ALL_ASSEMBLER_PUZZLES[0];

  useEffect(() => {
    if (!currentPuzzle) return;
    const shuffled = shuffle(currentPuzzle.scrambledBlocks);
    setBlocks(shuffled);
    setFeedback(null);
  }, [puzzleIdx, puzzles]);

  const moveBlock = (index, direction) => {
    if (feedback?.isCorrect) return;
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= blocks.length) return;

    const newBlocks = [...blocks];
    const temp = newBlocks[index];
    newBlocks[index] = newBlocks[targetIndex];
    newBlocks[targetIndex] = temp;
    setBlocks(newBlocks);
  };

  const handleVerifyOrder = () => {
    const currentOrder = blocks.map((b) => b.id);
    const isCorrect = currentOrder.every((id, idx) => id === currentPuzzle.correctOrder[idx]);

    if (isCorrect) {
      const addedScore = 150;
      setScore((s) => s + addedScore);
      setFeedback({ isCorrect: true, text: '🎉 Perfect Logic! The algorithm is assembled in the exact right execution sequence!' });
    } else {
      setFeedback({ isCorrect: false, text: '❌ Logic order incorrect. Check the dependencies between statements!' });
    }
  };

  const handleNextPuzzle = () => {
    if (puzzleIdx + 1 < puzzles.length) {
      setPuzzleIdx((p) => p + 1);
    } else {
      setGameWon(true);
      const finalScore = score + 150;
      const xp = Math.round(finalScore * 1.5);
      onSubmitScore(finalScore, xp);
    }
  };

  const restartWithNewPuzzles = () => {
    const fresh = shuffle(ALL_ASSEMBLER_PUZZLES).slice(0, 3);
    setPuzzles(fresh);
    setPuzzleIdx(0);
    setScore(0);
    setFeedback(null);
    setGameWon(false);
  };

  if (gameWon) {
    return (
      <div className="card p-8 text-center max-w-lg mx-auto space-y-6 animate-fade-in-up border border-slate-800 shadow-2xl">
        <span className="text-6xl block animate-bounce">🧩</span>
        <div>
          <h2 className="text-2xl font-black text-white">Master Assembler!</h2>
          <p className="text-slate-400 text-xs mt-1">You solved all algorithm rearrangement puzzles!</p>
        </div>

        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 grid grid-cols-2 gap-4">
          <div className="text-center">
            <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Final Score</p>
            <p className="text-3xl font-black text-cyan-400 mt-1">{score} pts</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">XP Earned</p>
            <p className="text-3xl font-black text-amber-400 mt-1">+{Math.round(score * 1.5)} XP</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={onExit}
            className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-sm rounded-xl transition shadow-lg shadow-cyan-500/20 cursor-pointer"
          >
            ⬅️ Return to Arcade Hub
          </button>
          <button
            onClick={restartWithNewPuzzles}
            className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm rounded-xl transition border border-slate-700 cursor-pointer"
          >
            New Puzzles 🔄
          </button>
        </div>
      </div>
    );
  }

  if (puzzles.length === 0) return null;

  return (
    <div className="card p-6 border border-slate-800 space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <button onClick={onExit} className="text-xs text-slate-400 hover:text-white px-3 py-1.5 bg-slate-800 rounded-lg cursor-pointer transition">
            ← Exit Game
          </button>
          <span className="text-sm font-bold text-white">Puzzle {puzzleIdx + 1} of {puzzles.length}</span>
          <span className="text-xs uppercase font-semibold px-2 py-0.5 rounded bg-slate-800 text-cyan-400">
            {currentPuzzle.language.toUpperCase()}
          </span>
        </div>

        <div className="text-sm font-bold text-cyan-400">
          Score: {score}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold text-white mb-1">{currentPuzzle.title}</h3>
        <p className="text-xs text-slate-400">{currentPuzzle.goal}</p>
      </div>

      {/* Scrambled Blocks List */}
      <div className="space-y-2">
        {blocks.map((block, idx) => (
          <div
            key={block.id}
            className="flex items-center justify-between p-3.5 bg-slate-950 border border-slate-800 rounded-xl font-mono text-sm text-slate-200 hover:border-slate-700 transition"
          >
            <div className="flex items-center gap-3">
              <span className="text-slate-600 text-xs w-4">{idx + 1}.</span>
              <pre className="bg-transparent m-0 p-0 text-slate-100 font-mono">
                <code>{block.text}</code>
              </pre>
            </div>

            <div className="flex gap-1">
              <button
                disabled={idx === 0}
                onClick={() => moveBlock(idx, -1)}
                className="w-7 h-7 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 rounded text-xs flex items-center justify-center cursor-pointer"
              >
                ▲
              </button>
              <button
                disabled={idx === blocks.length - 1}
                onClick={() => moveBlock(idx, 1)}
                className="w-7 h-7 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 rounded text-xs flex items-center justify-center cursor-pointer"
              >
                ▼
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Verify & Action Buttons */}
      <div className="flex gap-3">
        {!feedback?.isCorrect ? (
          <button
            onClick={handleVerifyOrder}
            className="px-6 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm rounded-xl transition cursor-pointer shadow-lg shadow-cyan-500/20"
          >
            Run & Check Sequence ⚙️
          </button>
        ) : (
          <button
            onClick={handleNextPuzzle}
            className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm rounded-xl transition cursor-pointer shadow-lg shadow-emerald-500/20"
          >
            {puzzleIdx + 1 < puzzles.length ? 'Next Puzzle →' : 'Complete Challenge 🎉'}
          </button>
        )}
      </div>

      {/* Feedback Alert */}
      {feedback && (
        <div className={`p-3.5 rounded-xl border animate-fade-in-up ${
          feedback.isCorrect ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300' : 'bg-red-500/10 border-red-500/40 text-red-300'
        }`}>
          <p className="text-sm font-medium">{feedback.text}</p>
        </div>
      )}
    </div>
  );
}
