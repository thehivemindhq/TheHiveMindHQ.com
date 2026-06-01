# Getting Started — from download to productive in ~15 minutes

No coding needed. You'll copy a couple of lines and press Enter. Take it one step
at a time.

---

## Step 1 — Install Python (one time, ~3 min)

Python is the small engine that runs the dashboard.

**Windows**
1. Go to **python.org/downloads** and click the yellow **Download Python** button.
2. Open the downloaded file.
3. **Important:** on the first installer screen, tick **"Add python.exe to PATH"**
   at the bottom *before* clicking anything else.
4. Click **Install Now**, let it finish, then **Close**.

**Mac**
1. Go to **python.org/downloads** and download the macOS installer.
2. Open it and click through the steps (defaults are fine).

---

## Step 2 — Unzip the download (~1 min)

1. Find the `equity-desk.zip` you downloaded.
2. Right-click it → **Extract All** (Windows) or double-click it (Mac).
3. You'll get a folder called `equity-desk`. Put it somewhere easy, like your
   Desktop.

---

## Step 3 — Open a command window in that folder (~1 min)

**Windows**
1. Open the `equity-desk` folder so you can see `app.py` inside it.
2. Click the **address bar** at the top of the window (the strip showing the
   folder path), type `cmd`, and press **Enter**. A black window opens, already
   pointing at the folder.

**Mac**
1. Open **Terminal** (press Cmd+Space, type "Terminal", Enter).
2. Type `cd ` (with a space), then drag the `equity-desk` folder into the
   Terminal window, and press **Enter**.

---

## Step 4 — Install the pieces it needs (one time, ~2 min)

In that window, type this and press **Enter**:

```
pip install -r requirements.txt
```

(On Mac, if that doesn't work, use `pip3` instead of `pip`.)

Text will scroll for a minute — that's normal. Wait for the blinking cursor to
return.

---

## Step 5 — Start the dashboard

Type this and press **Enter**:

```
python app.py
```

(On Mac, use `python3 app.py`.)

You'll see: **Equity Desk running at http://127.0.0.1:5000**

---

## Step 6 — Open it

In any browser, go to:

```
http://127.0.0.1:5000
```

The dashboard loads with sample stocks. **Keep the black window open** while you
use it — it's doing the work. Closing it switches the dashboard off.

---

## Step 7 — Make it yours (the productive part)

The sample holdings are just placeholders. To track your real portfolio:

1. Open the `Holdings` folder. You'll see `groww.csv` and `kite.csv` — one file
   per broker.
2. Double-click one to open it in Excel. Each row is one holding:
   - **symbol** — the Yahoo ticker. NSE stocks end in `.NS` (e.g. `TCS.NS`,
     `BAJFINANCE.NS`); BSE stocks end in `.BO`.
   - **name** — whatever label you want.
   - **sector** and **industry** — your own buckets (these drive the pie charts).
   - **qty** and **avg** — *optional.* Leave blank to just watch the price. Fill
     in both (units held + your average buy price) to unlock value, profit/loss,
     and weights.
   - **cap** — *optional:* `large`, `mid`, `small`, or `etf`. Leave blank and it's
     estimated automatically; tag `etf` for funds.
3. Replace the sample rows with your own. Add or delete rows freely. Rename the
   files (e.g. `zerodha.csv`) or add more — each CSV becomes its own portfolio.
4. **Save** (keep the CSV format when Excel asks).
5. Back in the dashboard, click **↻ refresh now**. Your holdings appear — no
   restart needed.

That's it. You're productive.

---

## Optional — the Claude tab

Open the **Claude** tab to write a short "thesis" for each holding (why you own
it, and what would make you sell), and to generate ready-made analysis prompts you
can paste into Claude for a deeper look at deploying capital, checking a thesis,
or reviewing your allocation. Your thesis notes live in `Claude/theses.json`.

---

## Next time you want it

You only ever repeat **Step 3** (open the command window) and **Step 5**
(`python app.py`). Steps 1, 2, and 4 are one-time.

## If something goes wrong

- **"python is not recognized" (Windows):** the PATH box in Step 1 was missed.
  Reinstall Python and tick it — or type `py app.py` instead.
- **Dashboard says "could not reach backend":** the black window closed. Reopen it
  (Steps 3 + 5).
- **A stock shows "data unavailable":** check the ticker spelling and the `.NS` /
  `.BO` ending; or the data source is briefly rate-limiting — wait a minute and
  refresh.

Informational/educational use only — not investment advice.
