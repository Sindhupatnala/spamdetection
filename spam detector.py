"""
SpamShield CLI — Spam Message Detection
Task 02 | IncodeVision AI Internship
Dataset: SMS Spam Collection (5,572 messages)
Algorithm: TF-IDF + Multinomial Naive Bayes
"""

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.metrics import (
    accuracy_score, classification_report,
    confusion_matrix
)
import re
import sys
import os

# ─────────────────────────────────────────
#  ANSI colour helpers
# ─────────────────────────────────────────
RED    = "\033[91m"
GREEN  = "\033[92m"
YELLOW = "\033[93m"
CYAN   = "\033[96m"
BOLD   = "\033[1m"
DIM    = "\033[2m"
RESET  = "\033[0m"

def banner():
    print(f"""
{CYAN}{BOLD}
╔══════════════════════════════════════════════════╗
║          🛡️  SpamShield — Spam Detector          ║
║     TF-IDF + Naive Bayes | SMS Spam Collection   ║
╚══════════════════════════════════════════════════╝
{RESET}""")

# ─────────────────────────────────────────
#  Text pre-processing
# ─────────────────────────────────────────
def preprocess(text: str) -> str:
    text = text.lower()
    text = re.sub(r"http\S+|www\S+", " url ", text)
    text = re.sub(r"\d+", " num ", text)
    text = re.sub(r"[^\w\s]", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text

# ─────────────────────────────────────────
#  Load & train
# ─────────────────────────────────────────
def load_and_train():
    # Try to load the bundled TSV; fall back to a tiny built-in set
    tsv_path = os.path.join(os.path.dirname(__file__), "sms_spam.tsv")

    if os.path.exists(tsv_path):
        df = pd.read_csv(tsv_path, sep="\t", header=None, names=["label", "message"])
        source = f"SMS Spam Collection  ({len(df):,} messages)"
    else:
        # ── built-in fallback dataset ──────────────────────────────
        built_in = [
            # spam
            ("spam", "Congratulations! You've won a £1000 Walmart gift card. Call now to claim your prize!"),
            ("spam", "FREE entry in 2 a wkly comp to win FA Cup final tkts 21st May 2005."),
            ("spam", "URGENT! You have won a 1 week FREE membership in our prize scheme."),
            ("spam", "Txt: STOP to 87239 to stop receiving messages from this number."),
            ("spam", "You have been selected as a winner. Call 09061743810 to claim £500."),
            ("spam", "Claim your FREE mobile & 500 TXT Messages. Call 09050000327 NOW!"),
            ("spam", "SIX chances to win CASH! From 100 to 20,000 pounds txt CSH11 to 87575."),
            ("spam", "Had your contract mobile 11 mnths or more? U R entitled to update."),
            ("spam", "Our record indicates you have not claimed your FREE ringtone. Call 0800."),
            ("spam", "Important message: Your account has been suspended. Verify at link."),
            ("spam", "Win a brand new phone every week. Text WIN to 12345. T&Cs apply."),
            ("spam", "Congratulations ur awarded 500 of CD vouchers or 125gift guaranteed."),
            # ham
            ("ham", "Hey, are you coming to the party tonight?"),
            ("ham", "Can you pick up some milk on your way home?"),
            ("ham", "I'll be there in 10 minutes, just stuck in traffic."),
            ("ham", "Don't forget our meeting tomorrow at 9am."),
            ("ham", "Thanks for dinner last night, it was really lovely!"),
            ("ham", "Happy birthday! Hope you have a fantastic day."),
            ("ham", "The report is ready, I've sent it to your email."),
            ("ham", "Call me when you get a chance, nothing urgent."),
            ("ham", "Movie starts at 8, want to grab food before?"),
            ("ham", "Got your message. I'll check and get back to you."),
            ("ham", "Are you free this weekend for a catch-up?"),
            ("ham", "Just finished the gym, heading home now."),
        ]
        df = pd.DataFrame(built_in, columns=["label", "message"])
        source = f"Built-in dataset ({len(df)} messages)"

    df["clean"] = df["message"].apply(preprocess)

    X_train, X_test, y_train, y_test = train_test_split(
        df["clean"], df["label"],
        test_size=0.2, random_state=42, stratify=df["label"]
    )

    vectorizer = TfidfVectorizer(
        ngram_range=(1, 2),
        max_features=8000,
        sublinear_tf=True
    )
    X_tr_vec = vectorizer.fit_transform(X_train)
    X_te_vec = vectorizer.transform(X_test)

    model = MultinomialNB(alpha=0.1)
    model.fit(X_tr_vec, y_train)

    y_pred = model.predict(X_te_vec)
    acc = accuracy_score(y_test, y_pred)

    return model, vectorizer, acc, y_test, y_pred, source, len(df)

# ─────────────────────────────────────────
#  Prediction helper
# ─────────────────────────────────────────
def predict(text: str, model, vectorizer):
    clean  = preprocess(text)
    vec    = vectorizer.transform([clean])
    label  = model.predict(vec)[0]
    proba  = model.predict_proba(vec)[0]
    spam_p = proba[list(model.classes_).index("spam")] * 100
    ham_p  = 100 - spam_p
    return label, spam_p, ham_p

# ─────────────────────────────────────────
#  Display result
# ─────────────────────────────────────────
def display_result(text: str, label: str, spam_p: float, ham_p: float):
    bar_len = 30
    spam_fill = int(spam_p / 100 * bar_len)
    ham_fill  = bar_len - spam_fill

    if label == "spam":
        colour  = RED
        emoji   = "🚨"
        verdict = "SPAM"
    else:
        colour  = GREEN
        emoji   = "✅"
        verdict = "NOT SPAM (Ham)"

    print(f"\n{DIM}{'─'*52}{RESET}")
    print(f"  Message : {DIM}{text[:70]}{'…' if len(text)>70 else ''}{RESET}")
    print(f"  Verdict : {colour}{BOLD}{emoji}  {verdict}{RESET}")
    print()
    print(f"  {RED}Spam{RESET}  [{RED}{'█'*spam_fill}{DIM}{'░'*(bar_len-spam_fill)}{RESET}] {RED}{spam_p:5.1f}%{RESET}")
    print(f"  {GREEN}Ham  {RESET} [{GREEN}{'█'*ham_fill}{DIM}{'░'*(bar_len-ham_fill)}{RESET}] {GREEN}{ham_p:5.1f}%{RESET}")
    print(f"{DIM}{'─'*52}{RESET}\n")

# ─────────────────────────────────────────
#  Main interactive loop
# ─────────────────────────────────────────
def main():
    banner()
    print(f"{CYAN}  ⚙  Training model …{RESET}", end="", flush=True)

    model, vectorizer, acc, y_test, y_pred, source, n = load_and_train()

    print(f"\r{GREEN}  ✔  Model ready!{RESET}                    ")
    print(f"\n  {BOLD}Dataset  :{RESET} {source}")
    print(f"  {BOLD}Algorithm:{RESET} TF-IDF (1-2 ngrams, 8k features) + Multinomial Naive Bayes")
    print(f"  {BOLD}Accuracy :{RESET} {GREEN}{BOLD}{acc*100:.2f}%{RESET}")

    # Detailed metrics
    print(f"\n{DIM}  Classification Report:{RESET}")
    report = classification_report(y_test, y_pred, target_names=["Ham", "Spam"])
    for line in report.splitlines():
        print(f"  {DIM}{line}{RESET}")

    cm = confusion_matrix(y_test, y_pred, labels=["ham", "spam"])
    print(f"\n{DIM}  Confusion Matrix  (rows=actual, cols=predicted):{RESET}")
    print(f"  {DIM}           Ham   Spam{RESET}")
    print(f"  {DIM}  Ham   [{GREEN}{cm[0][0]:5}{RESET}{DIM}  {RED}{cm[0][1]:4}{RESET}{DIM} ]{RESET}")
    print(f"  {DIM}  Spam  [{RED}{cm[1][0]:5}{RESET}{DIM}  {GREEN}{cm[1][1]:4}{RESET}{DIM} ]{RESET}")

    # ── interactive mode ──────────────────────────────────────────
    print(f"\n{CYAN}{BOLD}  ── Enter a message to check (type 'quit' to exit) ──{RESET}\n")

    while True:
        try:
            text = input(f"{YELLOW}  ➤  Your message: {RESET}").strip()
        except (EOFError, KeyboardInterrupt):
            break

        if not text:
            print(f"  {DIM}Please enter a message.{RESET}")
            continue
        if text.lower() in {"quit", "exit", "q"}:
            break

        label, spam_p, ham_p = predict(text, model, vectorizer)
        display_result(text, label, spam_p, ham_p)

    print(f"\n{CYAN}  Thanks for using SpamShield! Stay spam-free. 🛡️{RESET}\n")

if __name__ == "__main__":
    main()