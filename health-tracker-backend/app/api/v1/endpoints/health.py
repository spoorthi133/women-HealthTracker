from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from statistics import stdev
from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.models import User, Cycle, SymptomLog
from app.services.pcos_risk_service import calculate_pcos_risk

router = APIRouter(prefix="/health", tags=["Health"])


@router.get("/hormonal-risk")
def hormonal_risk(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    cycles = (
        db.query(Cycle)
        .filter(Cycle.user_id == current_user.id)
        .order_by(Cycle.last_period_date.desc())
        .limit(6)
        .all()
    )

    symptoms = (
        db.query(SymptomLog)
        .filter(SymptomLog.user_id == current_user.id)
        .limit(30)
        .all()
    )

    score = 0
    observations = []

    # ✅ Rule 1: Cycle irregularity
    if len(cycles) >= 3:
        lengths = [c.cycle_length for c in cycles if c.cycle_length]

        if len(lengths) >= 3:
            variation = stdev(lengths)
            if variation > 7:
                score += 2
                observations.append(
                    "High variation in menstrual cycle length detected"
                )

    # ✅ Rule 2: Long cycles (PCOS indicator)
    avg_cycle = (
        sum(c.cycle_length for c in cycles) / len(cycles)
        if cycles
        else None
    )

    if avg_cycle and avg_cycle > 35:
        score += 2
        observations.append("Average cycle length is longer than 35 days")

    # ✅ Rule 3: Symptoms linked to hormonal imbalance
    frequent_symptoms = [
        "acne",
        "hair fall",
        "facial hair",
        "weight gain",
        "irregular periods",
        "fatigue",
        "mood swings",
    ]

    symptom_text = " ".join(s.notes.lower() for s in symptoms)
    matched = [s for s in frequent_symptoms if s in symptom_text]

    if len(matched) >= 2:
        score += 1
        observations.append(
            f"Reported symptoms: {', '.join(matched)}"
        )

    # ✅ Risk classification
    if score <= 1:
        level = "LOW"
    elif score <= 3:
        level = "MODERATE"
    else:
        level = "HIGH"

    return {
        "risk_level": level,
        "score": score,
        "average_cycle_length": round(avg_cycle, 1) if avg_cycle else None,
        "observations": observations or ["No significant irregularities detected"],
        "recommendation": (
            "Maintain a healthy lifestyle and continue tracking."
            if level == "LOW"
            else "Consider lifestyle changes and consult a gynecologist if symptoms persist."
        ),
        "disclaimer": "This is not a medical diagnosis",
    }


@router.get("/pcos-risk")
def pcos_risk(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return calculate_pcos_risk(db, current_user.id)
