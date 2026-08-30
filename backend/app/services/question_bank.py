from typing import Dict, Any, List

def get_python_questions() -> List[Dict[str, Any]]:
    # Curated Python Question Bank (30 questions: 10 Easy, 12 Medium, 8 Hard)
    return [
        # --- EASY (10) ---
        {
            "id": 101, "technology": "Python", "concept": "Syntax", "difficulty": "Easy",
            "question_text": "Which of the following is the correct syntax to define a function in Python?",
            "options": ["func myFunc():", "def myFunc():", "function myFunc() {}", "create def myFunc():"],
            "correct_answer_index": 1,
            "explanation": "In Python, functions are defined using the 'def' keyword followed by the function name and parentheses.",
            "skill_name": "Python"
        },
        {
            "id": 102, "technology": "Python", "concept": "Data Types", "difficulty": "Easy",
            "question_text": "What type of data structure is enclosed in square brackets `[]` in Python?",
            "options": ["Tuple", "Dictionary", "List", "Set"],
            "correct_answer_index": 2,
            "explanation": "Lists in Python are mutable sequences defined using square brackets `[]`.",
            "skill_name": "Python"
        },
        {
            "id": 103, "technology": "Python", "concept": "Variables", "difficulty": "Easy",
            "question_text": "Which keyword is used to convert a variable into a global variable inside a function scope?",
            "options": ["global", "extern", "public", "universal"],
            "correct_answer_index": 0,
            "explanation": "The 'global' keyword allows you to modify a variable outside of the current local scope.",
            "skill_name": "Python"
        },
        {
            "id": 104, "technology": "Python", "concept": "Data Types", "difficulty": "Easy",
            "question_text": "What is the output of `bool([])` in Python?",
            "options": ["True", "False", "None", "TypeError"],
            "correct_answer_index": 1,
            "explanation": "An empty list `[]` evaluates to False in boolean context in Python.",
            "skill_name": "Python"
        },
        {
            "id": 105, "technology": "Python", "concept": "Operators", "difficulty": "Easy",
            "question_text": "Which operator is used for integer floor division in Python?",
            "options": ["/", "//", "%", "div"],
            "correct_answer_index": 1,
            "explanation": "The `//` operator performs integer division, discarding any fractional remainder.",
            "skill_name": "Python"
        },
        {
            "id": 106, "technology": "Python", "concept": "String Formatting", "difficulty": "Easy",
            "question_text": "Which string prefix is used for formatted string literals (f-strings) in Python 3.6+?",
            "options": ["s", "f", "r", "b"],
            "correct_answer_index": 1,
            "explanation": "Prefixing a string literal with `f` or `F` allows expressions inside `{}` to be evaluated at runtime.",
            "skill_name": "Python"
        },
        {
            "id": 107, "technology": "Python", "concept": "Data Types", "difficulty": "Easy",
            "question_text": "Which built-in Python data structure does NOT allow duplicate elements?",
            "options": ["List", "Tuple", "Set", "Dictionary Keys Value List"],
            "correct_answer_index": 2,
            "explanation": "A `Set` is an unordered collection of unique elements with no duplicates allowed.",
            "skill_name": "Python"
        },
        {
            "id": 108, "technology": "Python", "concept": "Control Flow", "difficulty": "Easy",
            "question_text": "Which statement is used to terminate a loop prematurely in Python?",
            "options": ["exit", "continue", "break", "stop"],
            "correct_answer_index": 2,
            "explanation": "The `break` statement immediately terminates the loop in which it is executed.",
            "skill_name": "Python"
        },
        {
            "id": 109, "technology": "Python", "concept": "Modules", "difficulty": "Easy",
            "question_text": "Which built-in module provides functions for interacting with the operating system in Python?",
            "options": ["sys", "os", "system", "io"],
            "correct_answer_index": 1,
            "explanation": "The `os` module in Python provides a portable way of using operating system dependent functionality.",
            "skill_name": "Python"
        },
        {
            "id": 110, "technology": "Python", "concept": "File Handling", "difficulty": "Easy",
            "question_text": "Which mode is used with `open()` to append data to an existing file without overwriting?",
            "options": ["'r'", "'w'", "'a'", "'x'"],
            "correct_answer_index": 2,
            "explanation": "The `'a'` mode opens a file for appending, creating the file if it does not exist.",
            "skill_name": "Python"
        },

        # --- MEDIUM (12) ---
        {
            "id": 111, "technology": "Python", "concept": "OOP", "difficulty": "Medium",
            "question_text": "What is the purpose of the `__init__` method in Python classes?",
            "options": ["Destroys class objects", "Acts as the class constructor to initialize attributes", "Defines static class properties", "Creates a private module scope"],
            "correct_answer_index": 1,
            "explanation": "The `__init__` method is the initializer method automatically invoked when instantiating a new class object.",
            "skill_name": "Python"
        },
        {
            "id": 112, "technology": "Python", "concept": "Exception Handling", "difficulty": "Medium",
            "question_text": "In Python exception handling, when is the `finally` block executed?",
            "options": ["Only if an exception is raised", "Only if NO exception is raised", "Always, regardless of whether an exception occurred or not", "Only inside a loop"],
            "correct_answer_index": 2,
            "explanation": "The `finally` block is guaranteed to execute whether an exception occurred or not.",
            "skill_name": "Python"
        },
        {
            "id": 113, "technology": "Python", "concept": "Comprehensions", "difficulty": "Medium",
            "question_text": "What is the output of `[x * 2 for x in range(3)]` in Python?",
            "options": ["[0, 2, 4]", "[2, 4, 6]", "[0, 1, 2]", "[1, 2, 3]"],
            "correct_answer_index": 0,
            "explanation": "`range(3)` produces 0, 1, 2. Multiplying each by 2 yields `[0, 2, 4]`.",
            "skill_name": "Python"
        },
        {
            "id": 114, "technology": "Python", "concept": "Generators", "difficulty": "Medium",
            "question_text": "Which keyword turns a standard function into a generator function in Python?",
            "options": ["generate", "return", "yield", "produce"],
            "correct_answer_index": 2,
            "explanation": "The `yield` keyword pauses function execution and returns a generator object iterator.",
            "skill_name": "Python"
        },
        {
            "id": 115, "technology": "Python", "concept": "Decorators", "difficulty": "Medium",
            "question_text": "What is a decorator in Python?",
            "options": ["A tool to add CSS styles to console output", "A function that takes another function as an argument and extends its behavior", "A special class for graphics design", "A package manager for virtual environments"],
            "correct_answer_index": 1,
            "explanation": "A decorator wraps another function to dynamically alter or extend its functionality without modifying source code.",
            "skill_name": "Python"
        },
        {
            "id": 116, "technology": "Python", "concept": "Iterators", "difficulty": "Medium",
            "question_text": "Which two dunder methods must an object implement to adhere to the Python iterator protocol?",
            "options": ["`__open__` and `__close__`", "`__iter__` and `__next__`", "`__get__` and `__set__`", "`__init__` and `__str__`"],
            "correct_answer_index": 1,
            "explanation": "An iterator object must implement `__iter__()` returning itself and `__next__()` returning the next item.",
            "skill_name": "Python"
        },
        {
            "id": 117, "technology": "Python", "concept": "OOP", "difficulty": "Medium",
            "question_text": "How do you achieve method overriding in a Python subclass?",
            "options": ["Use the `@override` decorator exclusively", "Define a method in the subclass with the exact same name as in the superclass", "Call `super().override()`", "Subclass overriding is disallowed in Python"],
            "correct_answer_index": 1,
            "explanation": "Defining a method in a subclass with the same signature as a parent class method overrides the parent's implementation.",
            "skill_name": "Python"
        },
        {
            "id": 118, "technology": "Python", "concept": "Functions", "difficulty": "Medium",
            "question_text": "What does `*args` unpack into a function parameter in Python?",
            "options": ["A dictionary of named arguments", "A tuple of positional arguments", "A list of keyword arguments", "A set of unique parameters"],
            "correct_answer_index": 1,
            "explanation": "`*args` allows a function to accept any number of positional arguments passed as a tuple.",
            "skill_name": "Python"
        },
        {
            "id": 119, "technology": "Python", "concept": "Functions", "difficulty": "Medium",
            "question_text": "What does `**kwargs` unpack into a function parameter in Python?",
            "options": ["A dictionary of keyword arguments", "A tuple of positional arguments", "A list of functions", "A generator iterator"],
            "correct_answer_index": 0,
            "explanation": "`**kwargs` allows a function to accept arbitrary keyword arguments captured in a dictionary.",
            "skill_name": "Python"
        },
        {
            "id": 120, "technology": "Python", "concept": "Memory Management", "difficulty": "Medium",
            "question_text": "How does Python handle memory management and garbage collection?",
            "options": ["Manual allocation with `malloc` and `free`", "Reference counting combined with a cyclic garbage collector", "Zero memory management", "Compile-time scope borrowing only"],
            "correct_answer_index": 1,
            "explanation": "Python uses reference counting as its primary memory management strategy alongside a cyclic garbage collector for circular references.",
            "skill_name": "Python"
        },
        {
            "id": 121, "technology": "Python", "concept": "Modules", "difficulty": "Medium",
            "question_text": "What does the expression `if __name__ == '__main__':` check in a Python script?",
            "options": ["Checks if Python is installed on main OS", "Checks if the script is being executed directly rather than imported as a module", "Checks if the main memory is sufficient", "Checks if the function is global"],
            "correct_answer_index": 1,
            "explanation": "It checks whether the file is being run as the primary entry point script or being imported elsewhere.",
            "skill_name": "Python"
        },
        {
            "id": 122, "technology": "Python", "concept": "Data Types", "difficulty": "Medium",
            "question_text": "What is the difference between `deepcopy` and `shallow copy` in Python's `copy` module?",
            "options": ["Deepcopy creates a new container and recursively copies nested objects; shallow copy copies references", "Shallow copy copies sub-objects while deepcopy ignores them", "There is no difference", "Deepcopy is for strings only"],
            "correct_answer_index": 0,
            "explanation": "Shallow copy constructs a new object but inserts references into child objects; deepcopy constructs a brand-new recursive copy.",
            "skill_name": "Python"
        },

        # --- HARD (8) ---
        {
            "id": 123, "technology": "Python", "concept": "Advanced Python", "difficulty": "Hard",
            "question_text": "What is the Global Interpreter Lock (GIL) in CPython?",
            "options": ["A security firewall for web sockets", "A mutex that prevents multiple native threads from executing Python bytecodes at once", "A tool for memory encryption", "A bytecode optimizer"],
            "correct_answer_index": 1,
            "explanation": "The CPython GIL is a thread lock enforcing that only one thread executes Python bytecode at a time, limiting multi-threaded CPU bound tasks.",
            "skill_name": "Python"
        },
        {
            "id": 124, "technology": "Python", "concept": "Advanced Python", "difficulty": "Hard",
            "question_text": "What is a metaclass in Python?",
            "options": ["A class that inherits from multiple parent classes", "A class whose instances are themselves classes", "A class created inside a function", "An interface definition"],
            "correct_answer_index": 1,
            "explanation": "In Python, metaclasses are the 'classes of classes'. Metaclasses define how classes behave, instantiate, and initialize.",
            "skill_name": "Python"
        },
        {
            "id": 125, "technology": "Python", "concept": "Decorators", "difficulty": "Hard",
            "question_text": "Why is `functools.wraps` recommended when building custom decorator functions?",
            "options": ["It accelerates decorator execution speed by 10x", "It preserves the original function's metadata such as `__name__` and `__doc__`", "It prevents garbage collection", "It converts functions into C-extensions"],
            "correct_answer_index": 1,
            "explanation": "`functools.wraps` copies docstrings, name, parameter annotations, and docstrings from wrapped functions back to wrapper functions.",
            "skill_name": "Python"
        },
        {
            "id": 126, "technology": "Python", "concept": "Concurrency", "difficulty": "Hard",
            "question_text": "In Python's `asyncio` event loop, what is the key difference between `asyncio.gather` and `asyncio.wait`?",
            "options": ["`gather` returns futures in completion order; `wait` maintains input order", "`gather` wraps multiple awaitables and returns results as a list; `wait` provides fine-grained control over individual task completion states", "`gather` executes synchronously; `wait` is asynchronous", "They are identical aliases"],
            "correct_answer_index": 1,
            "explanation": "`asyncio.gather` waits for a list of awaitables returning their results, while `asyncio.wait` returns done/pending sets upon configurable conditions.",
            "skill_name": "Python"
        },
        {
            "id": 127, "technology": "Python", "concept": "Context Managers", "difficulty": "Hard",
            "question_text": "Which magic methods are required to implement a custom class context manager for use with the `with` statement?",
            "options": ["`__open__` and `__close__`", "`__enter__` and `__exit__`", "`__start__` and `__stop__`", "`__init__` and `__del__`"],
            "correct_answer_index": 1,
            "explanation": "Context managers implement `__enter__()` (allocating resource) and `__exit__()` (releasing resource and handling exceptions).",
            "skill_name": "Python"
        },
        {
            "id": 128, "technology": "Python", "concept": "Advanced Python", "difficulty": "Hard",
            "question_text": "What is method resolution order (MRO) in Python multiple inheritance, and which algorithm does it use?",
            "options": ["Breadth-First Search (BFS)", "Depth-First Search (DFS)", "C3 Linearization algorithm", "Dijkstra's Shortest Path"],
            "correct_answer_index": 2,
            "explanation": "Python uses C3 Linearization to determine method resolution order in complex multiple inheritance hierarchies.",
            "skill_name": "Python"
        },
        {
            "id": 129, "technology": "Python", "concept": "Advanced Python", "difficulty": "Hard",
            "question_text": "What happens when you use `__slots__` inside a Python class definition?",
            "options": ["It converts the class into a database schema", "It restricts attribute creation to a fixed set and eliminates the instance `__dict__` for memory optimization", "It disables inheritance", "It makes all methods static"],
            "correct_answer_index": 1,
            "explanation": "`__slots__` reduces memory usage per instance by suppressing the dynamic `__dict__` attribute dictionary.",
            "skill_name": "Python"
        },
        {
            "id": 130, "technology": "Python", "concept": "Advanced Python", "difficulty": "Hard",
            "question_text": "How does `sys.setrecursionlimit()` affect Python execution?",
            "options": ["Limits max memory usage in MB", "Sets max depth of the Python call stack to prevent stack overflow crashes", "Sets CPU execution timeout", "Sets dynamic garbage collection threshold"],
            "correct_answer_index": 1,
            "explanation": "`sys.setrecursionlimit()` configures maximum interpreter call stack depth for recursive function execution.",
            "skill_name": "Python"
        }
    ]

