import google.generativeai as genai
from datetime import timedelta, date
from typing import Dict
from sqlalchemy.orm import Session
from uuid import UUID

from app.core.config import settings
from app.models.models import (
    UserProfile,
    SymptomLog,
    Cycle,
    AIInsight,
)


class AIService:
    def __init__(self):
        if not settings.GEMINI_API_KEY:
            raise RuntimeError("❌ GEMINI_API_KEY not set")

        genai.configure(api_key=settings.GEMINI_API_KEY)
        self.model = genai.GenerativeModel("models/gemini-2.5-flash")

    # -------------------------------------------------
    # Helpers
    # -------------------------------------------------

    def _calculate_age(self, dob: date) -> int:
        today = date.today()
        return today.year - dob.year - (
            (today.month, today.day) < (dob.month, dob.day)
        )

    def _get_user_context(self, db: Session, user_id: UUID) -> Dict:
        profile = (
            db.query(UserProfile)
            .filter(UserProfile.user_id == user_id)
            .first()
        )

        # Symptoms (30 days)
        start_date = date.today() - timedelta(days=30)
        symptoms = (
            db.query(SymptomLog)
            .filter(
                SymptomLog.user_id == user_id,
                SymptomLog.log_date >= start_date,
            )
            .order_by(SymptomLog.log_date.desc())
            .limit(20)
            .all()
        )

        # Cycles (latest 6)
        cycles = (
            db.query(Cycle)
            .filter(Cycle.user_id == user_id)
            .order_by(Cycle.last_period_date.desc())
            .limit(6)
            .all()
        )

        return {
            "profile": profile,
            "symptoms": symptoms,
            "cycles": cycles,
        }

    def _format_context(self, ctx: Dict) -> str:
        profile = ctx["profile"]
        symptoms = ctx["symptoms"]
        cycles = ctx["cycles"]

        text = "USER HEALTH SUMMARY\n\n"

        if profile:
            text += "Profile:\n"
            if profile.date_of_birth:
                text += f"- Age: {self._calculate_age(profile.date_of_birth)}\n"
            if profile.height_cm:
                text += f"- Height: {profile.height_cm} cm\n"
            if profile.weight_kg:
                text += f"- Weight: {profile.weight_kg} kg\n"
            if profile.diagnosed_conditions:
                text += f"- Conditions: {profile.diagnosed_conditions}\n"

        text += "\nRecent Symptoms:\n"
        if symptoms:
            for s in symptoms[:10]:
                text += f"- {s.log_date}: {s.notes}\n"
        else:
            text += "- None logged\n"

        text += "\nCycle History:\n"
        if cycles:
            for c in cycles:
                text += (
                    f"- Last period: {c.last_period_date}, "
                    f"cycle: {c.cycle_length} days, "
                    f"period: {c.period_length} days\n"
                )
        else:
            text += "- No cycle data\n"

        return text

    # -------------------------------------------------
    # Public APIs
    # -------------------------------------------------

    async def analyze_health_data(
        self,
        db: Session,
        user_id: UUID,
        days: int = 30,
        analysis_type: str = "comprehensive",
    ) -> str:
        ctx = self._get_user_context(db, user_id)
        formatted = self._format_context(ctx)

        prompt = f"""
You are a friendly women's health AI.

{formatted}

Instructions:
- Identify cycle regularity using cycle_length
- Link symptoms to cycle phases if possible
- Be encouraging and simple
- NO diagnosis (PCOS/PCOD/etc.)
- Suggest lifestyle improvements
- Suggest doctor visit only if needed
"""

        response = self.model.generate_content(prompt)
        insight_text = response.text.strip()

        db.add(
            AIInsight(
                user_id=user_id,
                title="AI Health Analysis",
                content=insight_text,
            )
        )
        db.commit()

        return insight_text

    async def ask_question(
        self,
        db: Session,
        user_id: UUID,
        question: str,
    ) -> str:
        ctx = self._get_user_context(db, user_id)
        formatted = self._format_context(ctx)

        prompt = f"""
You are an empathetic women's health assistant.

{formatted}

User question:
"{question}"

Rules:
- Be kind, simple, reassuring
- Use existing data
- NO medical diagnosis
"""

        response = self.model.generate_content(prompt)
        return response.text.strip()

    async def predict_next_cycle(
        self,
        db: Session,
        user_id: UUID,
    ) -> Dict:
        cycles = (
            db.query(Cycle)
            .filter(Cycle.user_id == user_id)
            .order_by(Cycle.last_period_date.desc())
            .limit(6)
            .all()
        )

        if not cycles:
            return {
                "predicted_start_date": None,
                "average_cycle_length": None,
                "confidence": "low",
                "analysis": "",
                "message": "Add your cycle data to get predictions.",
            }

        lengths = [c.cycle_length for c in cycles if c.cycle_length]

        avg = round(sum(lengths) / len(lengths), 1)
        last = cycles[0].last_period_date
        next_date = last + timedelta(days=int(avg))

        prompt = f"""
Cycle lengths: {lengths}
Average: {avg} days
Last period: {last}
Next expected: {next_date}

Explain this gently and clearly.
"""

        try:
            analysis = self.model.generate_content(prompt).text.strip()
        except Exception:
            analysis = "Prediction based on average cycle length."

        return {
            "predicted_start_date": next_date.isoformat(),
            "average_cycle_length": avg,
            "confidence": "high" if len(lengths) >= 4 else "medium",
            "analysis": analysis,
            "message": None,
        }


# ✅ Singleton
ai_service = AIService()
