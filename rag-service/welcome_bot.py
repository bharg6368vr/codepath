from flask import Blueprint, request, jsonify
import json
import os

welcome_bp = Blueprint('welcome', __name__)

WELCOME_SEQUENCES = {
    "greeting": {
        "messages": [
            "Hey there! 👋 Welcome to CodePath!",
            "I'm so excited you're here to learn coding!",
        ],
        "followup": "What's your name?"
    },
    "personality": {
        "messages": [
            "Nice to meet you! Let me understand how you learn best.",
            "Do you prefer: Quick concepts with instant practice, or In-depth explanations with theory first?"
        ],
        "options": ["Quick & Practical", "Deep & Theoretical"]
    },
    "goal": {
        "messages": [
            "Awesome! Now, what's your main goal?",
            "Are you here for: Career growth, Interview prep, Hobby/learning, or College course?"
        ],
        "options": ["Career", "Interview", "Hobby", "College"]
    },
    "motivation": {
        "messages": [
            "That's a great goal! You know what? The best programmers started exactly where you are.",
            "Let's pick your first language and get coding! 💻"
        ]
    }
}

@welcome_bp.route('/health', methods=['GET'])
def welcome_health():
    return jsonify({"status": "ready", "feature": "interactive_welcome"})

@welcome_bp.route('/next-stage', methods=['POST'])
def next_stage():
    """Get next welcome stage"""
    data = request.json
    current_stage = data.get('stage')
    user_response = data.get('response')
    
    # Determine next stage
    stages = ["greeting", "personality", "goal", "motivation"]
    current_idx = stages.index(current_stage) if current_stage in stages else -1
    next_idx = current_idx + 1
    
    if next_idx >= len(stages):
        return jsonify({
            "stage": "complete",
            "message": "Let's start learning! Pick a language:",
            "action": "redirect_to_languages"
        })
    
    next_stage = stages[next_idx]
    sequence = WELCOME_SEQUENCES.get(next_stage, {})
    
    return jsonify({
        "stage": next_stage,
        "messages": sequence.get("messages", []),
        "followup": sequence.get("followup"),
        "options": sequence.get("options"),
        "delay": 1.5  # Stagger messages for UI effect
    })

@welcome_bp.route('/personalize-recommendation', methods=['POST'])
def personalize_recommendation():
    """Get language recommendation based on personality"""
    data = request.json
    personality = data.get('personality')
    goal = data.get('goal')
    
    recommendations = {
        ("Quick & Practical", "Career"): {
            "primary": "python",
            "reason": "Python is industry-standard, fast to learn, perfect for career growth!"
        },
        ("Deep & Theoretical", "College"): {
            "primary": "cpp",
            "reason": "C++ covers fundamental CS concepts deeply—perfect for academic mastery!"
        },
        ("Quick & Practical", "Interview"): {
            "primary": "java",
            "reason": "Java is the interview favorite—strong OOP foundation!"
        },
        ("Deep & Theoretical", "Interview"): {
            "primary": "cpp",
            "reason": "C++ shows deep system knowledge—impressive for senior roles!"
        },
        ("Quick & Practical", "Hobby"): {
            "primary": "python",
            "reason": "Python's fun, flexible, and beginner-friendly!"
        },
        ("Deep & Theoretical", "Hobby"): {
            "primary": "cpp",
            "reason": "Master low-level concepts for total understanding!"
        },
        ("Deep & Theoretical", "Career"): {
            "primary": "cpp",
            "reason": "Deep understanding of systems = career advantage!"
        },
    }
    
    key = (personality, goal)
    recommendation = recommendations.get(key, {"primary": "python", "reason": "Let's start with Python!"})
    
    return jsonify({
        "recommendedLanguage": recommendation["primary"],
        "reason": recommendation["reason"],
        "message": f"Based on your style & goals, I recommend {recommendation['primary']}! But feel free to pick any language 🎯"
    })

if __name__ == '__main__':
    pass