def get_react_questions() -> List[Dict[str, Any]]:
    # Curated React Question Bank (30 questions: 10 Easy, 12 Medium, 8 Hard)
    return [
        # --- EASY (10) ---
        {"id": 201, "technology": "React", "concept": "JSX", "difficulty": "Easy", "question_text": "What is JSX in React?", "options": ["JavaScript XML extension allowing HTML-like code inside JS", "A database query language", "A CSS preprocessor", "A JSON parser"], "correct_answer_index": 0, "explanation": "JSX is a syntax extension for JavaScript that allows writing HTML-like element tags inside JS files.", "skill_name": "React"},
        {"id": 202, "technology": "React", "concept": "Hooks", "difficulty": "Easy", "question_text": "Which React Hook is used to manage local component state in functional components?", "options": ["useEffect", "useState", "useContext", "useReducer"], "correct_answer_index": 1, "explanation": "`useState` is the core React hook for introducing reactive local state variables.", "skill_name": "React"},
        {"id": 203, "technology": "React", "concept": "Props", "difficulty": "Easy", "question_text": "How are properties passed down to child components in React?", "options": ["Via global state", "Via component props", "Via CSS classes", "Via window object"], "correct_answer_index": 1, "explanation": "Props (short for properties) allow unidirectional data flow from parent to child components.", "skill_name": "React"},
        {"id": 204, "technology": "React", "concept": "JSX", "difficulty": "Easy", "question_text": "In JSX, which attribute is used instead of standard HTML `class`?", "options": ["className", "class", "styleClass", "elementClass"], "correct_answer_index": 0, "explanation": "`className` is used in JSX because `class` is a reserved keyword in JavaScript.", "skill_name": "React"},
        {"id": 205, "technology": "React", "concept": "Hooks", "difficulty": "Easy", "question_text": "Which hook handles side effects like data fetching or DOM subscriptions in functional components?", "options": ["useMemo", "useState", "useEffect", "useCallback"], "correct_answer_index": 2, "explanation": "`useEffect` runs side effects after component rendering cycles.", "skill_name": "React"},
        {"id": 206, "technology": "React", "concept": "Rendering", "difficulty": "Easy", "question_text": "What must every React component return?", "options": ["A database cursor", "JSX elements, null, or a valid renderable React node", "A string representation of CSS", "A Promise"], "correct_answer_index": 1, "explanation": "React components render UI by returning JSX, arrays, strings, or null.", "skill_name": "React"},
        {"id": 207, "technology": "React", "concept": "Lists", "difficulty": "Easy", "question_text": "Why is the `key` prop required when rendering dynamic lists in React?", "options": ["It styles individual list items", "It helps React identify which items have changed, added, or removed for efficient DOM updates", "It sorts list items alphabetically", "It binds click listeners"], "correct_answer_index": 1, "explanation": "`key` props enable React's reconciliation algorithm to track list items across re-renders efficiently.", "skill_name": "React"},
        {"id": 208, "technology": "React", "concept": "Events", "difficulty": "Easy", "question_text": "How do you bind a click event handler to a button in React JSX?", "options": ["onclick={handleClick}", "onClick={handleClick}", "on-click={handleClick}", "click={handleClick}"], "correct_answer_index": 1, "explanation": "React event handlers use camelCase naming, like `onClick`.", "skill_name": "React"},
        {"id": 209, "technology": "React", "concept": "Components", "difficulty": "Easy", "question_text": "What is a functional component in modern React?", "options": ["A plain JS function that accepts props and returns JSX", "A class extending React.Component", "A database function", "A Web Worker process"], "correct_answer_index": 0, "explanation": "Functional components are standard JavaScript functions returning JSX elements.", "skill_name": "React"},
        {"id": 210, "technology": "React", "concept": "Forms", "difficulty": "Easy", "question_text": "What is a 'controlled component' in React forms?", "options": ["An input element whose value is driven by React state", "An input managed directly by browser DOM without React", "A hidden password field", "A component locked by server permissions"], "correct_answer_index": 0, "explanation": "A controlled component has its value tied directly to React state with onChange handlers updating state.", "skill_name": "React"},

        # --- MEDIUM (12) ---
        {"id": 211, "technology": "React", "concept": "Hooks", "difficulty": "Medium", "question_text": "What does passing an empty dependency array `[]` to `useEffect` accomplish?", "options": ["Runs effect on every re-render", "Runs effect only once after initial component mount", "Prevents effect execution completely", "Triggers unmount cleanup immediately"], "correct_answer_index": 1, "explanation": "An empty dependency array `[]` instructs React to execute the effect once after the initial render.", "skill_name": "React"},
        {"id": 212, "technology": "React", "concept": "Hooks", "difficulty": "Medium", "question_text": "What is the purpose of `useMemo` in React?", "options": ["Memorizes state values permanently in localStorage", "Memoizes the result of an expensive calculation across re-renders", "Creates a mutable ref container", "Handles HTTP error boundaries"], "correct_answer_index": 1, "explanation": "`useMemo` caches calculation results between renders until dependencies change.", "skill_name": "React"},
        {"id": 213, "technology": "React", "concept": "Hooks", "difficulty": "Medium", "question_text": "What is the purpose of `useCallback` in React?", "options": ["Memoizes a callback function instance between renders to prevent unnecessary child re-renders", "Fetches data asynchronously", "Renders fallback UI", "Manages form state validation"], "correct_answer_index": 0, "explanation": "`useCallback` returns a memoized version of the callback function that only changes when dependencies change.", "skill_name": "React"},
        {"id": 214, "technology": "React", "concept": "Context", "difficulty": "Medium", "question_text": "Which React API solves 'prop drilling' by sharing data globally across component trees?", "options": ["React Context API", "Redux Saga", "useRef", "React DOM Portal"], "correct_answer_index": 0, "explanation": "React Context provides a way to pass data through the component tree without manually passing props at every level.", "skill_name": "React"},
        {"id": 215, "technology": "React", "concept": "Hooks", "difficulty": "Medium", "question_text": "What is the difference between `useRef` and `useState`?", "options": ["Updating a `useRef` value does NOT trigger a component re-render; updating `useState` does", "`useRef` is for class components only", "`useState` does not persist values", "They are identical hooks"], "correct_answer_index": 0, "explanation": "Changing `.current` on a ref does not trigger a re-render, whereas calling a state updater function does.", "skill_name": "React"},
        {"id": 216, "technology": "React", "concept": "Performance", "difficulty": "Medium", "question_text": "What does `React.memo` do for functional components?", "options": ["Prevents a functional component from re-rendering if its props have not changed", "Enforces strict type checking", "Caches HTTP requests", "Automates bundle splitting"], "correct_answer_index": 0, "explanation": "`React.memo` is a higher-order component that skips rendering a component if its props are equal.", "skill_name": "React"},
        {"id": 217, "technology": "React", "concept": "State", "difficulty": "Medium", "question_text": "Why should React state never be mutated directly (e.g. `state.count = 5`)?", "options": ["Direct mutation breaks React's change detection and will not trigger a re-render", "JavaScript throws a syntax error", "Memory leakage occurs", "CSS styling resets"], "correct_answer_index": 0, "explanation": "React relies on immutable state updates to detect object reference changes and schedule DOM re-renders.", "skill_name": "React"},
        {"id": 218, "technology": "React", "concept": "Hooks", "difficulty": "Medium", "question_text": "When is `useReducer` preferred over `useState`?", "options": ["When managing complex state logic with multiple sub-values or next states dependent on previous ones", "When rendering static images", "When building simple toggle buttons", "When using class components"], "correct_answer_index": 0, "explanation": "`useReducer` is preferable when state transitions are complex or involve multiple sub-fields.", "skill_name": "React"},
        {"id": 219, "technology": "React", "concept": "Routing", "difficulty": "Medium", "question_text": "Which component in React Router v6 is used to render child route elements inside parent layouts?", "options": ["`<Outlet />`", "`<Switch />`", "`<RouteChild />`", "`<Layout />`"], "correct_answer_index": 0, "explanation": "`<Outlet />` renders the child route matching the current location inside nested route layouts.", "skill_name": "React"},
        {"id": 220, "technology": "React", "concept": "Cleanups", "difficulty": "Medium", "question_text": "How do you cleanup subscriptions or timers inside `useEffect`?", "options": ["Return a cleanup function from the `useEffect` callback", "Call `effect.destroy()`", "Pass a cleanup boolean flag", "Use `useUnmount` hook"], "correct_answer_index": 0, "explanation": "Returning a function from `useEffect` tells React to execute it on unmount or before running the effect again.", "skill_name": "React"},
        {"id": 221, "technology": "React", "concept": "Portals", "difficulty": "Medium", "question_text": "What is `ReactDOM.createPortal` used for?", "options": ["Rendering children into a DOM node that exists outside the DOM hierarchy of the parent component", "Building web socket servers", "Creating route transitions", "Server-side rendering HTML"], "correct_answer_index": 0, "explanation": "Portals provide a way to render children into a DOM node outside the parent component's DOM tree.", "skill_name": "React"},
        {"id": 222, "technology": "React", "concept": "Error Boundaries", "difficulty": "Medium", "question_text": "Which component lifecycle method must be implemented to create an Error Boundary in React?", "options": ["`componentDidCatch` or `getDerivedStateFromError`", "`componentDidUpdate`", "`useEffect`", "`renderError`"], "correct_answer_index": 0, "explanation": "Class components using `componentDidCatch` or `static getDerivedStateFromError` catch JS errors in child component trees.", "skill_name": "React"},

        # --- HARD (8) ---
        {"id": 223, "technology": "React", "concept": "Concurrent React", "difficulty": "Hard", "question_text": "What is the primary function of `useTransition` in React 18 Concurrent Features?", "options": ["Marks state updates as non-urgent transitions, keeping the UI responsive during heavy renders", "Transitions CSS animations", "Handles route navigation transitions", "Converts sync code into Web Worker code"], "correct_answer_index": 0, "explanation": "`useTransition` lets you mark updates as non-urgent, allowing urgent inputs like typing to interrupt rendering.", "skill_name": "React"},
        {"id": 224, "technology": "React", "concept": "Concurrent React", "difficulty": "Hard", "question_text": "How does `useDeferredValue` differ from standard debouncing in React 18?", "options": ["`useDeferredValue` adapts dynamically to device speed, interrupting deferral as soon as main thread is free", "`useDeferredValue` uses hardcoded setTimeout delays", "`useDeferredValue` runs on backend server", "They are identical"], "correct_answer_index": 0, "explanation": "`useDeferredValue` defers updating part of the UI without fixed timeouts, automatically prioritizing main thread responsiveness.", "skill_name": "React"},
        {"id": 225, "technology": "React", "concept": "Reconciliation", "difficulty": "Hard", "question_text": "What is Fiber in React's architecture?", "options": ["The ground-up rewrite of React's reconciliation engine enabling incremental rendering", "A CSS framework for React", "A build tool alternative to Vite", "A virtual DOM caching database"], "correct_answer_index": 0, "explanation": "React Fiber is the core reconciliation engine allowing work to be paused, aborted, or reused across render frames.", "skill_name": "React"},
        {"id": 226, "technology": "React", "concept": "Hooks", "difficulty": "Hard", "question_text": "What is the difference between `useLayoutEffect` and `useEffect`?", "options": ["`useLayoutEffect` runs synchronously after all DOM mutations but BEFORE the browser repaints; `useEffect` runs asynchronously after repaint", "`useEffect` blocks browser painting", "`useLayoutEffect` runs only on server", "They execute in identical order"], "correct_answer_index": 0, "explanation": "`useLayoutEffect` fires synchronously after DOM updates to measure layout before the browser visually repaints.", "skill_name": "React"},
        {"id": 227, "technology": "React", "concept": "Strict Mode", "difficulty": "Hard", "question_text": "Why does React 18 Strict Mode double-invoke effects (`useEffect`) in development mode?", "options": ["To stress-test component resilience when mounting, unmounting, and remounting for future state preservation features", "It is a bug in React 18", "To clear browser cookies", "To verify CSS selector specificity"], "correct_answer_index": 0, "explanation": "Strict Mode intentionally mounts, unmounts, and remounts components to ensure effects correctly clean up side effects.", "skill_name": "React"},
        {"id": 228, "technology": "React", "concept": "Server Components", "difficulty": "Hard", "question_text": "What is a key difference between React Server Components (RSC) and traditional SSR?", "options": ["RSC execute exclusively on the server and send zero JavaScript client bundle for that component to the browser", "RSC render only on client", "SSR requires node.js while RSC uses Python", "RSC cannot access databases"], "correct_answer_index": 0, "explanation": "RSC run only on the server, producing UI payloads that add 0 KB to the client-side JavaScript bundle size.", "skill_name": "React"},
        {"id": 229, "technology": "React", "concept": "Hooks", "difficulty": "Hard", "question_text": "What does `useImperativeHandle` do when paired with `forwardRef`?", "options": ["Customizes the instance value or imperative methods exposed to parent components when using refs", "Prevents prop drilling", "Forces synchronous state updates", "Cancels pending HTTP requests"], "correct_answer_index": 0, "explanation": "`useImperativeHandle` customizes the ref instance exposed to a parent component.", "skill_name": "React"},
        {"id": 230, "technology": "React", "concept": "Hydration", "difficulty": "Hard", "question_text": "What causes a 'Text content does not match server-rendered HTML' hydration error in React SSR?", "options": ["Mismatch between the HTML generated on the server and the initial DOM rendered on the client", "Invalid CSS syntax", "Slow database query", "Missing prop-types"], "correct_answer_index": 0, "explanation": "Hydration mismatches occur when client initial state/render differs from server-pre-rendered HTML.", "skill_name": "React"}
    ]

