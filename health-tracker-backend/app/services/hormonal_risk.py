# app/services/hormonal_risk.py

from datetime import date
from typing import List, Dict

from app.models.models import Cycle, SymptomLog


def analyze_hormonal_risk(
    cycles: List[Cycle],
    symptoms: List[SymptomLog],
) -> Dict:
    """
    PCOS / PCOD style risk analysis.
    ⚠️ This is NOT a diagnosis, just pattern-based risk awareness.
    """

    score = 0
    observations: List[str] = []

    # ----------------------
    # CYCLE ANALYSIS
    # ----------------------

    # Need at least 3 cycles for meaningful trend
    if len(cycles) < 3:
        observations.append(
            "Not enough cycle history. Add at least 3 cycles for better hormonal risk analysis."
        )
        return {
            "risk_type": "PCOS / PCOD Indicators",
            "risk_level": "LOW",
            "score": score,
            "observations": observations,
            "recommendation": "Keep tracking your cycles regularly for better insights.",
        }

    # Sort cycles oldest → newest
    sorted_cycles = sorted(cycles, key=lambda c: c.cycle_start_date)

    cycle_lengths: List[int] = []
    for i in range(1, len(sorted_cycles)):
        d1 = sorted_cycles[i - 1].cycle_start_date
        d2 = sorted_cycles[i].cycle_start_date
        length_days = (d2 - d1).days
        if length_days > 0:
            cycle_lengths.append(length_days)

    if not cycle_lengths:
        observations.append("Unable to compute cycle lengths from your data.")
        return {
            "risk_type": "PCOS / PCOD Indicators",
            "risk_level": "LOW",
            "score": score,
            "observations": observations,
            "recommendation": "Please keep logging cycles regularly.",
        }

    avg_cycle = sum(cycle_lengths) / len(cycle_lengths)
    min_len = min(cycle_lengths)
    max_len = max(cycle_lengths)
    variation = max_len - min_len

    # Long cycles (>35 days) – common PCOS pattern
    if avg_cycle > 35:
        score += 3
        observations.append(
            f"Average cycle length is long (~{round(avg_cycle)} days), which can be a sign of hormonal imbalance."
        )

    # Very long cycles (>45 days) – stronger signal
    if avg_cycle > 45:
        score += 2
        observations.append(
            "Some cycles appear very long (>45 days), suggesting possible missed periods."
        )

    # Irregular cycles – high variation
    if variation > 10:
        score += 2
        observations.append(
            f"Cycle length varies a lot (from {min_len} to {max_len} days). Irregular cycles can be associated with PCOS/PCOD."
        )

    # Very short cycles (<21 days) also hormonal issue
    if min_len < 21:
        score += 1
        observations.append(
            "Some cycles are very short (<21 days), which may indicate hormonal imbalance."
        )

    # ----------------------
    # SYMPTOM ANALYSIS
    # ----------------------

    # We only have free-text `notes`, so we do simple keyword scanning.
    symptom_keywords = [
        "acne",
        "pimples",
        "weight",
        "obese",
        "hair fall",
        "hairfall",
        "facial hair",
        "chin hair",
        "thinning hair",
        "fatigue",
        "tired",
        "mood",
        "anxiety",
        "depression",
    ]

    symptom_hits = 0
    for log in symptoms:
        text = (log.notes or "").lower()
        if any(word in text for word in symptom_keywords):
            symptom_hits += 1

    if symptom_hits >= 3:
        score += 2
        observations.append(
            "Multiple logs mention symptoms like acne, hair changes, weight changes, or fatigue – these can be related to hormonal imbalance."
        )
    elif symptom_hits > 0:
        score += 1
        observations.append(
            "You have mentioned some symptoms that may be related to hormones. Keep tracking them regularly."
        )

    # ----------------------
    # FINAL RISK LEVEL
    # ----------------------

    if score <= 2:
        risk = "LOW"
    elif 3 <= score <= 5:
        risk = "MODERATE"
    else:
        risk = "HIGH"

    if not observations:
        observations.append("No strong hormonal imbalance patterns detected from your data so far.")

    return {
        "risk_type": "PCOS / PCOD Indicators",
        "risk_level": risk,
        "score": score,
        "observations": observations,
        "recommendation": (
            "This is NOT a medical diagnosis. If you are worried about your periods or symptoms, "
            "please consult a gynecologist or endocrinologist for proper evaluation."
        ),
    }
