<<<<<<< HEAD
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
=======
# SpamShield - Spam Message Detection
 
> Task 02 | IncodeVision AI Internship
 
A machine learning powered spam detection system that classifies messages as spam or ham in real time using TF-IDF vectorization and Multinomial Naive Bayes classification.
 
---
 
## Live Demo
 
[spamshield.vercel.app](https://spamshield.vercel.app)
 
---
 
## Features
 
- **Spam Detection** -- TF-IDF + Naive Bayes classifier trained on 111 messages
- **Risk Levels** -- Low / Medium / High / Critical based on spam probability
- **Confidence Badge** -- Certain / Likely / Unsure rating for each prediction
- **Tone Detector** -- Detects Aggressive, Friendly, or Neutral message tone
- **Spam Category Tags** -- Prize Scam / Phishing / Financial Fraud / Adult / SMS Scam / Tech Support
- **Keyword Highlighter** -- Highlights spam trigger words inside the message
- **Bulk Checker** -- Check multiple messages at once, one per line
- **Stats Dashboard** -- Pie chart, category breakdown, tone analysis of history
- **Export CSV** -- Download full prediction history as a CSV file
- **Copy Result** -- One click copy of the full analysis result
- **AI Explanation** -- Claude (claude-sonnet-4-6) explains why a message is spam or not
- **Dark / Light Mode** -- Toggle between themes
- **Python CLI** -- Command line version trained on the full SMS Spam Collection (5,572 messages)
---
 
## Tech Stack
 
| Layer | Technology |
|---|---|
| Frontend | React + Vite |
| ML (Web) | TF-IDF + Naive Bayes (pure JavaScript) |
| ML (CLI) | TF-IDF + Naive Bayes via scikit-learn |
| AI Explanation | Anthropic API (claude-sonnet-4-6) |
| Dataset (Web) | Built-in 111 messages |
| Dataset (CLI) | SMS Spam Collection -- 5,572 messages |
| Deployment | Vercel |
 
---
 
## How It Works
 
```
User Message
     |
     v
Text Preprocessing (lowercase, remove punctuation)
     |
     v
TF-IDF Vectorization (term frequency - inverse document frequency)
     |
     v
Multinomial Naive Bayes Classifier
     |
     v
Spam Probability + Risk Level + Confidence + Tone + Category
```
 
---
 
## Project Structure
 
```
spamshield/
├── src/
│   └── App.jsx          # Main React app with all features
├── spam_detector.py     # Python CLI version
├── sms_spam.tsv         # SMS Spam Collection dataset (for CLI)
├── index.html
├── package.json
└── vite.config.js
```
 
---
 
## Run Locally
 
### React Web App
 
```bash
npm install
npm run dev
```
 
### Python CLI
 
```bash
pip install scikit-learn pandas numpy
python spam_detector.py
```
 
Make sure `sms_spam.tsv` is in the same folder as `spam_detector.py`.
 
---
 
## Dataset
 
- **Web App** -- 111 handcrafted messages (56 spam, 55 ham) covering prize scams, phishing, financial fraud, SMS scams, and everyday conversations
- **Python CLI** -- [SMS Spam Collection](https://archive.ics.uci.edu/ml/datasets/SMS+Spam+Collection) with 5,572 real messages achieving ~98.9% accuracy
---
 
## Sample Predictions
 
| Message | Result | Risk |
|---|---|---|
| Congratulations you have won a prize call now | SPAM | Critical |
| URGENT your account has been suspended verify now | SPAM | Critical |
| FREE ringtone text WIN to 12345 | SPAM | High |
| Hey are you free tonight for dinner | HAM | Low |
| Do not forget the meeting tomorrow at 10am | HAM | Low |
 
---
 
## Author
 
**Praharshi** -- IncodeVision AI Internship, Task 02
 
---
 
## License
 
MIT
 
>>>>>>> 5f290c9feaa4f2a1e3ffdd8ad99af02988c79ec3