def get_machine_learning_questions() -> List[Dict[str, Any]]:
    # Curated Machine Learning Question Bank (30 questions: 10 Easy, 12 Medium, 8 Hard)
    return [
        # --- EASY (10) ---
        {"id": 301, "technology": "Machine Learning", "concept": "Supervised Learning", "difficulty": "Easy", "question_text": "What characterizes supervised learning algorithms?", "options": ["Training data includes both input features and target labels", "No ground-truth labels are provided", "Agent learns via reward penalties in an environment", "Data has zero feature dimensions"], "correct_answer_index": 0, "explanation": "Supervised learning trains on labeled dataset pairs consisting of input features and corresponding target outputs.", "skill_name": "Machine Learning"},
        {"id": 302, "technology": "Machine Learning", "concept": "Classification", "difficulty": "Easy", "question_text": "Which metric evaluates the proportion of correct predictions among total predictions?", "options": ["Accuracy", "MSE", "Log Loss", "Silhouette Score"], "correct_answer_index": 0, "explanation": "Accuracy measures total correct predictions divided by total dataset instances.", "skill_name": "Machine Learning"},
        {"id": 303, "technology": "Machine Learning", "concept": "Unsupervised Learning", "difficulty": "Easy", "question_text": "Which algorithm is a popular centroid-based clustering method in unsupervised learning?", "options": ["K-Means", "Linear Regression", "Logistic Regression", "Random Forest"], "correct_answer_index": 0, "explanation": "K-Means clusters unlabeled data points into k distinct non-overlapping clusters based on geometric centroids.", "skill_name": "Machine Learning"},
        {"id": 304, "technology": "Machine Learning", "concept": "Regression", "difficulty": "Easy", "question_text": "What is the primary target in linear regression?", "options": ["A continuous quantitative value", "A discrete categorical class", "An image pixel mask", "A graph adjacency matrix"], "correct_answer_index": 0, "explanation": "Regression models predict continuous real-valued numerical target quantities.", "skill_name": "Machine Learning"},
        {"id": 305, "technology": "Machine Learning", "concept": "Validation", "difficulty": "Easy", "question_text": "Why do data scientists split data into train and test sets?", "options": ["To evaluate model generalization on unseen data and detect overfitting", "To reduce RAM memory consumption", "To speed up CPU clock rate", "To encrypt target variables"], "correct_answer_index": 0, "explanation": "A holdout test split allows objective evaluation of how well a model generalizes to new, unseen examples.", "skill_name": "Machine Learning"},
        {"id": 306, "technology": "Machine Learning", "concept": "Overfitting", "difficulty": "Easy", "question_text": "What does 'overfitting' mean in machine learning?", "options": ["Model memorizes noise in training data and performs poorly on unseen test data", "Model is too simple to learn underlying patterns", "Model trains in under 1 second", "Model achieves zero training loss and perfect test generalization"], "correct_answer_index": 0, "explanation": "Overfitting occurs when a high-capacity model fits training noise, degrading test set performance.", "skill_name": "Machine Learning"},
        {"id": 307, "technology": "Machine Learning", "concept": "Feature Scaling", "difficulty": "Easy", "question_text": "What does StandardScaler do to input features in Scikit-Learn?", "options": ["Transforms data to have mean = 0 and standard deviation = 1", "Compresses data into binary 0 or 1", "Converts text to tokens", "Removes outliers automatically"], "correct_answer_index": 0, "explanation": "StandardScaler standardizes features by removing the mean and scaling to unit variance.", "skill_name": "Machine Learning"},
        {"id": 308, "technology": "Machine Learning", "concept": "Classification", "difficulty": "Easy", "question_text": "What is the output range of the standard sigmoid activation function?", "options": ["(0, 1)", "(-1, 1)", "(-inf, +inf)", "[0, 100]"], "correct_answer_index": 0, "explanation": "The sigmoid function maps any real number into the open probability interval (0, 1).", "skill_name": "Machine Learning"},
        {"id": 309, "technology": "Machine Learning", "concept": "Decision Trees", "difficulty": "Easy", "question_text": "Which criterion is commonly used to measure impurity when splitting nodes in a Decision Tree?", "options": ["Gini Impurity or Entropy", "MSE exclusively", "Euclidean Distance", "Cosine Similarity"], "correct_answer_index": 0, "explanation": "Decision tree classifiers typically evaluate candidate splits using Gini impurity or information entropy.", "skill_name": "Machine Learning"},
        {"id": 310, "technology": "Machine Learning", "concept": "Cross-Validation", "difficulty": "Easy", "question_text": "In 5-fold cross-validation, how many times is the model trained and evaluated?", "options": ["5 times", "1 time", "10 times", "25 times"], "correct_answer_index": 0, "explanation": "5-fold CV partitions data into 5 equal subsets, training on 4 folds and validating on 1 fold across 5 iterations.", "skill_name": "Machine Learning"},

        # --- MEDIUM (12) ---
        {"id": 311, "technology": "Machine Learning", "concept": "Bias-Variance", "difficulty": "Medium", "question_text": "A model with high bias and low variance suffers primarily from what issue?", "options": ["Underfitting", "Overfitting", "Data leakage", "Vanishing gradients"], "correct_answer_index": 0, "explanation": "High bias indicates an oversimplified model incapable of capturing underlying data patterns (underfitting).", "skill_name": "Machine Learning"},
        {"id": 312, "technology": "Machine Learning", "concept": "Ensemble Methods", "difficulty": "Medium", "question_text": "How does Random Forest reduce model variance compared to individual decision trees?", "options": ["By bootstrap aggregating (bagging) multiple deep trees with random feature subsampling", "By training sequentially on residuals", "By using L1 Lasso penalty", "By pruning tree depth to 1"], "correct_answer_index": 0, "explanation": "Random Forest builds diverse, decorrelated trees using bootstrap samples and random feature subsets, averaging predictions to lower variance.", "skill_name": "Machine Learning"},
        {"id": 313, "technology": "Machine Learning", "concept": "Boosting", "difficulty": "Medium", "question_text": "What distinguishes Gradient Boosting (e.g. XGBoost, LightGBM) from Random Forest?", "options": ["Gradient Boosting trains decision trees sequentially, with each new tree correcting residual errors of the ensemble", "Boosting trains trees completely in parallel without dependencies", "Boosting works only on unstructured text", "Boosting does not use loss functions"], "correct_answer_index": 0, "explanation": "Boosting builds trees sequentially, where subsequent learners optimize the gradient of the loss function against prior residuals.", "skill_name": "Machine Learning"},
        {"id": 314, "technology": "Machine Learning", "concept": "Regularization", "difficulty": "Medium", "question_text": "What is the primary effect of L1 (Lasso) regularization on linear model weights?", "options": ["Drives less important feature coefficients exactly to zero, performing automated feature selection", "Squares the weight penalties preventing any weight from reaching zero", "Multiplies learning rate by 2", "Inverts feature matrix"], "correct_answer_index": 0, "explanation": "L1 penalty introduces sparsity by penalizing absolute weight values, driving unimportant weights to zero.", "skill_name": "Machine Learning"},
        {"id": 315, "technology": "Machine Learning", "concept": "Regularization", "difficulty": "Medium", "question_text": "How does L2 (Ridge) regularization prevent overfitting in regression?", "options": ["Penalizes the squared magnitude of weights, shrinking them smoothly without setting them strictly to zero", "Forces coefficients to exactly zero", "Converts regression to logistic loss", "Removes training samples"], "correct_answer_index": 0, "explanation": "L2 regularization penalizes sum of squared coefficients, reducing model complexity and multicollinearity sensitivity.", "skill_name": "Machine Learning"},
        {"id": 316, "technology": "Machine Learning", "concept": "Evaluation Metrics", "difficulty": "Medium", "question_text": "When evaluating fraud detection on a 99.9% negative class dataset, why is Accuracy misleading?", "options": ["A trivial model predicting 'No Fraud' always achieves 99.9% accuracy while catching 0 fraud cases", "Accuracy calculation divides by zero", "Accuracy is only for regression", "Accuracy cannot be computed with float numbers"], "correct_answer_index": 0, "explanation": "On imbalanced datasets, majority class dominance distorts accuracy; Precision, Recall, and PR-AUC are far more informative.", "skill_name": "Machine Learning"},
        {"id": 317, "technology": "Machine Learning", "concept": "Evaluation Metrics", "difficulty": "Medium", "question_text": "What is the definition of Recall in binary classification?", "options": ["True Positives / (True Positives + False Negatives)", "True Positives / (True Positives + False Positives)", "True Negatives / Total", "Precision * Accuracy"], "correct_answer_index": 0, "explanation": "Recall (Sensitivity) measures the fraction of actual positive instances correctly identified by the model.", "skill_name": "Machine Learning"},
        {"id": 318, "technology": "Machine Learning", "concept": "Evaluation Metrics", "difficulty": "Medium", "question_text": "What is the Harmonic Mean of Precision and Recall?", "options": ["F1-Score", "ROC-AUC", "Mean Absolute Error", "Log Loss"], "correct_answer_index": 0, "explanation": "The F1-Score is the harmonic mean of precision and recall: `2 * (P * R) / (P + R)`.", "skill_name": "Machine Learning"},
        {"id": 319, "technology": "Machine Learning", "concept": "Dimensionality Reduction", "difficulty": "Medium", "question_text": "What does Principal Component Analysis (PCA) maximize when finding principal axes?", "options": ["Variance of projected data points along orthogonal directions", "Class separation distance", "Information entropy", "L1 norm of feature vectors"], "correct_answer_index": 0, "explanation": "PCA projects high-dimensional data onto orthogonal axes that maximize variance while minimizing reconstruction error.", "skill_name": "Machine Learning"},
        {"id": 320, "technology": "Machine Learning", "concept": "Pipelines", "difficulty": "Medium", "question_text": "Why should data scaling (e.g. `fit_transform`) be performed INSIDE each cross-validation fold?", "options": ["To prevent data leakage from the validation fold into training calculations", "To ensure faster GPU compilation", "To prevent integer overflow", "Because Scikit-Learn crashes otherwise"], "correct_answer_index": 0, "explanation": "Fitting transformers on the whole dataset before CV leaks validation fold mean/variance statistics into training.", "skill_name": "Machine Learning"},
        {"id": 321, "technology": "Machine Learning", "concept": "Distance Metrics", "difficulty": "Medium", "question_text": "Why is KNN sensitive to unscaled feature variables?", "options": ["Features with larger absolute scales dominate Euclidean distance calculations unfairly", "KNN runs on neural matrices", "KNN ignores float values", "Distance cannot be computed on integers"], "correct_answer_index": 0, "explanation": "Euclidean distance is scale-dependent; features with larger magnitudes dominate neighbor proximity without scaling.", "skill_name": "Machine Learning"},
        {"id": 322, "technology": "Machine Learning", "concept": "Imbalanced Data", "difficulty": "Medium", "question_text": "What technique generates synthetic minority class instances by interpolating between feature neighbors?", "options": ["SMOTE (Synthetic Minority Over-sampling Technique)", "Random Undersampling", "PCA Decomposition", "One-Hot Encoding"], "correct_answer_index": 0, "explanation": "SMOTE creates synthetic instances along feature line segments joining k-nearest minority class neighbors.", "skill_name": "Machine Learning"},

        # --- HARD (8) ---
        {"id": 323, "technology": "Machine Learning", "concept": "Optimization", "difficulty": "Hard", "question_text": "How does the ROC-AUC score interpret a classifier's ranking performance?", "options": ["The probability that a randomly chosen positive instance is ranked higher than a randomly chosen negative instance", "The exact accuracy at threshold 0.5", "The ratio of MSE to variance", "The gradient of the decision boundary"], "correct_answer_index": 0, "explanation": "ROC-AUC represents the Wilcoxon-Mann-Whitney probability that positive samples receive higher predicted probabilities than negatives.", "skill_name": "Machine Learning"},
        {"id": 324, "technology": "Machine Learning", "concept": "Kernel Methods", "difficulty": "Hard", "question_text": "What does the 'Kernel Trick' in Support Vector Machines (SVM) achieve mathematically?", "options": ["Computes inner products in a high-dimensional feature space without explicitly mapping vectors to that space", "Speeds up disk I/O operations", "Replaces quadratic programming with linear search", "Eliminates all support vectors"], "correct_answer_index": 0, "explanation": "Kernel functions compute inner products in implicit Hilbert spaces directly, avoiding high-dimensional coordinates.", "skill_name": "Machine Learning"},
        {"id": 325, "technology": "Machine Learning", "concept": "Loss Functions", "difficulty": "Hard", "question_text": "Why is Cross-Entropy Loss preferred over Mean Squared Error for logistic classification?", "options": ["MSE produces a non-convex optimization landscape with sigmoid activations; Cross-Entropy is strictly convex", "MSE is computationally slower on GPUs", "Cross-Entropy is only for text inputs", "MSE produces negative probabilities"], "correct_answer_index": 0, "explanation": "Sigmoid combined with MSE leads to non-convex loss surfaces and severe vanishing gradients; cross-entropy ensures convex optimization.", "skill_name": "Machine Learning"},
        {"id": 326, "technology": "Machine Learning", "concept": "Tree Splitting", "difficulty": "Hard", "question_text": "In XGBoost, how is the optimal split score calculated across candidate features?", "options": ["Using exact second-order Taylor expansion (Gradients $g_i$ and Hessians $h_i$) of the objective loss function", "Using first-order gradient descent only", "Using Monte Carlo sampling", "Using random binary splits"], "correct_answer_index": 0, "explanation": "XGBoost formulates gain using both 1st-order gradients $g_i$ and 2nd-order hessians $h_i$ in Taylor approximation for exact split evaluation.", "skill_name": "Machine Learning"},
        {"id": 327, "technology": "Machine Learning", "concept": "Model Interpretability", "difficulty": "Hard", "question_text": "What mathematical principle underpins SHAP (SHapley Additive exPlanations) values?", "options": ["Cooperative game theory Shapley values distributing total payoff fairly among feature coalitions", "Bayesian Markov Chain Monte Carlo", "Principal Component Projection", "Ridge regression regularization"], "correct_answer_index": 0, "explanation": "SHAP computes marginal contribution of each feature across all possible subsets of features using game-theoretic Shapley values.", "skill_name": "Machine Learning"},
        {"id": 328, "technology": "Machine Learning", "concept": "Calibration", "difficulty": "Hard", "question_text": "What does Platt Scaling or Isotonic Regression do to a classifier's raw confidence scores?", "options": ["Calibrates predicted probabilities so that a score of 0.8 accurately reflects an 80% empirical true positive rate", "Normalizes weights between -1 and 1", "Converts multiclass output to binary", "Reduces tree depth"], "correct_answer_index": 0, "explanation": "Probability calibration transforms raw model scores into true empirical probabilities.", "skill_name": "Machine Learning"},
        {"id": 329, "technology": "Machine Learning", "concept": "Clustering", "difficulty": "Hard", "question_text": "Why does DBSCAN outperform K-Means on complex geospatial or non-spherical clusters?", "options": ["DBSCAN groups points based on local density reachability and identifies noise points without assuming spherical clusters", "DBSCAN assumes Gaussian distributions", "DBSCAN requires defining k in advance", "DBSCAN uses neural backprop"], "correct_answer_index": 0, "explanation": "DBSCAN discovers arbitrarily shaped clusters via density-reachability and does not require pre-specifying cluster counts.", "skill_name": "Machine Learning"},
        {"id": 330, "technology": "Machine Learning", "concept": "Time Series", "difficulty": "Hard", "question_text": "Why must standard K-Fold CV NOT be used on sequential time-series forecasting data?", "options": ["It introduces lookahead bias by validating on past data while training on future data", "Time series arrays have too few columns", "Datetime objects cannot be indexed", "K-Fold requires string targets"], "correct_answer_index": 0, "explanation": "Random shuffling destroys temporal dependencies and leaks future patterns into training; TimeSeriesSplit (rolling origin) is required.", "skill_name": "Machine Learning"}
    ]

