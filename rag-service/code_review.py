from flask import Blueprint, request, jsonify
import os
import gemini_client

code_review_bp = Blueprint('code_review', __name__)

@code_review_bp.route('/explain-code', methods=['POST'])
def explain_code():
    """Explain what a code snippet does using Gemini AI"""
    try:
        data = request.json or {}
        code = data.get('code')
        language = data.get('language', 'python')
        
        if not code:
            return jsonify({'error': 'Code is required'}), 400
        
        prompt = f"""Explain this {language} code in simple, beginner-friendly terms.
Also suggest 2-3 specific improvements.

Code:
```{language}
{code}
```

Format your response as:
EXPLANATION: [Clear simple explanation]
IMPROVEMENTS: [List 2-3 specific improvements]"""

        ai_response = gemini_client.generate_text(prompt, system_prompt="You are an expert AI programming instructor.")
        
        if ai_response:
            parts = ai_response.split('IMPROVEMENTS:')
            explanation = parts[0].replace('EXPLANATION:', '').strip()
            improvements = parts[1].strip() if len(parts) > 1 else 'Keep code organized and well-tested.'
            return jsonify({
                'explanation': explanation,
                'suggested_improvements': improvements,
                'demo_mode': False
            })
        
        # Fallback if no AI key configured
        return jsonify({
            'explanation': f"This {language} snippet implements core algorithms and logic structures.",
            'suggested_improvements': ['Add comments explaining complex sections', 'Ensure proper error and edge case handling'],
            'demo_mode': True
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@code_review_bp.route('/code-review', methods=['POST'])
def code_review():
    """Detailed code review using Gemini AI"""
    try:
        data = request.json or {}
        code = data.get('code')
        language = data.get('language', 'python')
        
        if not code:
            return jsonify({'error': 'Code is required'}), 400
        
        prompt = f"""Perform a comprehensive code review for this {language} code.
Provide:
1. Code Quality & Architecture Analysis
2. Identified Issues & Bugs (High, Medium, Low severity)
3. Best Practices & Performance Recommendations
4. Overall Score (1 to 10)

Code:
```{language}
{code}
```"""

        ai_response = gemini_client.generate_text(prompt, system_prompt="You are a senior staff software engineer providing constructive code reviews.")
        
        if ai_response:
            return jsonify({
                'review': ai_response,
                'score': 8,
                'demo_mode': False
            })
        
        return jsonify({
            'review': "Code structure looks clean. Consider adding unit tests, handling null inputs, and adding docstrings.",
            'score': 8,
            'demo_mode': True
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@code_review_bp.route('/debug-help', methods=['POST'])
def debug_help():
    """Get debugging help for code using Gemini AI"""
    try:
        data = request.json or {}
        code = data.get('code')
        error = data.get('error')
        language = data.get('language', 'python')
        
        if not code or not error:
            return jsonify({'error': 'Code and error message are required'}), 400
        
        prompt = f"""Help debug this {language} code issue.

Code:
```{language}
{code}
```

Error message / Stack trace:
```
{error}
```

Provide:
1. Root cause of the error
2. Exact corrected code block
3. Tips to prevent this bug in the future"""

        ai_response = gemini_client.generate_text(prompt, system_prompt="You are a debugging expert helping developers fix errors quickly.")
        
        if ai_response:
            return jsonify({
                'solution': ai_response,
                'demo_mode': False
            })
        
        return jsonify({
            'solution': f"Error caused by: {error}. Check your variable types and bounds.",
            'demo_mode': True
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@code_review_bp.route('/health', methods=['GET'])
def code_review_health():
    return jsonify({
        "status": "ready",
        "feature": "code_review",
        "gemini_configured": bool(os.getenv('GEMINI_API_KEY'))
    })
