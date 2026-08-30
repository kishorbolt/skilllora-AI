import re
from typing import Dict, Any, List

class MCQValidator:
    @staticmethod
    def validate_question(q: Dict[str, Any], technology: str, existing_questions: List[Dict[str, Any]]) -> bool:
        # Check 1: Exactly 4 options
        options = q.get("options", [])
        if not isinstance(options, list) or len(options) != 4:
            return False

        # Check 2: All options non-empty strings
        if any(not isinstance(opt, str) or not opt.strip() for opt in options):
            return False

        # Check 3: Unique options (no duplicate choices within same question)
        if len(set(opt.strip().lower() for opt in options)) != 4:
            return False

        # Check 4: Valid correct answer index (0..3)
        correct_idx = q.get("correct_answer_index")
        if not isinstance(correct_idx, int) or correct_idx not in [0, 1, 2, 3]:
            return False

        # Check 5: Technology mapping
        q_tech = q.get("technology", technology)
        if q_tech.lower() != technology.lower():
            return False

        # Check 6: Valid Difficulty
        difficulty = q.get("difficulty", "")
        if difficulty not in ["Easy", "Medium", "Hard"]:
            return False

        # Check 7: Question text non-empty & minimum length
        q_text = q.get("question_text", "").strip()
        if len(q_text) < 15:
            return False

        # Check 8: Explanation non-empty & informative
        explanation = q.get("explanation", "").strip()
        if len(explanation) < 10:
            return False

        # Check 9: Sub-topic mapping present
        topic = q.get("concept", q.get("topic", "")).strip()
        if not topic:
            return False

        # Check 10: Duplicate / Similarity check against existing 30-question set
        q_text_norm = re.sub(r'\W+', '', q_text.lower())
        for prev_q in existing_questions:
            prev_text_norm = re.sub(r'\W+', '', prev_q.get("question_text", "").lower())
            if q_text_norm == prev_text_norm:
                return False
            # Check prefix overlap
            if len(q_text_norm) > 20 and q_text_norm[:30] == prev_text_norm[:30]:
                return False

        return True