def get_deep_learning_questions() -> List[Dict[str, Any]]:
    # Curated Deep Learning Question Bank (30 questions: 10 Easy, 12 Medium, 8 Hard)
    return [
        # --- EASY (10) ---
        {"id": 401, "technology": "Deep Learning", "concept": "Neural Networks", "difficulty": "Easy", "question_text": "What is an artificial neuron in a deep learning model?", "options": ["A mathematical unit that computes a weighted sum of inputs, adds a bias, and passes it through an activation function", "A physical semiconductor chip", "A database table record", "A Python thread"], "correct_answer_index": 0, "explanation": "An artificial neuron applies linear weights and bias followed by an activation function to incoming inputs.", "skill_name": "Deep Learning"},
        {"id": 402, "technology": "Deep Learning", "concept": "Activation Functions", "difficulty": "Easy", "question_text": "What is the formula for the standard ReLU (Rectified Linear Unit) activation function?", "options": ["$f(x) = \\max(0, x)$", "$f(x) = \\frac{1}{1 + e^{-x}}$", "$f(x) = \\tanh(x)$", "$f(x) = x^2$"], "correct_answer_index": 0, "explanation": "ReLU outputs $x$ if $x > 0$ and $0$ otherwise: $\\max(0, x)$.", "skill_name": "Deep Learning"},
        {"id": 403, "technology": "Deep Learning", "concept": "Training", "difficulty": "Easy", "question_text": "What is an 'epoch' in neural network training?", "options": ["One complete forward and backward pass of the entire training dataset through the network", "A single batch update", "A CPU clock cycle", "One second of model execution"], "correct_answer_index": 0, "explanation": "An epoch represents one complete cycle through all training samples in the dataset.", "skill_name": "Deep Learning"},
        {"id": 404, "technology": "Deep Learning", "concept": "Loss Functions", "difficulty": "Easy", "question_text": "Which loss function is standard for multi-class classification with softmax outputs?", "options": ["Categorical Cross-Entropy", "Mean Squared Error", "Binary Hinge Loss", "Cosine Distance"], "correct_answer_index": 0, "explanation": "Categorical Cross-Entropy measures the distance between true one-hot probability distributions and predicted softmax outputs.", "skill_name": "Deep Learning"},
        {"id": 405, "technology": "Deep Learning", "concept": "Optimizers", "difficulty": "Easy", "question_text": "What is Stochastic Gradient Descent (SGD)?", "options": ["An optimization algorithm that updates parameters iteratively using gradients computed on mini-batches of data", "An exact matrix solver", "A data augmentation algorithm", "A hardware scheduler"], "correct_answer_index": 0, "explanation": "SGD adjusts network weights in the direction that minimizes loss using gradients calculated on data subsets.", "skill_name": "Deep Learning"},
        {"id": 406, "technology": "Deep Learning", "concept": "Frameworks", "difficulty": "Easy", "question_text": "In PyTorch, which base class must all custom neural network layers and architectures inherit from?", "options": ["`torch.nn.Module`", "`torch.Tensor`", "`torch.autograd.Function`", "`torch.optim.Optimizer`"], "correct_answer_index": 0, "explanation": "All neural network models in PyTorch subclass `torch.nn.Module` and implement their own `forward` method.", "skill_name": "Deep Learning"},
        {"id": 407, "technology": "Deep Learning", "concept": "Computer Vision", "difficulty": "Easy", "question_text": "Which neural network architecture type is specialized for spatial image processing using receptive fields?", "options": ["Convolutional Neural Networks (CNN)", "Recurrent Neural Networks (RNN)", "Tabular Perceptron", "Markov Decision Chains"], "correct_answer_index": 0, "explanation": "CNNs apply learnable spatial convolution kernels across 2D/3D grids to detect visual features.", "skill_name": "Deep Learning"},
        {"id": 408, "technology": "Deep Learning", "concept": "Regularization", "difficulty": "Easy", "question_text": "What does Dropout do during neural network training?", "options": ["Randomly zeroes out a percentage of neuron activations during forward passes to prevent co-adaptation", "Drops dead gradient layers permanently", "Deletes underperforming training images", "Reduces model precision from FP32 to INT8"], "correct_answer_index": 0, "explanation": "Dropout randomly deactivates a fraction of neurons per batch during training to regularize the network.", "skill_name": "Deep Learning"},
        {"id": 409, "technology": "Deep Learning", "concept": "Hardware", "difficulty": "Easy", "question_text": "Why are GPUs extensively used for deep learning model training?", "options": ["GPUs have thousands of cores designed for highly parallel matrix tensor arithmetic", "GPUs have higher CPU clock speeds", "GPUs prevent loss from oscillating", "GPUs eliminate overfitting"], "correct_answer_index": 0, "explanation": "Tensor algebra and convolution operations are embarrassingly parallel, fitting GPU SIMD architectures.", "skill_name": "Deep Learning"},
        {"id": 410, "technology": "Deep Learning", "concept": "Tensors", "difficulty": "Easy", "question_text": "What is a Tensor in PyTorch and TensorFlow?", "options": ["A multi-dimensional array generalization of scalars, vectors, and matrices with GPU acceleration and autograd", "A database connection string", "A JSON object parser", "A compiled C binary"], "correct_answer_index": 0, "explanation": "Tensors are n-dimensional data structures supporting parallel mathematical operations and automatic differentiation.", "skill_name": "Deep Learning"},

        # --- MEDIUM (12) ---
        {"id": 411, "technology": "Deep Learning", "concept": "Gradients", "difficulty": "Medium", "question_text": "What causes the 'Vanishing Gradient Problem' in deep networks using sigmoid or tanh activations?", "options": ["Derivatives of sigmoid are $\\le 0.25$, causing gradients to exponentially shrink toward zero as they backpropagate through deep layers", "Weights exceed max float limits", "Learning rate is too large", "Batch size is set to 1"], "correct_answer_index": 0, "explanation": "Multiplying many small gradients ($< 1$) via the chain rule exponentially diminishes updates to early layers.", "skill_name": "Deep Learning"},
        {"id": 412, "technology": "Deep Learning", "concept": "Normalization", "difficulty": "Medium", "question_text": "What is the primary benefit of Batch Normalization (`nn.BatchNorm2d`)?", "options": ["Stabilizes internal covariate shift, allowing higher learning rates and accelerating training convergence", "Replaces all activation functions", "Reduces model parameter count to zero", "Eliminates need for test datasets"], "correct_answer_index": 0, "explanation": "BatchNorm normalizes layer inputs across batch dimensions, smoothing optimization landscapes and accelerating convergence.", "skill_name": "Deep Learning"},
        {"id": 413, "technology": "Deep Learning", "concept": "Optimizers", "difficulty": "Medium", "question_text": "How does the Adam optimizer combine benefits of AdaGrad and RMSProp?", "options": ["Maintains running exponential averages of both first moments (mean gradients) and second moments (uncentered variance)", "Uses second-order Hessian matrix inversion", "Discards momentum updates", "Switches between SGD and Newton methods randomly"], "correct_answer_index": 0, "explanation": "Adam computes adaptive learning rates per parameter using exponentially decaying averages of past gradients and squared gradients.", "skill_name": "Deep Learning"},
        {"id": 414, "technology": "Deep Learning", "concept": "Transformers", "difficulty": "Medium", "question_text": "What is the core mathematical mechanism powering Transformer architectures in 'Attention Is All You Need'?", "options": ["Scaled Dot-Product Self-Attention $\\text{Softmax}\\left(\\frac{QK^T}{\\sqrt{d_k}}\\right)V$", "Spatial 2D Convolution", "Recurrent LSTM gating", "Principal Component Projection"], "correct_answer_index": 0, "explanation": "Transformers calculate attention weights across Query, Key, and Value matrices to model all-to-all sequence dependencies in parallel.", "skill_name": "Deep Learning"},
        {"id": 415, "technology": "Deep Learning", "concept": "Autograd", "difficulty": "Medium", "question_text": "Why do PyTorch evaluation loops wrap code inside `with torch.no_grad():`?", "options": ["Disables gradient computation history tracking, reducing memory consumption and speeding up inference", "Compiles Python into C++", "Prevents model weight deletion", "Enables model training mode"], "correct_answer_index": 0, "explanation": "`torch.no_grad()` deactivates autograd tape recording during validation, significantly reducing VRAM allocation.", "skill_name": "Deep Learning"},
        {"id": 416, "technology": "Deep Learning", "concept": "Residual Networks", "difficulty": "Medium", "question_text": "How do Skip / Residual Connections in ResNet enable training of 100+ layer networks?", "options": ["They provide identity shortcut paths $\\mathcal{F}(x) + x$, allowing gradients to backpropagate directly without vanishing", "They downsample image resolutions by 4x", "They eliminate all convolutional layers", "They convert floating point weights to integers"], "correct_answer_index": 0, "explanation": "Residual shortcuts preserve gradient flow through deep layer stacks by letting gradients flow directly via the $+x$ identity path.", "skill_name": "Deep Learning"},
        {"id": 417, "technology": "Deep Learning", "concept": "NLP", "difficulty": "Medium", "question_text": "What was the primary limitation of RNNs and LSTMs that Transformers solved?", "options": ["Sequential step-by-step recurrence prevented parallel training across long sequence contexts", "RNNs could not process text data", "LSTMs had no loss functions", "RNNs could only run on CPUs"], "correct_answer_index": 0, "explanation": "Recurrent processing is sequential ($O(N)$ sequential steps); Transformers process entire token sequences simultaneously ($O(1)$ parallel operations).", "skill_name": "Deep Learning"},
        {"id": 418, "technology": "Deep Learning", "concept": "Learning Rate", "difficulty": "Medium", "question_text": "What is Learning Rate Warmup with Cosine Decay?", "options": ["Gradually increasing the learning rate from near 0 to base rate over early steps, then smoothly decaying along a cosine curve", "Heating GPU temperature before execution", "Freezing layer weights permanently", "Doubling learning rate on every batch"], "correct_answer_index": 0, "explanation": "Warmup stabilizes early optimization when gradients are noisy, while cosine decay allows fine-grained convergence near local minima.", "skill_name": "Deep Learning"},
        {"id": 419, "technology": "Deep Learning", "concept": "Embeddings", "difficulty": "Medium", "question_text": "What is the purpose of an Embedding layer (`nn.Embedding`) in deep learning?", "options": ["Maps discrete integer token IDs into continuous, dense low-dimensional semantic vector spaces", "Compresses audio files", "Renders graphical user interfaces", "Encrypts model weights"], "correct_answer_index": 0, "explanation": "`nn.Embedding` acts as a lookup table transforming discrete indices (e.g. word IDs) into dense learnable vector representations.", "skill_name": "Deep Learning"},
        {"id": 420, "technology": "Deep Learning", "concept": "Transfer Learning", "difficulty": "Medium", "question_text": "In transfer learning, what does 'Fine-Tuning' involve?", "options": ["Initializing a model with weights pre-trained on massive datasets and updating them on a downstream task with a low learning rate", "Retraining all weights from scratch randomly", "Deleting output layers permanently", "Converting model weights to binary text"], "correct_answer_index": 0, "explanation": "Fine-tuning adapts pre-trained representations to specialized tasks by continuing gradient updates on domain data with lower learning rates.", "skill_name": "Deep Learning"},
        {"id": 421, "technology": "Deep Learning", "concept": "Pooling", "difficulty": "Medium", "question_text": "What does Max Pooling do in a convolutional neural network?", "options": ["Downsamples spatial feature maps by selecting maximum activation value within local spatial windows", "Averages all weights across channels", "Multiplies feature maps by 2", "Inverts image pixel colors"], "correct_answer_index": 0, "explanation": "Max pooling reduces spatial dimensions ($H \\times W$), providing translation invariance and reducing compute overhead.", "skill_name": "Deep Learning"},
        {"id": 422, "technology": "Deep Learning", "concept": "Overfitting", "difficulty": "Medium", "question_text": "What is Early Stopping in deep learning?", "options": ["Monitoring validation loss and halting training when validation performance ceases to improve across a patience threshold", "Terminating code on error", "Stopping training after exactly 1 epoch", "Freezing CPU cores during training"], "correct_answer_index": 0, "explanation": "Early stopping prevents overfitting by terminating training as soon as generalization loss on the validation set begins degrading.", "skill_name": "Deep Learning"},

        # --- HARD (8) ---
        {"id": 423, "technology": "Deep Learning", "concept": "Attention", "difficulty": "Hard", "question_text": "Why is the dot product of Query and Key scaled by $\\frac{1}{\\sqrt{d_k}}$ in Transformer self-attention?", "options": ["To prevent large dot product magnitudes from pushing the softmax function into regions with near-zero gradients", "To ensure positive matrix eigenvalues", "To convert FP32 tensors to FP16", "To enforce orthogonal coordinate projections"], "correct_answer_index": 0, "explanation": "For large $d_k$, dot products grow large in magnitude, causing softmax to saturate with extremely small gradients; $\\sqrt{d_k}$ scaling maintains variance = 1.", "skill_name": "Deep Learning"},
        {"id": 424, "technology": "Deep Learning", "concept": "Positional Encoding", "difficulty": "Hard", "question_text": "Why do Transformers require Positional Encodings (e.g. Sinusoidal or RoPE)?", "options": ["Self-attention is permutation-equivariant and has no inherent sense of sequence order without explicit position markers", "To normalize attention weights between 0 and 1", "To prevent GPU out-of-memory errors", "To replace word embeddings"], "correct_answer_index": 0, "explanation": "Self-attention treats input tokens as an unordered set; positional encodings inject sequence order information into token representations.", "skill_name": "Deep Learning"},
        {"id": 425, "technology": "Deep Learning", "concept": "Distributed Training", "difficulty": "Hard", "question_text": "How does Distributed Data Parallel (DDP) in PyTorch differ from simple DataParallel (DP)?", "options": ["DDP spawns a separate dedicated process per GPU communicating via Ring-AllReduce without Python GIL bottlenecks", "DDP runs exclusively on a single CPU thread", "DataParallel distributes model layers across nodes while DDP duplicates batches", "DDP does not synchronize gradients"], "correct_answer_index": 0, "explanation": "DDP spawns distinct processes avoiding GIL lock contention and uses efficient Ring-AllReduce inter-GPU communication.", "skill_name": "Deep Learning"},
        {"id": 426, "technology": "Deep Learning", "concept": "Mixed Precision", "difficulty": "Hard", "question_text": "Why does Automatic Mixed Precision (AMP / `torch.cuda.amp.autocast`) use GradScaler?", "options": ["To scale up small gradients before backward pass, preventing FP16 numerical underflow to zero", "To speed up disk reads", "To scale dataset images", "To multiply learning rate by batch size"], "correct_answer_index": 0, "explanation": "FP16 has a narrow dynamic exponent range; GradScaler scales loss by a factor to prevent small gradient values from underflowing to zero in FP16.", "skill_name": "Deep Learning"},
        {"id": 427, "technology": "Deep Learning", "concept": "Generative Models", "difficulty": "Hard", "question_text": "What is the Reparameterization Trick in Variational Autoencoders (VAEs)?", "options": ["Expressing the latent sample as $z = \\mu + \\sigma \\odot \\epsilon$ where $\\epsilon \\sim \\mathcal{N}(0, I)$ to allow backpropagation through stochastic nodes", "Replacing latent layers with deterministic CNNs", "Inverting the decoder weights matrix", "Using cross-entropy instead of KL divergence"], "correct_answer_index": 0, "explanation": "By shifting the random sampling operation to an auxiliary noise variable $\\epsilon$, gradients can flow back through mean $\\mu$ and variance $\\sigma$.", "skill_name": "Deep Learning"},
        {"id": 428, "technology": "Deep Learning", "concept": "Contrastive Learning", "difficulty": "Hard", "question_text": "What does the InfoNCE loss optimize in self-supervised representation learning (e.g. SimCLR, CLIP)?", "options": ["Maximizes mutual information by pulling positive augmented pairs together while pushing negative pairs apart in embedding space", "Minimizes reconstruction MSE pixel by pixel", "Classifies tokens into dictionary indices", "Inverts feature eigenvalues"], "correct_answer_index": 0, "explanation": "InfoNCE treats representation learning as a multi-class classification problem maximizing cosine similarity for positive pairs against negative distractors.", "skill_name": "Deep Learning"},
        {"id": 429, "technology": "Deep Learning", "concept": "Diffusion Models", "difficulty": "Hard", "question_text": "What is the core training objective of Denoising Diffusion Probabilistic Models (DDPM)?", "options": ["Training a neural network (typically a U-Net) to predict the exact Gaussian noise $\\epsilon$ added at arbitrary timestep $t$", "Generating images in a single forward pass", "Computing adversarial discriminator game equilibrium", "Minimizing latent autoencoder reconstruction error"], "correct_answer_index": 0, "explanation": "DDPM trains a U-Net to estimate the noise component $\\epsilon_\\theta(x_t, t)$ added to corrupted latent representations across diffusion time steps.", "skill_name": "Deep Learning"},
        {"id": 430, "technology": "Deep Learning", "concept": "Quantization", "difficulty": "Hard", "question_text": "What is the difference between Post-Training Quantization (PTQ) and Quantization-Aware Training (QAT)?", "options": ["QAT simulates low-bit precision rounding errors in the forward pass during training; PTQ quantizes weights after full-precision training without retraining", "PTQ requires training for 100 epochs while QAT does not", "QAT runs only on CPUs", "PTQ converts neural networks into decision trees"], "correct_answer_index": 0, "explanation": "QAT models quantization noise during backprop so weights adapt to low precision, preserving higher accuracy than post-hoc PTQ.", "skill_name": "Deep Learning"}
    ]

