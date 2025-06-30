# 🍽️ Dopamine Diner – Gamified Anti-Doomscrolling Extension

*Live Demo:* [https://dopamine-diner.vercel.app](https://dopamine-diner.vercel.app)  
*Chrome Extension ZIP:* Available in /extension-build (see steps below)  
*Try It Now:* [Install via Chrome](https://dopamine-diner.vercel.app) (drag-and-drop instructions below)

---

## 📦 Download & Install the Extension (in Chrome)

1. Go to [https://dopamine-diner.vercel.app](https://dopamine-diner.vercel.app)
2. Click the *Download Extension* button (or download from /extension-build.zip).
3. Extract the ZIP locally.
4. Open a new tab and visit chrome://extensions/
5. Enable *Developer Mode* (top right).
6. Click *Load Unpacked* and select the extracted folder.
7. You're ready! Start browsing Instagram, YouTube, etc., and let the Diner serve you mindful nudges.

---

## 🧠 Project Description

*Dopamine Diner* is a mindful, gamified Chrome extension that interrupts doomscrolling patterns through creative puzzles, reflection prompts, breathing breaks, and a reward system based on your digital behavior.

It transforms the passive act of scrolling into an interactive "digital dining" experience, where your scroll behavior becomes ingredients for a daily “dish,” and habits are gamified to create more mindful consumption.

---

## 🧪 Intervention Logic

The system monitors:

- ⏳ *Time spent* on scroll-heavy sites (e.g., YouTube, Instagram).
- 📜 *Scroll distance*
- 🔄 *Tab switches*

When thresholds are crossed (e.g., 20 min + high scroll volume), a *Burn Alert* is triggered, pausing the feed and presenting the user with:
- A puzzle or game 🍳
- A reflection question 💬
- A reset button or extended mindful break 🧘

Each interaction is tracked and contributes to the user’s “dish” for the day, generated using AI.

---

## 📈 Impact Measurement

We use the following metrics to evaluate behavioral shifts:

- ⏱️ *Time before burn alert*: Is the user scrolling less before intervention?
- 🧩 *Interaction rate*: Are users completing games or skipping them?
- 🧠 *Reflection entries*: Are users taking time to reflect?
- 📉 *Reduction in tab switches* or scroll length after repeated sessions
- ✨ *AI-generated summary quality* (daily feedback loop)

Data is stored temporarily in local/session storage (privacy-first), and anonymized summaries are used for insights.

---

## 🚶 User Experience Flow

```text
[Open Social Feed] → [Scroll Detected] → [Threshold Crossed] → 
🚨 Burn Alert Modal → 🎮 Puzzle or 🌬️ Break → ✍️ Reflection →
🍽️ “Today’s Dish” Generated → 📊 Raw Data & AI Summary → 🎁 Daily Challenge Complete
