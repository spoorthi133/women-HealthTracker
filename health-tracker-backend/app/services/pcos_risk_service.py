from typing import Dict, List
from sqlalchemy.orm import Session
from datetime import date
from statistics import stdev
from uuid import UUID

from app.models.models import Cycle, SymptomLog, UserProfile


PCOS_KEYWORDS = [
    "acne",
    "weight gain",
    "facial hair",
    "hair fall",
    "hair loss",
    "irregular bleeding",
    "fatigue",
    "missed period",
]


def calculate_pcos_risk(db: Session, user_id: UUID) -> Dict:
    score = 0
    reasons = []

    # --------------------------------------------------
    # 1️⃣ Cycle Length Analysis
    # --------------------------------------------------
    cycles = (
        db.query(Cycle)
        .filter(Cycle.user_id == user_id)
        .order_by(Cycle.last_period_date.desc())
        .limit(6)
        .all()
    )

    if len(cycles) >= 2:
        lengths = [c.cycle_length for c in cycles]

        avg_cycle = sum(lengths) / len(lengths)

        if avg_cycle > 45:
            score += 40
            reasons.append("Very long average cycle length")
        elif avg_cycle > 35:
            score += 25
            reasons.append("Long average cycle length")

        # Irregularity
        if len(lengths) >= 3:
            variation = stdev(lengths)
            if variation > 7:
                score += 20
                reasons.append("Highly irregular cycle pattern")

    # --------------------------------------------------
    # 2️⃣ Missed / Skipped periods
    # --------------------------------------------------
    skipped = sum(1 for c in cycles if c.cycle_length > 45)
    if skipped:
        score += min(skipped * 10, 20)
        reasons.append("Missed or delayed periods")

    # --------------------------------------------------
    # 3️⃣ Symptom Pattern Detection (NLP-lite)
    # --------------------------------------------------
    symptoms = (
        db.query(SymptomLog)
        .filter(SymptomLog.user_id == user_id)
        .limit(20)
        .all()
    )

    keyword_hits = 0
    for log in symptoms:
        text = log.notes.lower()
        for k in PCOS_KEYWORDS:
            if k in text:
                keyword_hits += 1

    if keyword_hits:
        symptom_score = min(keyword_hits * 5, 25)
        score += symptom_score
        reasons.append("Repeated hormone-related symptoms")

    # --------------------------------------------------
    # 4️⃣ BMI (Optional)
    # --------------------------------------------------
    profile = (
        db.query(UserProfile)
        .filter(UserProfile.user_id == user_id)
        .first()
    )

    if profile and profile.height_cm and profile.weight_kg:
        height_m = profile.height_cm / 100
        bmi = float(profile.weight_kg) / (height_m ** 2)

        if bmi > 25:
            score += 10
            reasons.append("Higher BMI")

    # --------------------------------------------------
    # FINAL RISK LEVEL
    # --------------------------------------------------
    if score <= 25:
        level = "Low"
    elif score <= 50:
        level = "Moderate"
    elif score <= 75:
        level = "High"
    else:
        level = "Very High"

    return {
        "risk_score": min(score, 100),
        "risk_level": level,
        "reasons": reasons,
        "disclaimer": "This is not a medical diagnosis."
    }
