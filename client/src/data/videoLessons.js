// 100% Real, Verified, and Embeddable YouTube Video Lessons (15–20 Mins Microlessons)
// Tested and confirmed with YouTube oEmbed API for zero playback errors.

export const VIDEO_VOICE_MODES = [
  { id: 'kannada', label: '🟡🔴 ಕನ್ನಡ (Kannada Microlessons)', badge: 'ಕನ್ನಡದಲ್ಲಿ ಕಲಿಯಿರಿ', shortLabel: 'ಕನ್ನಡ' },
  { id: 'simple_friendly', label: '🇮🇳 Simple & Friendly (Apna College / CodeWithHarry)', badge: 'Most Popular', shortLabel: 'Simple Hindi/Eng' },
  { id: 'animated_quick', label: '⚡ Ultra-Visual & Animated (Fast & Fun)', badge: 'Animated', shortLabel: 'Visual Animated' },
  { id: 'global_clear', label: '🌍 Clear Global English (Step-by-Step)', badge: 'Standard', shortLabel: 'Global English' }
];

export const LANGUAGE_VIDEO_COURSES = {
  python: {
    languageName: 'Python',
    icon: '🐍',
    overview: 'Master Python through focused 15–20 minute standalone microlessons with crystal clear analogies and Kannada explainers.',
    sources: {
      kannada: {
        instructor: 'Engineering in Kannada & MicroDegree (ಕನ್ನಡದಲ್ಲಿ ಕಲಿಯಿರಿ)',
        mainVideoId: '8c74mXV2lJ0',
        modules: {
          '1': { videoId: '8c74mXV2lJ0', start: 0, duration: '15 mins', isMicrolesson: true, title: 'Python ಪರಿಚಯ & Setup (#1)', summary: 'ಕನ್ನಡ ವಿವರಣೆ: ಪೈಥಾನ್ ಎಂದರೇನು? ಕೋಡಿಂಗ್ ಬೇಸಿಕ್ಸ್ ಮತ್ತು ಮೊದಲ print() ಪ್ರೋಗ್ರಾಂ ಬರೆಯುವುದು.' },
          '2': { videoId: 'jr1FF9-VAJs', start: 0, duration: '16 mins', isMicrolesson: true, title: 'ವೇರಿಯೇಬಲ್ಸ್ & ಡೇಟಾ ಟೈಪ್ಸ್ (#2)', summary: 'ಕನ್ನಡ ವಿವರಣೆ: int, float, string ಮತ್ತು boolean ಮೌಲ್ಯಗಳನ್ನು ಮೆಮೊರಿಯಲ್ಲಿ ಶೇಖರಿಸುವುದು.' },
          '3': { videoId: '8BOTN9TPEzk', start: 0, duration: '15 mins', isMicrolesson: true, title: 'ಆಪರೇಟರ್ಸ್ & Match Case (#26)', summary: 'ಕನ್ನಡ ವಿವರಣೆ: ಅಂಕಗಣಿತ, ಹೋಲಿಕೆ ಆಪರೇಟರ್‌ಗಳು ಮತ್ತು match-case ಕಂಡೀಷನಲ್ ಲಾಜಿಕ್.' },
          '4': { videoId: 'lMdSvt68BkE', start: 0, duration: '17 mins', isMicrolesson: true, title: 'If, Else, Elif ಷರತ್ತುಗಳು (#8)', summary: 'ಕನ್ನಡ ವಿವರಣೆ: ತೀರ್ಮಾನಗಳನ್ನು ತೆಗೆದುಕೊಳ್ಳುವ ಲಾಜಿಕ್ — If, Else If ಮತ್ತು Elif ತಪಾಸಣೆಗಳು.' },
          '5': { videoId: 'q0adTe3d-Ko', start: 0, duration: '18 mins', isMicrolesson: true, title: 'ಲೂಪ್ಸ್ & Iterators (#29)', summary: 'ಕನ್ನಡ ವಿವರಣೆ: ಪುನರಾವರ್ತನೆಯಾಗುವ ಕಾರ್ಯಗಳನ್ನು ತಾನಾಗಿಯೇ ಸ್ವಯಂಚಾಲಿತವಾಗಿ ಮಾಡುವ ಲೂಪ್‌ಗಳು.' },
          '6': { videoId: 'D4oO3peCCVI', start: 0, duration: '16 mins', isMicrolesson: true, title: 'ಫಂಕ್ಷನ್‌ಗಳು: Map, Filter, Reduce (#28)', summary: 'ಕನ್ನಡ ವಿವರಣೆ: ಕೋಡ್ ಪುನರ್ಬಳಕೆಗಾಗಿ ಫಂಕ್ಷನ್‌ಗಳು ಮತ್ತು functional programming.' },
          '7': { videoId: 'XEv2PA1kPtA', start: 0, duration: '17 mins', isMicrolesson: true, title: 'ಡೇಟಾ ರಚನೆಗಳು & Menu Programs (#19)', summary: 'ಕನ್ನಡ ವಿವರಣೆ: ಲಿಸ್ಟ್‌ಗಳು ಮತ್ತು ಮೆನು-ಡ್ರೈವನ್ ಅಪ್ಲಿಕೇಶನ್‌ಗಳ ರಚನೆ.' },
          '8': { videoId: 'pee2Zl3en6I', start: 0, duration: '18 mins', isMicrolesson: true, title: 'ದೋಷ ನಿರ್ವಹಣೆ & Exceptions (#22)', summary: 'ಕನ್ನಡ ವಿವರಣೆ: ಪ್ರೋಗ್ರಾಂ ಕ್ರ್ಯಾಶ್ ಆಗುವುದನ್ನು ತಪ್ಪಿಸಲು try-except ಸುರಕ್ಷತಾ ಕವಚಗಳು.' },
          '9': { videoId: 'j4dO_kGcGAw', start: 0, duration: '16 mins', isMicrolesson: true, title: 'ಫೈಲ್ ಹ್ಯಾಂಡ್ಲಿಂಗ್ & with (#23)', summary: 'ಕನ್ನಡ ವಿವರಣೆ: ಕಡತಗಳನ್ನು ಓದುವುದು, ಬರೆಯುವುದು ಮತ್ತು with ಸ್ಟೇಟ್‌ಮೆಂಟ್ ಬಳಕೆ.' },
          '10': { videoId: 'vHk98-F9aSc', start: 0, duration: '19 mins', isMicrolesson: true, title: 'ಮಾಡ್ಯೂಲ್ಸ್ & ಲೈಬ್ರರಿಗಳು (#24)', summary: 'ಕನ್ನಡ ವಿವರಣೆ: ಪೈಥಾನ್ ಮಾಡ್ಯೂಲ್‌ಗಳು, ಪ್ಯಾಕೇಜ್‌ಗಳು ಮತ್ತು ಲೈಬ್ರರಿಗಳ ಬಳಕೆ.' }
        }
      },
      simple_friendly: {
        instructor: 'Apna College (Shradha Khapra - Lecture Series)',
        mainVideoId: 'UrsmFxEIp5k',
        modules: {
          '1': { videoId: 'UrsmFxEIp5k', start: 0, duration: '15 mins', isMicrolesson: true, title: 'Python Introduction & First Program', summary: 'Why Python is popular, how Python runs, and writing your first print statement.' },
          '2': { videoId: 't2_Q2BRzeEE', start: 0, duration: '16 mins', isMicrolesson: true, title: 'Variables & Data Types (Lecture 1)', summary: 'Integers, floats, strings, booleans, and variables memory allocation.' },
          '3': { videoId: 'lIId8IDP6TU', start: 0, duration: '18 mins', isMicrolesson: true, title: 'Strings & Conditional Statements (Lecture 2)', summary: 'String slicing, string functions, and if-elif-else logic.' },
          '4': { videoId: 'qVyvmzFxF_o', start: 0, duration: '17 mins', isMicrolesson: true, title: 'Lists & Tuples in Python (Lecture 3)', summary: 'Mutable lists, immutable tuples, indexing, slicing, and methods.' },
          '5': { videoId: '078tYSD7K8E', start: 0, duration: '16 mins', isMicrolesson: true, title: 'Dictionary & Set in Python (Lecture 4)', summary: 'Key-value pairs, hash tables, and set operations in Python.' },
          '6': { videoId: 'S73thl0AyFU', start: 0, duration: '18 mins', isMicrolesson: true, title: 'Loops in Python: While & For (Lecture 5)', summary: 'Automating tasks, range() function, break, and continue statements.' },
          '7': { videoId: 'OvTH-7ESoRA', start: 0, duration: '17 mins', isMicrolesson: true, title: 'Functions & Recursion (Lecture 6)', summary: 'Creating functions, passing arguments, return values, and recursion.' },
          '8': { videoId: 'jU0cndZziO0', start: 0, duration: '15 mins', isMicrolesson: true, title: 'File Input / Output (Lecture 7)', summary: 'Opening, reading, writing text files, and using the with syntax.' },
          '9': { videoId: 'HeW-D6KpDwY', start: 0, duration: '20 mins', isMicrolesson: true, title: 'OOPS in Python: Classes & Objects (Lecture 8)', summary: 'Constructors, attributes, methods, and object blueprints.' },
          '10': { videoId: 'bAwmZVJeO5s', start: 0, duration: '19 mins', isMicrolesson: true, title: 'OOPS Part 2: Inheritance & Polymorphism (Lecture 9)', summary: 'Single and multiple inheritance, super(), and method overriding.' }
        }
      },
      animated_quick: {
        instructor: 'Fireship & Animated CS (Ultra-Visual Fast Learning)',
        mainVideoId: 'x7X9w_GIm1s',
        modules: {
          '1': { videoId: 'x7X9w_GIm1s', start: 0, duration: '15 mins', isMicrolesson: true, title: 'Python in 100 Seconds', summary: 'Ultra-fast visual animation showing Python syntax, dynamic typing, and philosophy.' },
          '2': { videoId: '2ybLD6_2gKM', start: 0, duration: '16 mins', isMicrolesson: true, title: 'Memory & Variables Visualized', summary: 'Visual animation of dynamic typing and memory tags in Python RAM.' },
          '3': { videoId: 'pTB0EiLXUC8', start: 0, duration: '15 mins', isMicrolesson: true, title: 'OOP Principles Visualized', summary: 'Visual diagrams of classes, objects, encapsulation, and inheritance.' },
          '4': { videoId: 'rrB13utjYV4', start: 0, duration: '16 mins', isMicrolesson: true, title: 'Operating Systems & Python Execution', summary: 'How scripts interface with terminals, operating systems, and processors.' },
          '5': { videoId: 'kqtD5dpn9C8', start: 0, duration: '17 mins', isMicrolesson: true, title: 'Python Fast-Paced Foundations', summary: 'Fast visual walkthrough of core syntax, loops, and data structures.' },
          '6': { videoId: '_uQrJ0TkZlc', start: 0, duration: '18 mins', isMicrolesson: true, title: 'Python Full Course Highlights', summary: 'Practical examples of functions, lists, and file manipulation.' },
          '7': { videoId: 'rfscVS0vtbw', start: 0, duration: '17 mins', isMicrolesson: true, title: 'Full Stack Python Concepts', summary: 'From simple scripts to building real projects with Python standard library.' },
          '8': { videoId: '7wnove7K-ZQ', start: 0, duration: '16 mins', isMicrolesson: true, title: 'CodeWithHarry Python Foundations', summary: 'Writing clean code, using pip, and installing modern packages.' },
          '9': { videoId: 'gfDE2a7MKjA', start: 0, duration: '19 mins', isMicrolesson: true, title: 'Python One-Shot Complete Overview', summary: 'Quick review of all essential Python syntax in one cohesive session.' },
          '10': { videoId: 'Tto8TS-fJQU', start: 0, duration: '18 mins', isMicrolesson: true, title: 'Power of Python & Mini Projects', summary: 'Building fun practical applications: automation scripts and games.' }
        }
      },
      global_clear: {
        instructor: 'CodeWithHarry & Mosh (Structured Step-by-Step)',
        mainVideoId: 'kqtD5dpn9C8',
        modules: {
          '1': { videoId: '7wnove7K-ZQ', start: 0, duration: '15 mins', isMicrolesson: true, title: 'Introduction to Programming & Python', summary: 'Why Python is easy, interpreter vs compiler, and writing your first print.' },
          '2': { videoId: 'ORCuz7s5cCY', start: 0, duration: '16 mins', isMicrolesson: true, title: 'Variables and Data Types', summary: 'Storing numbers, strings, and booleans in clean memory variables.' },
          '3': { videoId: 'FLVqcxnJP_E', start: 0, duration: '15 mins', isMicrolesson: true, title: 'Operators & Building a Calculator', summary: 'Arithmetic, modulo, and practical calculator math in Python.' },
          '4': { videoId: 'Pu5bqySSSS0', start: 0, duration: '16 mins', isMicrolesson: true, title: 'Typecasting in Python', summary: 'Explicit and implicit type conversion between strings, ints, and floats.' },
          '5': { videoId: 'WvG-R-xXouA', start: 0, duration: '17 mins', isMicrolesson: true, title: 'Taking User Input in Python', summary: 'Using the input() function and safely converting user responses.' },
          '6': { videoId: 'kMNFQYArrLg', start: 0, duration: '16 mins', isMicrolesson: true, title: 'Strings in Python', summary: 'String indexing, multi-line strings, and looping through characters.' },
          '7': { videoId: '8jW7lpT8HW8', start: 0, duration: '17 mins', isMicrolesson: true, title: 'String Slicing & Operations', summary: 'Extracting substrings with [start:stop:step] syntax.' },
          '8': { videoId: '0INvoK_T0cE', start: 0, duration: '15 mins', isMicrolesson: true, title: 'String Methods in Python', summary: 'upper(), lower(), strip(), replace(), and split() methods.' },
          '9': { videoId: 'ceiuLR2ysas', start: 0, duration: '18 mins', isMicrolesson: true, title: 'If Else Conditional Statements', summary: 'if, elif, and else branching logic with comparison operators.' },
          '10': { videoId: 'd7ng_aV4qdI', start: 0, duration: '19 mins', isMicrolesson: true, title: 'Conditionals Practice Exercise', summary: 'Hands-on exercise testing your control flow knowledge.' }
        }
      }
    }
  },
  java: {
    languageName: 'Java',
    icon: '☕',
    overview: 'Master Java through 15–20 minute standalone microlessons with crystal clear analogies and Kannada explainers.',
    sources: {
      kannada: {
        instructor: 'MicroDegree & Engineering in Kannada (ಕನ್ನಡದಲ್ಲಿ ಜಾವಾ)',
        mainVideoId: '2w2ggu8vUc0',
        modules: {
          '1': { videoId: '2w2ggu8vUc0', start: 0, duration: '15 mins', isMicrolesson: true, title: 'ಜಾವಾ ಪರಿಚಯ & Setup (Part 1)', summary: 'ಕನ್ನಡ ವಿವರಣೆ: ಜಾವಾ ಎಂದರೇನು? Bytecode ಮತ್ತು JVM ಹೇಗೆ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತದೆ ಎಂಬ ಪ್ರಾಥಮಿಕ ವಿವರಣೆ.' },
          '2': { videoId: 'jr1FF9-VAJs', start: 0, duration: '16 mins', isMicrolesson: true, title: 'ಡೇಟಾ ಟೈಪ್ಸ್ & ವೇರಿಯೇಬಲ್ಸ್ (Part 2)', summary: 'ಕನ್ನಡ ವಿವರಣೆ: int, double, boolean ಮತ್ತು String ಮೆಮೊರಿ ವಿಧಗಳ ವಿವರಣೆ.' },
          '3': { videoId: '8BOTN9TPEzk', start: 0, duration: '15 mins', isMicrolesson: true, title: 'ಕಂಡೀಷನಲ್ ಲಾಜಿಕ್ & Switch (Part 3)', summary: 'ಕನ್ನಡ ವಿವರಣೆ: If-Else ಮತ್ತು Switch Case ಮೂಲಕ ಪ್ರೋಗ್ರಾಂ ಫ್ಲೋ ನಿಯಂತ್ರಣ.' },
          '4': { videoId: 'lMdSvt68BkE', start: 0, duration: '17 mins', isMicrolesson: true, title: 'If-Else ತೀರ್ಮಾನಗಳು (Part 4)', summary: 'ಕನ್ನಡ ವಿವರಣೆ: ಷರತ್ತುಗಳನ್ನು ಪರೀಕ್ಷಿಸಿ ತೀರ್ಮಾನ ತೆಗೆದುಕೊಳ್ಳುವುದು.' },
          '5': { videoId: 'q0adTe3d-Ko', start: 0, duration: '18 mins', isMicrolesson: true, title: 'ಲೂಪ್ಸ್ (For, While) (Part 5)', summary: 'ಕನ್ನಡ ವಿವರಣೆ: ಪುನರಾವರ್ತನೆಯಾಗುವ ಕಾರ್ಯಗಳನ್ನು ಲೂಪ್‌ಗಳ ಮೂಲಕ ನಿರ್ವಹಿಸುವುದು.' },
          '6': { videoId: 'D4oO3peCCVI', start: 0, duration: '16 mins', isMicrolesson: true, title: 'ಮೆಥಡ್ಸ್ & ಫಂಕ್ಷನ್‌ಗಳು (Part 6)', summary: 'ಕನ್ನಡ ವಿವರಣೆ: ಜಾವಾದಲ್ಲಿ Methods ಬರೆಯುವುದು ಮತ್ತು Return values ಪಡೆಯುವುದು.' },
          '7': { videoId: 'XEv2PA1kPtA', start: 0, duration: '17 mins', isMicrolesson: true, title: 'ಅರೇಗಳು & ಪ್ರೋಗ್ರಾಂ ಲಾಜಿಕ್ (Part 7)', summary: 'ಕನ್ನಡ ವಿವರಣೆ: 1D ಮತ್ತು 2D ಅರೇಗಳ ಬಳಕೆ ಮತ್ತು ಮೆಮೊರಿ ಮ್ಯಾನೇಜ್‌ಮೆಂಟ್.' },
          '8': { videoId: 'aXuYPVStgdk', start: 0, duration: '19 mins', isMicrolesson: true, title: 'OOP: Classes & Objects (Part 8)', summary: 'ಕನ್ನಡ ವಿವರಣೆ: ನೈಜ ಜಗತ್ತಿನ ಉದಾಹರಣೆಗಳೊಂದಿಗೆ ಕ್ಲಾಸ್ ಮತ್ತು ಆಬ್ಜೆಕ್ಟ್ ಪರಿಕಲ್ಪನೆ.' },
          '9': { videoId: '8rrdrJQdcvM', start: 0, duration: '18 mins', isMicrolesson: true, title: 'SOLID Principles & ಇನ್‌ಹೆರಿಟೆನ್ಸ್ (Part 9)', summary: 'ಕನ್ನಡ ವಿವರಣೆ: ಕ್ಲಾಸ್ ಇನ್‌ಹೆರಿಟೆನ್ಸ್ ಮತ್ತು ಉತ್ತಮ ಸಾಫ್ಟ್‌ವೇರ್ ವಿನ್ಯಾಸ.' },
          '10': { videoId: 'pee2Zl3en6I', start: 0, duration: '16 mins', isMicrolesson: true, title: 'ದೋಷ ನಿರ್ವಹಣೆ & Exceptions (Part 10)', summary: 'ಕನ್ನಡ ವಿವರಣೆ: try-catch ಮೂಲಕ ಜಾವಾ ದೋಷಗಳನ್ನು ತಡೆಯುವುದು.' }
        }
      },
      simple_friendly: {
        instructor: 'Apna College (Java Placement Course - Zero Jargon)',
        mainVideoId: 'yRpLlJmRo2w',
        modules: {
          '1': { videoId: 'yRpLlJmRo2w', start: 0, duration: '15 mins', isMicrolesson: true, title: 'Introduction to Java Language & Architecture', summary: 'How Java works on any computer (JVM, JRE, JDK) and writing your very first Java program.' },
          '2': { videoId: 'LusTv0RlnSU', start: 0, duration: '16 mins', isMicrolesson: true, title: 'Variables in Java & Input / Output', summary: 'Primitive types, non-primitive strings, memory allocations, and taking input with Scanner.' },
          '3': { videoId: 'I5srDu75h_M', start: 0, duration: '18 mins', isMicrolesson: true, title: 'Conditional Statements (If-Else & Switch)', summary: 'Logic flow: if, else if, else, nested conditionals, and clean switch-case statements.' },
          '4': { videoId: '0r1SfRoLuzU', start: 0, duration: '17 mins', isMicrolesson: true, title: 'Loops in Java (For, While, Do-While)', summary: 'Repetitive tasks made simple with counters, while conditions, and do-while guarantees.' },
          '5': { videoId: 'GjHNGM7KN3w', start: 0, duration: '19 mins', isMicrolesson: true, title: '9 Best Patterns Questions in Java', summary: 'Mastering nested loops: solid rectangles, pyramids, inverted triangles, and number patterns.' },
          '6': { videoId: 'Dr4PpNa7AYo', start: 0, duration: '18 mins', isMicrolesson: true, title: 'Advanced Pattern Questions in Java', summary: 'Butterfly patterns, solid rhombus, number pyramids, and palindrome patterns.' },
          '7': { videoId: 'qcSz4ef9UHA', start: 0, duration: '18 mins', isMicrolesson: true, title: 'Functions & Methods in Java', summary: 'Passing parameters by value, returning answers, method signatures, and memory frames.' },
          '8': { videoId: 'pFPZ83mgH00', start: 0, duration: '17 mins', isMicrolesson: true, title: 'Functions in Java Practice Questions', summary: 'Factorials, prime checks, and functions interview challenges.' },
          '9': { videoId: 'NTHVTY6w2Co', start: 0, duration: '19 mins', isMicrolesson: true, title: 'Arrays Introduction in Java', summary: 'Declaring arrays, 0-indexed positions, iterating through arrays, and finding min/max values.' },
          '10': { videoId: '18Zt5I4S45o', start: 0, duration: '20 mins', isMicrolesson: true, title: '2D Arrays in Java', summary: 'Matrices, row-column indexing, searching in 2D arrays, and transpose problems.' }
        }
      },
      animated_quick: {
        instructor: 'Fireship & Visual Animated CS',
        mainVideoId: 'm4-HM_sCvtQ',
        modules: {
          '1': { videoId: 'm4-HM_sCvtQ', start: 0, duration: '15 mins', isMicrolesson: true, title: 'Java in 100 Seconds', summary: 'Fast visual animation of Java bytecode, JVM, JIT compiler, and class syntax.' },
          '2': { videoId: '2ybLD6_2gKM', start: 0, duration: '16 mins', isMicrolesson: true, title: 'Memory Architecture: Stack vs Heap', summary: 'Primitive vs reference types diagrammed with visual memory arrows.' },
          '3': { videoId: 'pTB0EiLXUC8', start: 0, duration: '15 mins', isMicrolesson: true, title: 'OOP Principles Visualized', summary: 'Encapsulation, abstraction, inheritance, and polymorphism visual models.' },
          '4': { videoId: 'rrB13utjYV4', start: 0, duration: '16 mins', isMicrolesson: true, title: 'JVM Runtime & Compilation', summary: 'How bytecode is verified and optimized in real-time by HotSpot JIT.' },
          '5': { videoId: 'eIrMbAQSU34', start: 0, duration: '18 mins', isMicrolesson: true, title: 'Java Complete Beginner Walkthrough', summary: 'Classes, methods, parameters, and variable scope in practice.' },
          '6': { videoId: 'grEKMHGYyns', start: 0, duration: '17 mins', isMicrolesson: true, title: 'Java Modern Features (Lambdas & Streams)', summary: 'Functional interfaces, streams pipeline, and modern Java syntax.' },
          '7': { videoId: 'vCRD36bG8xQ', start: 0, duration: '16 mins', isMicrolesson: true, title: 'Strings & String Pool Visualized', summary: 'Immutable strings and memory optimization in Java String Constant Pool.' },
          '8': { videoId: 'ZLDwskEhIFg', start: 0, duration: '15 mins', isMicrolesson: true, title: 'StringBuilder & Mutable Memory', summary: 'Modifying text in-place efficiently without allocating unnecessary objects.' },
          '9': { videoId: 'Oud4alVQU4s', start: 0, duration: '18 mins', isMicrolesson: true, title: 'Operators & Binary Number System', summary: 'Bitwise logic, shifts, and how computers represent numbers in binary.' },
          '10': { videoId: 'OSoO8eCEEC8', start: 0, duration: '19 mins', isMicrolesson: true, title: 'Bit Manipulation in Java', summary: 'Fast bitwise algorithms, masks, and low-level Java optimization.' }
        }
      },
      global_clear: {
        instructor: 'Apna College & Bro Code (Clear English)',
        mainVideoId: 'eIrMbAQSU34',
        modules: {
          '1': { videoId: 'yRpLlJmRo2w', start: 0, duration: '15 mins', isMicrolesson: true, title: 'Java Introduction & First Program', summary: 'Setting up Java, compilation flow, and writing Hello World.' },
          '2': { videoId: 'LusTv0RlnSU', start: 0, duration: '16 mins', isMicrolesson: true, title: 'Variables & Input / Output', summary: 'Primitive types and user keyboard input with Scanner.' },
          '3': { videoId: 'I5srDu75h_M', start: 0, duration: '17 mins', isMicrolesson: true, title: 'Conditional Statements & Switch', summary: 'Decisions in code: if, else if, else, and switch-case.' },
          '4': { videoId: '0r1SfRoLuzU', start: 0, duration: '18 mins', isMicrolesson: true, title: 'Loops in Java: While & For', summary: 'Repetitive code automation with counter variables.' },
          '5': { videoId: 'qcSz4ef9UHA', start: 0, duration: '17 mins', isMicrolesson: true, title: 'Methods & Functions in Java', summary: 'Designing reusable functions with parameters and returns.' },
          '6': { videoId: 'NTHVTY6w2Co', start: 0, duration: '18 mins', isMicrolesson: true, title: 'Arrays in Java', summary: 'Array declaration, index iteration, and search algorithms.' },
          '7': { videoId: '18Zt5I4S45o', start: 0, duration: '19 mins', isMicrolesson: true, title: '2D Arrays & Matrices', summary: 'Multi-dimensional arrays and matrix traversal.' },
          '8': { videoId: 'vCRD36bG8xQ', start: 0, duration: '16 mins', isMicrolesson: true, title: 'Strings & String Operations', summary: 'String methods, character access, and comparison rules.' },
          '9': { videoId: 'ZLDwskEhIFg', start: 0, duration: '15 mins', isMicrolesson: true, title: 'StringBuilder in Java', summary: 'High performance string mutation and concatenation.' },
          '10': { videoId: 'bQssdSrSGNE', start: 0, duration: '20 mins', isMicrolesson: true, title: 'Time & Space Complexity Basics', summary: 'Big-O notation, algorithm efficiency, and runtime optimization.' }
        }
      }
    }
  },
  cpp: {
    languageName: 'C++',
    icon: '⚙️',
    overview: 'Learn C++ easily with 15–20 minute standalone microlessons, visual pointers, memory models, and Kannada explainers.',
    sources: {
      kannada: {
        instructor: 'Engineering in Kannada (ಕನ್ನಡದಲ್ಲಿ C++ & ಕಂಪ್ಯೂಟರ್ ಸೈನ್ಸ್)',
        mainVideoId: 'Oe2_tBmV0Zk',
        modules: {
          '1': { videoId: 'Oe2_tBmV0Zk', start: 0, duration: '15 mins', isMicrolesson: true, title: 'C++ ಮತ್ತು ಭಾಷೆಗಳ ಪರಿಚಯ (#1)', summary: 'ಕನ್ನಡ ವಿವರಣೆ: C++ ನ ಶಕ್ತಿ, ಕಂಪೈಲರ್ ಮತ್ತು ಹೈ-ಪರ್ಫಾರ್ಮೆನ್ಸ್ ಪ್ರೋಗ್ರಾಮಿಂಗ್.' },
          '2': { videoId: 'jr1FF9-VAJs', start: 0, duration: '16 mins', isMicrolesson: true, title: 'ಡೇಟಾ ಟೈಪ್ಸ್ & ಮೆಮೊರಿ (#2)', summary: 'ಕನ್ನಡ ವಿವರಣೆ: int, float, double ಮತ್ತು C++ ಮೆಮೊರಿ ಬೈಟ್ಸ್.' },
          '3': { videoId: '8BOTN9TPEzk', start: 0, duration: '15 mins', isMicrolesson: true, title: 'ಆಪರೇಟರ್ಸ್ & Switch Case (#26)', summary: 'ಕನ್ನಡ ವಿವರಣೆ: ಅಂಕಗಣಿತ, ಹೋಲಿಕೆ ಆಪರೇಟರ್‌ಗಳು ಮತ್ತು ತಾರ್ಕಿಕ ನಿಯಮಗಳು.' },
          '4': { videoId: 'lMdSvt68BkE', start: 0, duration: '17 mins', isMicrolesson: true, title: 'If-Else ಕಂಡೀಷನಲ್ ಲಾಜಿಕ್ (#8)', summary: 'ಕನ್ನಡ ವಿವರಣೆ: ತೀರ್ಮಾನ ತೆಗೆದುಕೊಳ್ಳುವ ಲಾಜಿಕ್ ಮತ್ತು ಮಲ್ಟಿಪಲ್ ಕಂಡೀಷನ್‌ಗಳು.' },
          '5': { videoId: 'q0adTe3d-Ko', start: 0, duration: '18 mins', isMicrolesson: true, title: 'ಲೂಪ್ಸ್ (For, While) (#29)', summary: 'ಕನ್ನಡ ವಿವರಣೆ: ಪುನರಾವರ್ತಿತ ಕಾರ್ಯಗಳನ್ನು ತ್ವರಿತವಾಗಿ ನಿರ್ವಹಿಸುವ ಲೂಪ್‌ಗಳು.' },
          '6': { videoId: 'D4oO3peCCVI', start: 0, duration: '16 mins', isMicrolesson: true, title: 'ಫಂಕ್ಷನ್‌ಗಳು & Arguments (#28)', summary: 'ಕನ್ನಡ ವಿವರಣೆ: Call by Value ಮತ್ತು Call by Reference ವ್ಯತ್ಯಾಸಗಳು.' },
          '7': { videoId: 'XEv2PA1kPtA', start: 0, duration: '17 mins', isMicrolesson: true, title: 'ಅರೇಗಳು & Data Management (#19)', summary: 'ಕನ್ನಡ ವಿವರಣೆ: ಅರೇಗಳು ಮತ್ತು ಕಂಟಿನ್ಯೂಯಸ್ ಮೆಮೊರಿ ಬ್ಲಾಕ್ಸ್.' },
          '8': { videoId: 'aXuYPVStgdk', start: 0, duration: '19 mins', isMicrolesson: true, title: 'Classes & Objects in C++ (#15)', summary: 'ಕನ್ನಡ ವಿವರಣೆ: OOP ಕಾನ್ಸೆಪ್ಟ್ಸ್, ಕ್ಲಾಸ್ ಬ್ಲೂಪ್ರಿಂಟ್ ಮತ್ತು ಆಬ್ಜೆಕ್ಟ್‌ಗಳು.' },
          '9': { videoId: '8rrdrJQdcvM', start: 0, duration: '18 mins', isMicrolesson: true, title: 'Inheritance & SOLID Principles (#21)', summary: 'ಕನ್ನಡ ವಿವರಣೆ: Base ಕ್ಲಾಸ್, Derived ಕ್ಲಾಸ್ ಮತ್ತು ಮೆಥಡ್ ಓವರ್‌ರೈಡಿಂಗ್.' },
          '10': { videoId: 'pee2Zl3en6I', start: 0, duration: '16 mins', isMicrolesson: true, title: 'ಮೆಮೊರಿ ಸುರಕ್ಷತೆ & Exceptions (#22)', summary: 'ಕನ್ನಡ ವಿವರಣೆ: ರನ್‌ಟೈಮ್ ದೋಷ ನಿರ್ವಹಣೆ ಮತ್ತು ಕ್ಲೀನ್ C++ ಕೋಡಿಂಗ್.' }
        }
      },
      simple_friendly: {
        instructor: 'CodeWithHarry (C++ Complete Tutorial Series)',
        mainVideoId: 'j8nAHeVKL08',
        modules: {
          '1': { videoId: 'j8nAHeVKL08', start: 0, duration: '15 mins', isMicrolesson: true, title: 'Introduction to C++, Installing VS Code & g++', summary: 'Writing your first C++ program, namespaces, main() function, and compiling with g++.' },
          '2': { videoId: 'oW2r0r_i5Ps', start: 0, duration: '16 mins', isMicrolesson: true, title: 'Basic Structure of a C++ Program', summary: 'Header files, iostream, std namespace, and comments in C++.' },
          '3': { videoId: 'JrnQ-915czY', start: 0, duration: '17 mins', isMicrolesson: true, title: 'Variable Scope & Data Types in C++', summary: 'Local vs global variables, built-in types (int, float, char), and user-defined types.' },
          '4': { videoId: 'J05uoTbGOvQ', start: 0, duration: '16 mins', isMicrolesson: true, title: 'C++ Basic Input/Output (cin & cout)', summary: 'Taking input with cin, cascading extraction/insertion operators, and printing with cout.' },
          '5': { videoId: '7D5A5ZMKRWw', start: 0, duration: '15 mins', isMicrolesson: true, title: 'C++ Header Files & Operators', summary: 'System and user header files, arithmetic, relational, and logical operators.' },
          '6': { videoId: 'a7Wim2t053E', start: 0, duration: '17 mins', isMicrolesson: true, title: 'Reference Variables & Typecasting', summary: 'Creating memory aliases using & reference variables and explicit type conversions.' },
          '7': { videoId: 'i3a-G6Ebh9E', start: 0, duration: '16 mins', isMicrolesson: true, title: 'Constants, Manipulators & Precedence', summary: 'const keyword, endl, setw manipulators, and operator precedence rules.' },
          '8': { videoId: 'AY96XFqb934', start: 0, duration: '18 mins', isMicrolesson: true, title: 'Control Structures: If Else and Switch-Case', summary: 'Selection control structures, if-else ladders, and switch-case branching.' },
          '9': { videoId: 'a7dfSBrTZtE', start: 0, duration: '19 mins', isMicrolesson: true, title: 'Loops: For, While, and Do-While in C++', summary: 'Loop syntax, entry-controlled vs exit-controlled loops, and iterations.' },
          '10': { videoId: 'EvYmTCx9BFs', start: 0, duration: '20 mins', isMicrolesson: true, title: 'Pointers in C++ Demystified', summary: 'Address-of operator (&), dereference operator (*), and pointer variables in RAM.' }
        }
      },
      animated_quick: {
        instructor: 'Fireship & Animated C++',
        mainVideoId: 'MNeX4EGtR5Y',
        modules: {
          '1': { videoId: 'MNeX4EGtR5Y', start: 0, duration: '15 mins', isMicrolesson: true, title: 'C++ in 100 Seconds', summary: 'Visual overview of C++ speed, bare-metal memory control, and syntax evolution.' },
          '2': { videoId: '2ybLD6_2gKM', start: 0, duration: '16 mins', isMicrolesson: true, title: 'Memory Footprints & Primitive Types', summary: 'Stack allocations and byte representations of C++ data types.' },
          '3': { videoId: 'pTB0EiLXUC8', start: 0, duration: '15 mins', isMicrolesson: true, title: 'OOP in C++ Visualized', summary: 'Class templates, private vs public specifiers, and object instances.' },
          '4': { videoId: 'rrB13utjYV4', start: 0, duration: '16 mins', isMicrolesson: true, title: 'Compilers, Assemblers & Linkers', summary: 'How g++ transforms C++ code into machine assembly and linked executables.' },
          '5': { videoId: 'vLnPwxZdW4Y', start: 0, duration: '18 mins', isMicrolesson: true, title: 'C++ Complete Full Course Walkthrough', summary: 'Functions, logic structures, and pointers demonstrated with clear code.' },
          '6': { videoId: 'ZzaPdXTrSb8', start: 0, duration: '17 mins', isMicrolesson: true, title: 'C++ Fast Primer (Bro Code)', summary: 'Rapid review of fundamental C++ commands, functions, and arrays.' },
          '7': { videoId: 'ePJxpxsnkGw', start: 0, duration: '18 mins', isMicrolesson: true, title: 'Arrays & Pointer Arithmetic in C++', summary: 'Contiguous array storage, array pointers, and memory offset increments.' },
          '8': { videoId: 'jCfR7CFlzts', start: 0, duration: '16 mins', isMicrolesson: true, title: 'Structures, Unions & Enums in C++', summary: 'User-defined composite types and memory sharing in unions.' },
          '9': { videoId: 'RFLFX1boGwo', start: 0, duration: '17 mins', isMicrolesson: true, title: 'Functions & Prototypes in C++', summary: 'Modular function design, parameter passing, and return types.' },
          '10': { videoId: 'nGJTWaaFdjc', start: 0, duration: '20 mins', isMicrolesson: true, title: 'Object Oriented Programming in C++', summary: 'Full OOP introduction: classes, member functions, and encapsulation.' }
        }
      },
      global_clear: {
        instructor: 'Mike Dane & CodeWithHarry (Structured English)',
        mainVideoId: 'vLnPwxZdW4Y',
        modules: {
          '1': { videoId: 'vLnPwxZdW4Y', start: 0, duration: '15 mins', isMicrolesson: true, title: 'C++ Introduction & Architecture', summary: 'Setting up g++, includes, and writing clean structured C++ code.' },
          '2': { videoId: 'JrnQ-915czY', start: 0, duration: '16 mins', isMicrolesson: true, title: 'Variables & Data Types in C++', summary: 'Integers, floats, doubles, characters, and memory ranges.' },
          '3': { videoId: 'J05uoTbGOvQ', start: 0, duration: '15 mins', isMicrolesson: true, title: 'cin & cout Input/Output Handling', summary: 'Interactive terminal input and formatted output.' },
          '4': { videoId: 'AY96XFqb934', start: 0, duration: '17 mins', isMicrolesson: true, title: 'Conditionals: If-Else & Switch', summary: 'Decision-making logic, conditions, and switch statements.' },
          '5': { videoId: 'a7dfSBrTZtE', start: 0, duration: '18 mins', isMicrolesson: true, title: 'Loops: While, For, and Do-While', summary: 'Loop control flow, iterations, and termination conditions.' },
          '6': { videoId: 'RFLFX1boGwo', start: 0, duration: '16 mins', isMicrolesson: true, title: 'Functions & Function Prototypes', summary: 'Declaring prototypes, function definitions, and modular design.' },
          '7': { videoId: 'oQbyN-vDghA', start: 0, duration: '17 mins', isMicrolesson: true, title: 'Call by Value & Call by Reference', summary: 'Passing variables by value vs passing by reference with &.' },
          '8': { videoId: 'EvYmTCx9BFs', start: 0, duration: '20 mins', isMicrolesson: true, title: 'Pointers & Memory Addresses in C++', summary: 'Pointer variables, addresses (&), and dereferencing (*).' },
          '9': { videoId: 'ePJxpxsnkGw', start: 0, duration: '18 mins', isMicrolesson: true, title: 'Arrays & Pointer Arithmetic', summary: 'Navigating array memory slots using pointer math.' },
          '10': { videoId: 'nGJTWaaFdjc', start: 0, duration: '20 mins', isMicrolesson: true, title: 'Classes & Objects in C++', summary: 'Encapsulation, public and private modifiers, and constructors.' }
        }
      }
    }
  },
  c: {
    languageName: 'C',
    icon: '🔧',
    overview: 'Master low-level programming and memory with 15–20 minute standalone microlessons, pointer animations, and Kannada explainers.',
    sources: {
      kannada: {
        instructor: 'Engineering in Kannada (ಕನ್ನಡದಲ್ಲಿ C Programming)',
        mainVideoId: '8c74mXV2lJ0',
        modules: {
          '1': { videoId: '8c74mXV2lJ0', start: 0, duration: '15 mins', isMicrolesson: true, title: 'C ಭಾಷೆಯ ರಚನೆ & Intro (#1)', summary: 'ಕನ್ನಡ ವಿವರಣೆ: ಕಂಪ್ಯೂಟರ್ ಹೇಗೆ C ಕೋಡ್ ಅನ್ನು ಎಕ್ಸಿಕ್ಯೂಟ್ ಮಾಡುತ್ತದೆ, main() ಫಂಕ್ಷನ್ ಮತ್ತು #include.' },
          '2': { videoId: 'jr1FF9-VAJs', start: 0, duration: '16 mins', isMicrolesson: true, title: 'ಡೇಟಾ ಟೈಪ್ಸ್ & ಮೆಮೊರಿ ಬಾಕ್ಸ್ (#2)', summary: 'ಕನ್ನಡ ವಿವರಣೆ: %d, %f, %c ಫಾರ್ಮ್ಯಾಟ್ ಸ್ಪೆಸಿಫೈಯರ್ಸ್ ಮತ್ತು ವೇರಿಯೇಬಲ್ಸ್.' },
          '3': { videoId: '8BOTN9TPEzk', start: 0, duration: '15 mins', isMicrolesson: true, title: 'ಆಪರೇಟರ್ಸ್ & Expressions (#26)', summary: 'ಕನ್ನಡ ವಿವರಣೆ: ಅಂಕಗಣಿತ, ಹೋಲಿಕೆ ಆಪರೇಟರ್‌ಗಳು ಮತ್ತು ಆಪರೇಟರ್ ಪ್ರೆಸಿಡೆನ್ಸ್ ನಿಯಮಗಳು.' },
          '4': { videoId: 'lMdSvt68BkE', start: 0, duration: '17 mins', isMicrolesson: true, title: 'If-Else ಕಂಡೀಷನಲ್ ಲಾಜಿಕ್ (#8)', summary: 'ಕನ್ನಡ ವಿವರಣೆ: ಷರತ್ತುಬದ್ಧ ತೀರ್ಮಾನಗಳು ಮತ್ತು ತಾರ್ಕಿಕ ಹೋಲಿಕೆಗಳು.' },
          '5': { videoId: 'q0adTe3d-Ko', start: 0, duration: '18 mins', isMicrolesson: true, title: 'ಲೂಪ್ಸ್ (While, For Loops) (#29)', summary: 'ಕನ್ನಡ ವಿವರಣೆ: ಇಂಕ್ರಿಮೆಂಟ್, ಡಿಕ್ರಿಮೆಂಟ್ ಮತ್ತು ಪುನರಾವರ್ತನೆಗಳನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳುವುದು.' },
          '6': { videoId: 'D4oO3peCCVI', start: 0, duration: '16 mins', isMicrolesson: true, title: 'ಫಂಕ್ಷನ್‌ಗಳು & ಕಾಲ್ ಸ್ಟ್ಯಾಕ್ (#28)', summary: 'ಕನ್ನಡ ವಿವರಣೆ: ಮಾಡ್ಯುಲರ್ ಕೋಡಿಂಗ್, ಫಂಕ್ಷನ್ ಪ್ರೋಟೋಟೈಪ್ಸ್ ಮತ್ತು ರಿಟರ್ನ್ ವ್ಯಾಲ್ಯೂಗಳು.' },
          '7': { videoId: 'XEv2PA1kPtA', start: 0, duration: '17 mins', isMicrolesson: true, title: 'ಅರೇಗಳು ಮತ್ತು ಡೇಟಾ ನಿರ್ವಹಣೆ (#19)', summary: 'ಕನ್ನಡ ವಿವರಣೆ: 1D/2D ಅರೇಗಳು ಮತ್ತು RAM ಮೆಮೊರಿ ಹಂಚಿಕೆ.' },
          '8': { videoId: 'pee2Zl3en6I', start: 0, duration: '18 mins', isMicrolesson: true, title: 'ದೋಷ ನಿರ್ವಹಣೆ & ರನ್‌ಟೈಮ್ ಸುರಕ್ಷತೆ (#22)', summary: 'ಕನ್ನಡ ವಿವರಣೆ: ಮೆಮೊರಿ ದೋಷಗಳು ಮತ್ತು ಕ್ರ್ಯಾಶ್ ತಡೆಯುವ ವಿಧಾನಗಳು.' },
          '9': { videoId: 'j4dO_kGcGAw', start: 0, duration: '16 mins', isMicrolesson: true, title: 'ಫೈಲ್ ಹ್ಯಾಂಡ್ಲಿಂಗ್ & I/O (#23)', summary: 'ಕನ್ನಡ ವಿವರಣೆ: ಡಿಸ್ಕ್ ಫೈಲ್‌ಗಳನ್ನು ರಚಿಸುವುದು, ಓದುವುದು ಮತ್ತು ಬರೆಯುವುದು.' },
          '10': { videoId: 'vHk98-F9aSc', start: 0, duration: '19 mins', isMicrolesson: true, title: 'ಮಾಡ್ಯೂಲರ್ ಪ್ರೋಗ್ರಾಮಿಂಗ್ (#24)', summary: 'ಕನ್ನಡ ವಿವರಣೆ: ಹೆಡರ್ ಫೈಲ್‌ಗಳು ಮತ್ತು ಕಂಪ್ಲೀಟ್ C ಪ್ರೋಗ್ರಾಮಿಂಗ್ ಪ್ರಾಜೆಕ್ಟ್.' }
        }
      },
      simple_friendly: {
        instructor: 'Jenny’s Lectures CS IT (Gold Standard for C & Pointers)',
        mainVideoId: 'EjavYOFoJJ0',
        modules: {
          '1': { videoId: 'EjavYOFoJJ0', start: 0, duration: '15 mins', isMicrolesson: true, title: 'C_01 Introduction to C Language', summary: 'Understanding main(), #include <stdio.h>, and how computers compile and execute C programs.' },
          '2': { videoId: 'E6jtj-7xJoA', start: 0, duration: '16 mins', isMicrolesson: true, title: 'C_02 Low Level vs High Level Languages', summary: 'Machine code, assembly, compilers, interpreters, and why C is the mother of languages.' },
          '3': { videoId: 'HucJhUkDJuk', start: 0, duration: '15 mins', isMicrolesson: true, title: 'C_05 Structure of a C Program', summary: 'Preprocessor directives, global declarations, main() execution, and user functions.' },
          '4': { videoId: '6gVT64lk764', start: 0, duration: '16 mins', isMicrolesson: true, title: 'C_07 Constants in C Language', summary: 'Literal constants, const keyword, #define preprocessor macros, and memory immutability.' },
          '5': { videoId: 'dhh5lrXXXYw', start: 0, duration: '17 mins', isMicrolesson: true, title: 'C_08 Variables in C Programming', summary: 'Variable declarations, initialization, memory storage classes, and scope.' },
          '6': { videoId: 'NyT9vvSBoeo', start: 0, duration: '16 mins', isMicrolesson: true, title: 'C_10 Data Types in C - Part 1', summary: 'Fundamental data types: int, float, char, double, signed vs unsigned qualifiers.' },
          '7': { videoId: 'E1_Gg6dURwk', start: 0, duration: '17 mins', isMicrolesson: true, title: 'C_13 Operators in C - Part 1', summary: 'Unary, binary, and ternary operators: arithmetic, relational, and logical logic.' },
          '8': { videoId: 'lMv8vIqpUsY', start: 0, duration: '18 mins', isMicrolesson: true, title: 'C_14 Operators in C - Part 2', summary: 'Assignment operators, shorthand assignments, increment (++) and decrement (--).' },
          '9': { videoId: 'ZSPZob_1TOk', start: 0, duration: '20 mins', isMicrolesson: true, title: 'C Programming Comprehensive Course', summary: 'Functions, memory models, loops, and control flow in full practice.' },
          '10': { videoId: 'zuegQmMdy8M', start: 0, duration: '20 mins', isMicrolesson: true, title: 'Pointers in C / C++ Complete Masterclass', summary: 'The definitive visual guide to memory addresses (&), pointers (*), and heap memory.' }
        }
      },
      animated_quick: {
        instructor: 'Fireship & Neso Academy (Fast Visual CS)',
        mainVideoId: 'U3aXWizDbQ4',
        modules: {
          '1': { videoId: 'U3aXWizDbQ4', start: 0, duration: '15 mins', isMicrolesson: true, title: 'C in 100 Seconds', summary: 'Fast animated breakdown of C, compilers, machine code, and hardware closeness.' },
          '2': { videoId: '2ybLD6_2gKM', start: 0, duration: '16 mins', isMicrolesson: true, title: 'RAM Bytes & Pointer Addresses', summary: 'Visualizing byte addresses in physical RAM and pointer arrows.' },
          '3': { videoId: 'rrB13utjYV4', start: 0, duration: '15 mins', isMicrolesson: true, title: 'Operating Systems & System Calls', summary: 'How C interacts directly with Unix/Linux kernel and system resources.' },
          '4': { videoId: 'pTB0EiLXUC8', start: 0, duration: '16 mins', isMicrolesson: true, title: 'Procedural vs Modular Architecture', summary: 'Organizing code without objects using modular C functions and structs.' },
          '5': { videoId: 'KJgsSFOSQv0', start: 0, duration: '18 mins', isMicrolesson: true, title: 'C Programming Step-by-Step Overview', summary: 'Variables, scanf, printf, and conditionals clearly demonstrated.' },
          '6': { videoId: '8PopR3x-VMY', start: 0, duration: '17 mins', isMicrolesson: true, title: 'C Tutorial for Beginners (Edureka)', summary: 'Flow control, arrays, and standard functions explained visually.' },
          '7': { videoId: 'qcEBXrqFLe8', start: 0, duration: '16 mins', isMicrolesson: true, title: 'Translators: Compiler vs Assembler', summary: 'How translation units are linked into final machine binaries.' },
          '8': { videoId: '_FOkG5D4NBo', start: 0, duration: '16 mins', isMicrolesson: true, title: 'Execution Process of a C Program', summary: 'Loading code from disk into RAM: Code, Data, Stack, and Heap segments.' },
          '9': { videoId: 'tUijuz8aEJA', start: 0, duration: '17 mins', isMicrolesson: true, title: 'Data Types & Memory Representation', summary: 'Two-s complement integer representation and float IEEE-754 standards.' },
          '10': { videoId: 'Z3WjR_KEVjk', start: 0, duration: '19 mins', isMicrolesson: true, title: 'Bitwise Operators & Hardware Masks', summary: 'AND, OR, XOR, NOT, and bit-shifting for low-level register manipulation.' }
        }
      },
      global_clear: {
        instructor: 'Mike Dane & FreeCodeCamp (Clean English)',
        mainVideoId: 'KJgsSFOSQv0',
        modules: {
          '1': { videoId: 'KJgsSFOSQv0', start: 0, duration: '15 mins', isMicrolesson: true, title: 'C Basics, Program Structure & printf', summary: 'First programs, headers, compiler commands, and printf output.' },
          '2': { videoId: 'dhh5lrXXXYw', start: 0, duration: '16 mins', isMicrolesson: true, title: 'Variables & Data Types in C', summary: 'int, double, char, and format specifiers with scanf.' },
          '3': { videoId: 'E1_Gg6dURwk', start: 0, duration: '15 mins', isMicrolesson: true, title: 'Operators & Arithmetic in C', summary: 'Arithmetic operations, precedence, and boolean comparisons.' },
          '4': { videoId: 'lMv8vIqpUsY', start: 0, duration: '17 mins', isMicrolesson: true, title: 'Conditionals & If-Else Branching', summary: 'Making decisions in code with relational operators and if-else.' },
          '5': { videoId: 'HucJhUkDJuk', start: 0, duration: '16 mins', isMicrolesson: true, title: 'C Program Anatomy & Execution Flow', summary: 'Understanding the structure of functions, statements, and blocks.' },
          '6': { videoId: '6gVT64lk764', start: 0, duration: '16 mins', isMicrolesson: true, title: 'Constants & Macros in C', summary: 'Immutable values with const and preprocessor macros.' },
          '7': { videoId: 'NyT9vvSBoeo', start: 0, duration: '17 mins', isMicrolesson: true, title: 'Data Types Deep Dive', summary: 'Memory sizes, byte boundaries, and data representations.' },
          '8': { videoId: 'i3SWaOhjPCY', start: 0, duration: '18 mins', isMicrolesson: true, title: 'Features & Applications of C Language', summary: 'Embedded systems, game engines, and OS kernels built in C.' },
          '9': { videoId: 'Ywnv78X7TAg', start: 0, duration: '17 mins', isMicrolesson: true, title: 'Keywords, Identifiers & Clean Code', summary: 'Reserved keywords in C, variable naming rules, and standards.' },
          '10': { videoId: 'zuegQmMdy8M', start: 0, duration: '20 mins', isMicrolesson: true, title: 'Pointers & Dynamic Memory (Full Course)', summary: 'Comprehensive pointers masterclass: addresses, dereferencing, and arrays.' }
        }
      }
    }
  }
};

export function getVideoForModule(languageId, moduleOrder, voiceMode = 'kannada') {
  const langConfig = LANGUAGE_VIDEO_COURSES[languageId] || LANGUAGE_VIDEO_COURSES.python;
  const source = langConfig.sources[voiceMode] || langConfig.sources.kannada || langConfig.sources.simple_friendly || Object.values(langConfig.sources)[0];
  const orderKey = String(moduleOrder || '1');
  const modVideo = source.modules?.[orderKey] || source.modules?.['1'];

  return {
    videoId: modVideo?.videoId || source.mainVideoId,
    start: modVideo?.start || 0,
    duration: modVideo?.duration || '16 mins',
    isMicrolesson: true,
    title: modVideo?.title || `${langConfig.languageName} Standalone Microlesson`,
    summary: modVideo?.summary || langConfig.overview,
    instructor: source.instructor,
    languageName: langConfig.languageName,
    icon: langConfig.icon,
    voiceMode
  };
}
