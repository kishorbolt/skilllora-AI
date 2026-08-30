from typing import Dict, Any, List

CAREER_MATRICES: Dict[str, List[Dict[str, Any]]] = {
    "AI Engineer": [
        {"skill_name": "Python", "required_level": 80.0, "importance": "Critical", "prerequisites": [], "estimated_hours": 30.0},
        {"skill_name": "Statistics", "required_level": 70.0, "importance": "High", "prerequisites": [], "estimated_hours": 25.0},
        {"skill_name": "Machine Learning", "required_level": 75.0, "importance": "Critical", "prerequisites": ["Python", "Statistics"], "estimated_hours": 40.0},
        {"skill_name": "Deep Learning", "required_level": 70.0, "importance": "Critical", "prerequisites": ["Machine Learning"], "estimated_hours": 50.0},
        {"skill_name": "MLOps", "required_level": 65.0, "importance": "High", "prerequisites": ["Machine Learning", "Python"], "estimated_hours": 35.0},
        {"skill_name": "System Design", "required_level": 60.0, "importance": "Medium", "prerequisites": ["Data Structures"], "estimated_hours": 30.0}
    ],
    "MLOps Engineer": [
        {"skill_name": "Python", "required_level": 85.0, "importance": "Critical", "prerequisites": [], "estimated_hours": 30.0},
        {"skill_name": "MLOps", "required_level": 85.0, "importance": "Critical", "prerequisites": ["Python", "Machine Learning"], "estimated_hours": 45.0},
        {"skill_name": "Cloud", "required_level": 75.0, "importance": "Critical", "prerequisites": [], "estimated_hours": 35.0},
        {"skill_name": "Machine Learning", "required_level": 70.0, "importance": "High", "prerequisites": ["Python"], "estimated_hours": 35.0},
        {"skill_name": "System Design", "required_level": 75.0, "importance": "High", "prerequisites": [], "estimated_hours": 35.0},
        {"skill_name": "Data Structures", "required_level": 65.0, "importance": "Medium", "prerequisites": ["Python"], "estimated_hours": 25.0}
    ],
    "Data Scientist": [
        {"skill_name": "Python", "required_level": 85.0, "importance": "Critical", "prerequisites": [], "estimated_hours": 30.0},
        {"skill_name": "Statistics", "required_level": 85.0, "importance": "Critical", "prerequisites": [], "estimated_hours": 35.0},
        {"skill_name": "Machine Learning", "required_level": 80.0, "importance": "Critical", "prerequisites": ["Python", "Statistics"], "estimated_hours": 40.0},
        {"skill_name": "Data Visualization", "required_level": 75.0, "importance": "High", "prerequisites": ["Python"], "estimated_hours": 20.0},
        {"skill_name": "SQL", "required_level": 75.0, "importance": "High", "prerequisites": [], "estimated_hours": 20.0},
        {"skill_name": "Deep Learning", "required_level": 50.0, "importance": "Medium", "prerequisites": ["Machine Learning"], "estimated_hours": 30.0}
    ],
    "Full Stack AI Developer": [
        {"skill_name": "Python", "required_level": 80.0, "importance": "Critical", "prerequisites": [], "estimated_hours": 30.0},
        {"skill_name": "React", "required_level": 80.0, "importance": "Critical", "prerequisites": [], "estimated_hours": 35.0},
        {"skill_name": "System Design", "required_level": 70.0, "importance": "High", "prerequisites": [], "estimated_hours": 30.0},
        {"skill_name": "MLOps", "required_level": 60.0, "importance": "High", "prerequisites": ["Python"], "estimated_hours": 30.0},
        {"skill_name": "SQL", "required_level": 70.0, "importance": "Medium", "prerequisites": [], "estimated_hours": 20.0},
        {"skill_name": "Machine Learning", "required_level": 60.0, "importance": "Medium", "prerequisites": ["Python"], "estimated_hours": 30.0}
    ]
}

def get_career_matrix(career_role: str) -> List[Dict[str, Any]]:
    return CAREER_MATRICES.get(career_role, CAREER_MATRICES["AI Engineer"])
