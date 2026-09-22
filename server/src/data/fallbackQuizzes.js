// Curated fallback quizzes for CodePath languages
// Ensures 100% reliable quiz generation even if the external RAG microservice is offline or rate-limited.

const FALLBACK_QUIZZES = {
  python: [
    {
      type: 'mcq',
      question: 'Which of the following is the correct file extension for Python files?',
      options: ['.pt', '.py', '.python', '.pyt'],
      correctAnswer: '.py',
      explanation: 'Python source files end with the .py extension.'
    },
    {
      type: 'mcq',
      question: 'How are code blocks defined in Python?',
      options: ['Curly braces {}', 'Indentation (whitespace)', 'Parentheses ()', 'Begin and End keywords'],
      correctAnswer: 'Indentation (whitespace)',
      explanation: 'Python uses indentation (conventionally 4 spaces) rather than curly braces to define blocks.'
    },
    {
      type: 'mcq',
      question: 'What is the output of print(type([])) in Python?',
      options: ["<class 'list'>", "<class 'tuple'>", "<class 'array'>", "<class 'dict'>"],
      correctAnswer: "<class 'list'>",
      explanation: 'Square brackets [] declare a list in Python.'
    },
    {
      type: 'mcq',
      question: 'Which keyword is used to define a function in Python?',
      options: ['func', 'function', 'def', 'define'],
      correctAnswer: 'def',
      explanation: 'The "def" keyword is used to declare a function in Python.'
    },
    {
      type: 'mcq',
      question: 'What does the len() function return when passed a dictionary?',
      options: ['The number of key-value pairs', 'The total memory size in bytes', 'The number of values only', 'The length of the first key'],
      correctAnswer: 'The number of key-value pairs',
      explanation: 'len() on a dictionary returns the count of top-level keys (pairs).'
    },
    {
      type: 'mcq',
      question: 'Which method adds an element to the end of a Python list?',
      options: ['push()', 'add()', 'append()', 'insert()'],
      correctAnswer: 'append()',
      explanation: 'list.append(item) adds an element to the end of a list in-place.'
    },
    {
      type: 'mcq',
      question: 'Which block in Python handles runtime exceptions safely?',
      options: ['try...except', 'try...catch', 'do...rescue', 'attempt...error'],
      correctAnswer: 'try...except',
      explanation: 'Python uses "try" and "except" blocks to catch and handle exceptions.'
    },
    {
      type: 'mcq',
      question: 'What does "is" compare in Python as opposed to "=="?',
      options: ['Value equality', 'Object memory identity', 'Data type only', 'String length'],
      correctAnswer: 'Object memory identity',
      explanation: '"is" checks whether two variables point to the exact same object in memory, while "==" checks value equality.'
    },
    {
      type: 'true_false',
      question: 'In Python, strings are immutable (cannot be changed in-place once created).',
      options: ['True', 'False'],
      correctAnswer: 'True',
      explanation: 'Strings in Python are immutable; modifying operations return a new string object.'
    },
    {
      type: 'code_output',
      question: 'What is the output of this code?\n\ndef add(a, b=5):\n    return a + b\n\nprint(add(3))',
      correctAnswer: '8',
      explanation: 'add(3) uses default parameter b=5, yielding 3 + 5 = 8.'
    }
  ],

  java: [
    {
      type: 'mcq',
      question: 'What does the JVM stand for in Java development?',
      options: ['Java Virtual Machine', 'Java Variable Manager', 'Java Vector Model', 'Java Visual Mode'],
      correctAnswer: 'Java Virtual Machine',
      explanation: 'JVM stands for Java Virtual Machine, which executes compiled Java bytecode.'
    },
    {
      type: 'mcq',
      question: 'Which keyword creates an instance of a class in Java?',
      options: ['make', 'alloc', 'new', 'create'],
      correctAnswer: 'new',
      explanation: 'The "new" keyword allocates memory on the heap and calls the class constructor.'
    },
    {
      type: 'mcq',
      question: 'Which primitive data type is used to store decimal floating-point numbers with single precision?',
      options: ['double', 'float', 'decimal', 'real'],
      correctAnswer: 'float',
      explanation: 'In Java, "float" is a 32-bit single-precision floating point type.'
    },
    {
      type: 'mcq',
      question: 'What is the size of an int in Java?',
      options: ['16 bits', '32 bits', '64 bits', 'Platform dependent'],
      correctAnswer: '32 bits',
      explanation: 'In Java, an int is always 32 bits (4 bytes) signed across all platforms.'
    },
    {
      type: 'mcq',
      question: 'Which access modifier makes a class member visible only within its own class?',
      options: ['public', 'protected', 'package-private', 'private'],
      correctAnswer: 'private',
      explanation: '"private" restricts visibility to only within the declaring class.'
    },
    {
      type: 'mcq',
      question: 'Which method should you use to check string value equality in Java?',
      options: ['==', 'equals()', 'matches()', 'sameAs()'],
      correctAnswer: 'equals()',
      explanation: '== compares memory references, while .equals() compares the actual character contents of strings.'
    },
    {
      type: 'mcq',
      question: 'Which keyword is used to inherit a class in Java?',
      options: ['implements', 'inherits', 'extends', 'super'],
      correctAnswer: 'extends',
      explanation: 'Java uses "extends" for class inheritance and "implements" for interfaces.'
    },
    {
      type: 'mcq',
      question: 'What is the base class of all classes in the Java standard library?',
      options: ['java.lang.System', 'java.lang.Object', 'java.lang.Class', 'java.lang.Root'],
      correctAnswer: 'java.lang.Object',
      explanation: 'java.lang.Object is the ultimate root of the Java class hierarchy.'
    },
    {
      type: 'true_false',
      question: 'Java does not support multiple inheritance of classes.',
      options: ['True', 'False'],
      correctAnswer: 'True',
      explanation: 'Java allows a class to extend only one superclass (avoiding diamond inheritance problems), though it can implement multiple interfaces.'
    },
    {
      type: 'code_output',
      question: 'What does this program print?\n\nint x = 10;\nint y = 3;\nSystem.out.print(x / y);',
      correctAnswer: '3',
      explanation: 'Integer division in Java truncates the decimal part, so 10 / 3 equals 3.'
    }
  ],

  cpp: [
    {
      type: 'mcq',
      question: 'Which operator is used to access members of an object through a pointer in C++?',
      options: ['.', '->', '::', '&'],
      correctAnswer: '->',
      explanation: 'The arrow operator (->) dereferences the pointer and accesses the member (equivalent to (*ptr).member).'
    },
    {
      type: 'mcq',
      question: 'What does STL stand for in C++?',
      options: ['Standard Template Library', 'Simple Type Layout', 'Structured Tracking Language', 'Static Type Linker'],
      correctAnswer: 'Standard Template Library',
      explanation: 'STL stands for Standard Template Library, providing containers, iterators, and algorithms.'
    },
    {
      type: 'mcq',
      question: 'Which header file is required to use std::cout and std::cin?',
      options: ['<stdio.h>', '<iostream>', '<conio.h>', '<string>'],
      correctAnswer: '<iostream>',
      explanation: '<iostream> contains declarations for standard input and output stream objects.'
    },
    {
      type: 'mcq',
      question: 'What is the purpose of the "virtual" keyword in a C++ base class method?',
      options: ['To make the method run faster', 'To enable dynamic runtime polymorphism / method overriding', 'To declare a global variable', 'To prevent inheritance'],
      correctAnswer: 'To enable dynamic runtime polymorphism / method overriding',
      explanation: 'virtual enables dynamic dispatch via vtable so derived class overrides are called through base pointers.'
    },
    {
      type: 'mcq',
      question: 'Which STL container provides dynamic contiguous array storage with fast random access?',
      options: ['std::list', 'std::vector', 'std::map', 'std::set'],
      correctAnswer: 'std::vector',
      explanation: 'std::vector manages a contiguous dynamic array with O(1) random access.'
    },
    {
      type: 'mcq',
      question: 'Which operator is used to allocate dynamic memory on the free store (heap) in C++?',
      options: ['malloc', 'alloc', 'new', 'create'],
      correctAnswer: 'new',
      explanation: 'C++ uses "new" (and "delete") for type-safe heap allocation and constructor invocation.'
    },
    {
      type: 'mcq',
      question: 'What happens when a C++ reference is declared?',
      options: ['A new variable copy is created', 'It becomes an alias to an existing object and cannot be reseated', 'It automatically points to null', 'It allocates 64 bits on heap'],
      correctAnswer: 'It becomes an alias to an existing object and cannot be reseated',
      explanation: 'A reference (&) is an alias to an existing object; it must be initialized upon declaration and cannot refer to another object later.'
    },
    {
      type: 'mcq',
      question: 'What is RAII in modern C++?',
      options: ['Random Array Index Initialization', 'Resource Acquisition Is Initialization', 'Runtime Algorithm Iteration Index', 'Rapid Application Interface Integration'],
      correctAnswer: 'Resource Acquisition Is Initialization',
      explanation: 'RAII binds resource management (memory, file handles, locks) to object lifetime, automatically releasing resources in destructors.'
    },
    {
      type: 'true_false',
      question: 'In C++, destructors can take parameters.',
      options: ['True', 'False'],
      correctAnswer: 'False',
      explanation: 'A destructor in C++ takes no arguments and has no return value (~ClassName()).'
    },
    {
      type: 'code_output',
      question: 'What is the output of this code?\n\nint a = 5;\nint& ref = a;\nref += 3;\nstd::cout << a;',
      correctAnswer: '8',
      explanation: 'ref is an alias for a. Modifying ref directly changes a to 5 + 3 = 8.'
    }
  ],

  c: [
    {
      type: 'mcq',
      question: 'Which standard library function is used to dynamically allocate memory in C?',
      options: ['alloc()', 'malloc()', 'create()', 'new()'],
      correctAnswer: 'malloc()',
      explanation: 'malloc() allocates the specified number of bytes in heap memory and returns a void pointer.'
    },
    {
      type: 'mcq',
      question: 'What does the & (ampersand) operator do when placed before a variable in C?',
      options: ['Dereferences the pointer', 'Returns the memory address of the variable', 'Performs logical AND', 'Multiplies by 2'],
      correctAnswer: 'Returns the memory address of the variable',
      explanation: '& is the address-of operator in C, producing a pointer to the variable.'
    },
    {
      type: 'mcq',
      question: 'How are strings represented in the C language?',
      options: ['An instance of string class', 'An array of characters terminated by a null character (\\0)', 'A dynamic vector of bytes', 'A linked list of characters'],
      correctAnswer: 'An array of characters terminated by a null character (\\0)',
      explanation: 'In C, strings are null-terminated character arrays.'
    },
    {
      type: 'mcq',
      question: 'Which format specifier is used with printf() to print an integer?',
      options: ['%s', '%f', '%d', '%c'],
      correctAnswer: '%d',
      explanation: '%d (or %i) format specifier formats signed decimal integers in printf().'
    },
    {
      type: 'mcq',
      question: 'What must you always do with dynamically allocated memory allocated with malloc() when done?',
      options: ['delete it', 'free() it', 'close() it', 'clear() it'],
      correctAnswer: 'free() it',
      explanation: 'Every malloc() should be paired with free() to avoid memory leaks.'
    },
    {
      type: 'mcq',
      question: 'What is the correct syntax to declare a pointer to an integer in C?',
      options: ['int ptr;', 'int* ptr;', 'ptr int;', 'pointer<int> ptr;'],
      correctAnswer: 'int* ptr;',
      explanation: 'int* ptr declares a pointer variable that stores the memory address of an integer.'
    },
    {
      type: 'mcq',
      question: 'What does the sizeof operator return in C?',
      options: ['Number of bits', 'Size in bytes of an object or type', 'Length of string', 'Pointer address'],
      correctAnswer: 'Size in bytes of an object or type',
      explanation: 'sizeof returns the size in bytes (as size_t) of its operand.'
    },
    {
      type: 'mcq',
      question: 'Which keyword creates a user-defined composite data type grouping multiple variables in C?',
      options: ['class', 'struct', 'object', 'record'],
      correctAnswer: 'struct',
      explanation: 'struct groups variables of different types under a single composite type.'
    },
    {
      type: 'true_false',
      question: 'In C, arrays are passed to functions by value (a full copy of the entire array is made).',
      options: ['True', 'False'],
      correctAnswer: 'False',
      explanation: 'In C, array names decay to a pointer to their first element when passed to functions, passing by reference rather than copying.'
    },
    {
      type: 'code_output',
      question: 'What is the output of this C code?\n\nint x = 7;\nint* p = &x;\n*p = 12;\nprintf("%d", x);',
      correctAnswer: '12',
      explanation: 'Dereferencing p (*p) modifies the value stored at the address of x, making x = 12.'
    }
  ]
};

function getFallbackQuiz(languageId) {
  const list = FALLBACK_QUIZZES[languageId] || FALLBACK_QUIZZES.python;
  return JSON.parse(JSON.stringify(list));
}

module.exports = { FALLBACK_QUIZZES, getFallbackQuiz };