def get_sql_questions() -> List[Dict[str, Any]]:
    # Curated SQL Question Bank (30 questions: 10 Easy, 12 Medium, 8 Hard)
    return [
        # --- EASY (10) ---
        {"id": 501, "technology": "SQL", "concept": "Querying", "difficulty": "Easy", "question_text": "Which SQL clause is used to retrieve distinct non-duplicate values from a table column?", "options": ["SELECT DISTINCT", "SELECT UNIQUE", "SELECT DIFFERENT", "FILTER DISTINCT"], "correct_answer_index": 0, "explanation": "`SELECT DISTINCT` eliminates duplicate rows from the query result set.", "skill_name": "SQL"},
        {"id": 502, "technology": "SQL", "concept": "Filtering", "difficulty": "Easy", "question_text": "Which clause is used to filter records based on specific row conditions in SQL?", "options": ["WHERE", "HAVING", "GROUP BY", "ORDER BY"], "correct_answer_index": 0, "explanation": "The `WHERE` clause filters individual rows before aggregation operations occur.", "skill_name": "SQL"},
        {"id": 503, "technology": "SQL", "concept": "Sorting", "difficulty": "Easy", "question_text": "How do you sort query results in descending numerical or alphabetical order?", "options": ["ORDER BY column_name DESC", "ORDER BY column_name ASC", "SORT DOWN column_name", "GROUP BY column_name DESC"], "correct_answer_index": 0, "explanation": "`ORDER BY column_name DESC` orders records in descending order (highest to lowest).", "skill_name": "SQL"},
        {"id": 504, "technology": "SQL", "concept": "Aggregation", "difficulty": "Easy", "question_text": "Which aggregate function counts the total number of rows matching a criteria?", "options": ["COUNT()", "SUM()", "TOTAL()", "ROWS()"], "correct_answer_index": 0, "explanation": "`COUNT(*)` or `COUNT(column)` returns the total count of rows satisfying the query criteria.", "skill_name": "SQL"},
        {"id": 505, "technology": "SQL", "concept": "Joins", "difficulty": "Easy", "question_text": "What type of JOIN returns only rows that have matching values in both tables?", "options": ["INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "FULL OUTER JOIN"], "correct_answer_index": 0, "explanation": "`INNER JOIN` returns records where there is a match in both joined tables.", "skill_name": "SQL"},
        {"id": 506, "technology": "SQL", "concept": "Joins", "difficulty": "Easy", "question_text": "Which JOIN returns all records from the left table and matched records from the right table?", "options": ["LEFT JOIN", "INNER JOIN", "CROSS JOIN", "RIGHT JOIN"], "correct_answer_index": 0, "explanation": "`LEFT JOIN` preserves all rows from the left table, filling right table columns with NULL if no match exists.", "skill_name": "SQL"},
        {"id": 507, "technology": "SQL", "concept": "DML", "difficulty": "Easy", "question_text": "Which SQL statement adds new rows into a database table?", "options": ["INSERT INTO", "ADD ROW", "UPDATE TABLE", "CREATE ROW"], "correct_answer_index": 0, "explanation": "`INSERT INTO table_name (cols) VALUES (...)` creates new records in a table.", "skill_name": "SQL"},
        {"id": 508, "technology": "SQL", "concept": "Filtering", "difficulty": "Easy", "question_text": "How do you check for missing/unassigned values in a column in SQL?", "options": ["WHERE column IS NULL", "WHERE column = NULL", "WHERE column == 'NULL'", "WHERE column.isEmpty()"], "correct_answer_index": 0, "explanation": "In standard SQL, NULL comparisons must use the `IS NULL` or `IS NOT NULL` predicate.", "skill_name": "SQL"},
        {"id": 509, "technology": "SQL", "concept": "DML", "difficulty": "Easy", "question_text": "Which statement modifies existing records in a table?", "options": ["UPDATE", "MODIFY", "ALTER", "CHANGE"], "correct_answer_index": 0, "explanation": "`UPDATE table_name SET col = val WHERE condition` modifies existing table records.", "skill_name": "SQL"},
        {"id": 510, "technology": "SQL", "concept": "Aggregation", "difficulty": "Easy", "question_text": "Which clause groups rows sharing identical column values into summary rows?", "options": ["GROUP BY", "ORDER BY", "COLLECT BY", "PARTITION"], "correct_answer_index": 0, "explanation": "`GROUP BY` arranges identical data into groups for aggregate calculations like SUM or AVG.", "skill_name": "SQL"},

        # --- MEDIUM (12) ---
        {"id": 511, "technology": "SQL", "concept": "Filtering", "difficulty": "Medium", "question_text": "What is the crucial difference between the `WHERE` clause and the `HAVING` clause?", "options": ["`WHERE` filters individual rows before aggregation; `HAVING` filters aggregated groups after `GROUP BY`", "`WHERE` works only on numbers; `HAVING` works on strings", "`HAVING` is faster than `WHERE`", "They are identical keywords"], "correct_answer_index": 0, "explanation": "`WHERE` applies before grouping and cannot filter on aggregate functions; `HAVING` filters aggregated groups.", "skill_name": "SQL"},
        {"id": 512, "technology": "SQL", "concept": "Window Functions", "difficulty": "Medium", "question_text": "What distinguishes `ROW_NUMBER()`, `RANK()`, and `DENSE_RANK()` on tied values?", "options": ["`ROW_NUMBER` gives unique sequential integers; `RANK` skips ranks after ties (1,2,2,4); `DENSE_RANK` never skips ranks (1,2,2,3)", "They all produce identical outputs", "`RANK` does not support `ORDER BY`", "`DENSE_RANK` works only on primary keys"], "correct_answer_index": 0, "explanation": "`ROW_NUMBER` is strict index; `RANK` leaves gaps equal to tie count; `DENSE_RANK` increments monotonically without rank gaps.", "skill_name": "SQL"},
        {"id": 513, "technology": "SQL", "concept": "Window Functions", "difficulty": "Medium", "question_text": "Which window function clause defines the subset of rows over which window calculations operate?", "options": ["OVER (PARTITION BY ... ORDER BY ...)", "GROUP BY ... HAVING ...", "WINDOW BY ... ROWS ...", "SCOPE (SPLIT BY ...)"], "correct_answer_index": 0, "explanation": "The `OVER (PARTITION BY col ORDER BY col)` clause specifies the window frame partition and ordering for window functions.", "skill_name": "SQL"},
        {"id": 514, "technology": "SQL", "concept": "Subqueries", "difficulty": "Medium", "question_text": "What is a Common Table Expression (CTE) defined with?", "options": ["`WITH cte_name AS (SELECT ...)`", "`CREATE CTE cte_name AS ...`", "`DECLARE cte_name TABLE ...`", "`SUBQUERY cte_name = ...`"], "correct_answer_index": 0, "explanation": "CTEs are temporary named result sets defined using the `WITH cte_name AS (SELECT ...)` syntax.", "skill_name": "SQL"},
        {"id": 515, "technology": "SQL", "concept": "Set Operations", "difficulty": "Medium", "question_text": "What is the difference between `UNION` and `UNION ALL`?", "options": ["`UNION` deduplicates rows across query sets with sorting overhead; `UNION ALL` preserves all rows including duplicates faster", "`UNION ALL` only works on numbers", "`UNION` requires identical table names", "There is no difference"], "correct_answer_index": 0, "explanation": "`UNION` performs distinct set operations removing duplicates; `UNION ALL` concatenates datasets without deduplication.", "skill_name": "SQL"},
        {"id": 516, "technology": "SQL", "concept": "Indexing", "difficulty": "Medium", "question_text": "What is the primary structure used by standard database indexes to enable $O(\\log N)$ lookup speed?", "options": ["B-Tree (B+ Tree)", "Linked List", "Array List", "Stack"], "correct_answer_index": 0, "explanation": "B+ Trees maintain balanced tree structures on disk with sequential leaf pointers for rapid equality and range searches.", "skill_name": "SQL"},
        {"id": 517, "technology": "SQL", "concept": "Window Functions", "difficulty": "Medium", "question_text": "Which window function accesses data from a subsequent row without requiring a self-join?", "options": ["`LEAD(column, 1)`", "`LAG(column, 1)`", "`NEXT(column)`", "`FORWARD(column)`"], "correct_answer_index": 0, "explanation": "`LEAD()` accesses data from a subsequent row at a specified physical offset within the window partition.", "skill_name": "SQL"},
        {"id": 518, "technology": "SQL", "concept": "Null Handling", "difficulty": "Medium", "question_text": "What does `COALESCE(val1, val2, val3)` return in SQL?", "options": ["The first non-null expression in its argument list", "The sum of non-null arguments", "True if all arguments are null", "The maximum string length"], "correct_answer_index": 0, "explanation": "`COALESCE()` evaluates arguments in sequence and returns the first non-null value.", "skill_name": "SQL"},
        {"id": 519, "technology": "SQL", "concept": "Constraints", "difficulty": "Medium", "question_text": "What is the difference between a PRIMARY KEY and a UNIQUE constraint?", "options": ["A table can have only ONE Primary Key and it cannot contain NULLs; a table can have MULTIPLE Unique constraints which permit NULLs", "They are identical constraints", "Unique constraints cannot be indexed", "Primary Key only works on integers"], "correct_answer_index": 0, "explanation": "Primary keys uniquely identify rows and forbid NULL values; tables can define multiple unique constraints that allow NULL entries.", "skill_name": "SQL"},
        {"id": 520, "technology": "SQL", "concept": "Transactions", "difficulty": "Medium", "question_text": "What does the 'A' in ACID transaction properties stand for?", "options": ["Atomicity (All operations in transaction succeed, or all roll back completely)", "Asynchrony", "Availability", "Authentication"], "correct_answer_index": 0, "explanation": "Atomicity guarantees that all transaction modifications are committed together or completely aborted.", "skill_name": "SQL"},
        {"id": 521, "technology": "SQL", "concept": "Conditional Logic", "difficulty": "Medium", "question_text": "How do you implement conditional if-then-else logic within a `SELECT` query?", "options": ["`CASE WHEN condition THEN result ELSE default END`", "`IF condition THEN result ELSE default`", "`SWITCH (condition) { CASE ... }`", "`DECODE()` exclusively"], "correct_answer_index": 0, "explanation": "The standard SQL `CASE WHEN ... THEN ... ELSE ... END` expression provides conditional branch evaluation.", "skill_name": "SQL"},
        {"id": 522, "technology": "SQL", "concept": "Joins", "difficulty": "Medium", "question_text": "What result is produced by a `CROSS JOIN` between table A (5 rows) and table B (10 rows)?", "options": ["Cartesian product containing 50 rows", "15 rows", "5 rows", "0 rows"], "correct_answer_index": 0, "explanation": "A CROSS JOIN pairs every row from the first table with every row from the second ($5 \\times 10 = 50$).", "skill_name": "SQL"},

        # --- HARD (8) ---
        {"id": 523, "technology": "SQL", "concept": "Query Optimization", "difficulty": "Hard", "question_text": "What is a 'Covering Index' in SQL database optimization?", "options": ["An index containing all columns requested by a query in either its key or `INCLUDE` columns, avoiding table heap/clustered index lookups", "An index spanning every table in the schema", "An encrypted index", "A temporary in-memory index"], "correct_answer_index": 0, "explanation": "Covering indexes fulfill all SELECT and WHERE columns directly from index leaves without requiring random I/O base table lookups.", "skill_name": "SQL"},
        {"id": 524, "technology": "SQL", "concept": "Recursive CTE", "difficulty": "Hard", "question_text": "How is a Recursive CTE structured to traverse hierarchical tree data (e.g. employee-manager hierarchy)?", "options": ["An Anchor Member query combined with a Recursive Member query referencing the CTE name via `UNION ALL`", "A `WHILE` loop inside a transaction", "Multiple nested `INNER JOIN` statements", "A cursor iteration block"], "correct_answer_index": 0, "explanation": "Recursive CTEs evaluate an anchor query, recursively execute member queries referencing the CTE until empty, and union results.", "skill_name": "SQL"},
        {"id": 525, "technology": "SQL", "concept": "Transactions & Concurrency", "difficulty": "Hard", "question_text": "What is a 'Phantom Read' anomaly in database transaction isolation levels?", "options": ["A transaction re-executes a range query and discovers new rows inserted and committed by a concurrent transaction", "A transaction reads uncommitted dirty data that rolls back", "A transaction modifies a deleted row", "Database cache corruption"], "correct_answer_index": 0, "explanation": "Phantom reads occur when a transaction re-runs a search criteria and sees newly inserted rows committed by other transactions.", "skill_name": "SQL"},
        {"id": 526, "technology": "SQL", "concept": "Index Sargability", "difficulty": "Hard", "question_text": "Why is `WHERE YEAR(created_at) = 2026` non-SARGable (Search Argument Able) in B-Tree index scans?", "options": ["Wrapping indexed columns in scalar functions prevents the optimizer from executing range index seeks, forcing a full index/table scan", "SQL does not support the `YEAR()` function", "B-Trees cannot store dates", "It causes a syntax error"], "correct_answer_index": 0, "explanation": "Functions on indexed columns prevent B-Tree binary search seeks; rewritten as `WHERE created_at >= '2026-01-01' AND created_at < '2027-01-01'`, it uses index seek.", "skill_name": "SQL"},
        {"id": 527, "technology": "SQL", "concept": "Window Frames", "difficulty": "Hard", "question_text": "What does `ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW` calculate when paired with `SUM()`?", "options": ["A running cumulative total from the start of the partition up to the current row", "The total sum of the entire table", "The moving average of the last 3 rows", "The difference between current and next row"], "correct_answer_index": 0, "explanation": "This frame defines the cumulative rolling window spanning from partition start to current row.", "skill_name": "SQL"},
        {"id": 528, "technology": "SQL", "concept": "Query Optimization", "difficulty": "Hard", "question_text": "What does a Hash Join do when joining large unsorted tables in an execution plan?", "options": ["Builds an in-memory hash table on the smaller table's join keys, then probes it row-by-row using the larger table", "Performs nested loops on every single row pair", "Sorts both tables on disk", "Converts table data to CSV"], "correct_answer_index": 0, "explanation": "Hash Join operates in two phases: Build phase (in-memory hash table on build input) and Probe phase (hashing probe input keys to match).", "skill_name": "Machine Learning"},
        {"id": 529, "technology": "SQL", "concept": "Partitioning", "difficulty": "Hard", "question_text": "What is 'Partition Pruning' in large data warehouse tables?", "options": ["Query optimizer automatically skips reading partition files/chunks that cannot contain records matching the filter criteria", "Deleting old archive partitions permanently", "Dropping secondary indexes on partitions", "Compressing column storage formats"], "correct_answer_index": 0, "explanation": "Partition pruning skips disk I/O for partitions whose metadata boundaries fall outside query WHERE predicates.", "skill_name": "SQL"},
        {"id": 530, "technology": "SQL", "concept": "Isolation Levels", "difficulty": "Hard", "question_text": "Which standard transaction isolation level provides maximum consistency by eliminating Dirty Reads, Non-Repeatable Reads, and Phantom Reads?", "options": ["SERIALIZABLE", "REPEATABLE READ", "READ COMMITTED", "READ UNCOMMITTED"], "correct_answer_index": 0, "explanation": "SERIALIZABLE is the strictest ANSI/ISO SQL isolation level, guaranteeing execution equivalent to completely serial serializability.", "skill_name": "SQL"}
    ]

def get_technology_question_bank(technology: str) -> List[Dict[str, Any]]:
    tech_clean = technology.strip().lower()
    if tech_clean in ["react", "frontend", "typescript"]:
        return get_react_questions()
    elif tech_clean in ["machine learning", "ml", "data science"]:
        return get_machine_learning_questions()
    elif tech_clean in ["deep learning", "dl", "pytorch", "neural networks", "nlp", "computer vision"]:
        return get_deep_learning_questions()
    elif tech_clean in ["sql", "database", "postgres", "mysql"]:
        return get_sql_questions()
    
    # Default fallback Python question bank (can be customized per technology)
    base_py = get_python_questions()
    adapted = []
    for q in base_py:
        q_copy = dict(q)
        q_copy["technology"] = technology.strip()
        q_copy["skill_name"] = technology.strip()
        adapted.append(q_copy)
    return adapted

