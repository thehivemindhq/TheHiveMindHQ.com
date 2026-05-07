/* ===== EIGHTEEN DECISIONS — STRUCTURED DATA =====
   Every fact / number is sourced from the original cost-decision-map document.
   Each decision has the same five lenses for the executive reader.
*/

const STAGES = [
  /* ============ STAGE 1 ============ */
  {
    id: "build-buy",
    num: "01",
    label: "Build vs Buy",
    title: "How will the enterprise <em>access</em> AI capability?",
    desc: "Before a line of code is written, the team determines how the enterprise will access AI capability. This single choice creates the cost structure that every subsequent decision compounds against — typically with no Finance involvement at the gate.",
    boxes: [
      { label: "The Trap", text: "The decision is framed as a technical architecture choice. It is not. It is a multi-year commercial commitment with cost dynamics that diverge by 100× depending on volume and usage profile.", style: "" },
      { label: "Leadership Imperative", text: "This is the single highest-leverage gate in your AI programme. Every later decision compounds the structure set here. It belongs in front of a CFO, not a CTO, alone.", style: "imperative" }
    ],
    decisions: [
      {
        n: "01",
        name: "3rd-Party SaaS API — OpenAI, Anthropic, Google Gemini, Azure OpenAI",
        impact: "m",
        impactLabel: "Predictable per-use billing",
        scene: "A Tier 1 retail bank deploys an OpenAI API-powered loan-query assistant. At 50,000 customer conversations per month averaging 800 tokens, the workload costs approximately $90/month at GPT-3.5 — and approximately $2,700/month at GPT-4 for the identical workload. Same task. 30× cost delta. Selected by an engineer in a sprint, with no Finance review at the model-selection gate.",
        bars: [
          { l: "GPT-3.5 — zero-shot baseline", v: "$90/mo", p: 6, c: "var(--green)" },
          { l: "GPT-4 8K — same task", v: "$2,700/mo", p: 100, c: "var(--red)" }
        ],
        eng: "Lowest activation barrier. Maintained models. Zero infrastructure to provision. Standard procurement contracts available. Engineering velocity is maximised.",
        fin: "Per-token billing scales linearly with usage and is mathematically unbounded as adoption grows. The same task can carry a 30×–200× cost difference depending on which model the engineer selects. Vendor lock-in compounds switching cost.",
        timeline: { now: "Provision in days. Engineering productivity: high.", later: "By month 9, the bill is being explained to Finance after the fact. By year 2, switching cost is significant." },
        questions: [
          { risk: "On the Volume Inflection", q: "At what monthly volume does this change from cheapest option to most expensive option, and where are we on that curve today?", why: "Frames API as a cost structure with a crossover point — not a permanent solution." },
          { risk: "On the Procurement Discipline", q: "Which models are sanctioned for which use cases, and what governance prevents engineers from defaulting to the most powerful model available?", why: "Most overspend originates here, not in volume growth." }
        ],
        insight: "The right framing: API pricing is a temporary cost structure. The question is whether anyone has identified the volume at which the structure should change.",
        cites: "[A] GPT-3.5 at $90/mo vs GPT-4 at $2,700/mo — identical workload — FinOps Foundation, Cost Estimation of AI Workloads.<br/>[B] 30×–200× cost delta from unoptimised to fully-optimised AI workloads — FinOps Foundation, How to Forecast AI Services Costs in Cloud."
      },
      {
        n: "02",
        name: "Self-Hosting Open-Source Models — Llama, Mistral on Cloud GPU",
        impact: "h",
        impactLabel: "Economics invert at scale — calculate the crossover",
        scene: "A healthcare system cannot transmit patient records to a third-party API under HIPAA. They deploy Meta's Llama 3 on AWS SageMaker GPU infrastructure inside a private virtual network. The team selects Llama 2 70B as the inferencing model — the most capable open-source option benchmark-wise. Monthly infrastructure: approximately $7,330. The same task on Llama 2 7B: $547/month. The decision is made by the ML engineer for engineering reasons. Same compliance posture; 13× the cost.",
        bars: [
          { l: "Llama 2 7B (24GB GPU)", v: "$547/mo", p: 7, c: "var(--green)" },
          { l: "Llama 2 13B (96GB GPU)", v: "$2,552/mo", p: 35, c: "var(--amber)" },
          { l: "Llama 2 70B (192GB GPU)", v: "$7,330/mo", p: 100, c: "var(--red)" }
        ],
        eng: "Full data sovereignty. Compliance posture is straightforward (HIPAA, GDPR, regulatory data residency). Bigger models perform better on benchmarks — the natural engineering choice.",
        fin: "GPU infrastructure runs whether the model is being used or not. ML engineering and MLOps headcount is recurring and substantial. Capital commitment is multi-year — and parameter selection alone produces a 13× cost swing.",
        timeline: { now: "Compliance signed off. Capability deployed.", later: "Quarter 4 review reveals 60% GPU idle time and a parameter-size choice that could not be justified financially." },
        questions: [
          { risk: "On the Sizing Discipline", q: "Why did we select this parameter size — and what was the financial difference vs. the next size down for our actual workload?", why: "Forces the parameter choice into the open as a cost decision, not just a quality one." },
          { risk: "On the Utilisation Reality", q: "What is our actual GPU utilisation, by hour, across the last 30 days — and what is the financial cost of idle hours?", why: "Most self-hosted infrastructure is idle 40–60% of the time." }
        ],
        insight: "Self-hosting is correct under specific conditions: regulated data, very high steady-state volume, or capability the API does not provide. Outside those conditions, the economics rarely work — and the parameter-size decision is the single biggest lever.",
        cites: "[A] Llama 2 cost table — 7B $547/mo, 13B $2,552/mo, 70B $7,330/mo on SageMaker — FinOps Foundation, Cost Estimation of AI Workloads.<br/>[B] 'Higher risk of cost overruns. You are responsible for managing infrastructure' — FinOps Foundation, How to Forecast AI Services Costs in Cloud."
      },
      {
        n: "03",
        name: "Full Custom Build — Proprietary AI Trained from Scratch",
        impact: "h",
        impactLabel: "Maximum control · rarely financially justifiable",
        scene: "A global asset manager commissions a proprietary LLM trained on 10 years of internal research and transaction data. Board rationale: a competitive moat no vendor can replicate. Approved budget: $4.2M. Timeline: 18 months. By month 12, the model is delivered with strong performance — and a fine-tuned foundation model from a managed service costs approximately $120k for similar performance on the same proprietary dataset. The competitive moat is real. Whether it justifies a 35× cost premium is the question that was never asked.",
        bars: [
          { l: "Fine-tune a foundation model", v: "~$120k · 3mo", p: 3, c: "var(--green)" },
          { l: "Custom training — this example", v: "$4.2M · 18mo", p: 100, c: "var(--red)" }
        ],
        eng: "Maximum strategic control. Bespoke optimisation for proprietary workflow. A genuine competitive moat. Independence from vendor lifecycle.",
        fin: "Capital commitment in millions. Recurring training and infrastructure spend. Multi-year timeline. Carries continuous obsolescence risk against rapidly improving foundation models. The ongoing cost of staying competitive is the cost no-one models at the gate.",
        timeline: { now: "Strategic narrative is compelling. Programme is launched.", later: "By month 18, foundation models have advanced. The 'moat' requires another $2M to maintain parity." },
        questions: [
          { risk: "On the Counterfactual", q: "What is the financial gap between this build and a fine-tuned foundation model achieving 90% of the capability — and what specifically is in the 10% gap that justifies the premium?", why: "Forces the strategic argument to engage with the actual cost differential." },
          { risk: "On the Maintenance Reality", q: "What annual run-rate must this carry, year on year, to remain competitive against foundation models that improve continuously?", why: "Most custom-build approvals model build cost — not the cost of staying current." }
        ],
        insight: "Full custom build is correct in narrow circumstances. Most cases that look like custom build are better served by fine-tuning — and the evaluation should compare against that, with a Finance signature on the differential.",
        cites: "[A] Custom build cost band $1M–$10M+ for proprietary LLM training; fine-tuning typically $50k–$500k — FinOps Foundation, Cost Estimation of AI Workloads.<br/>[A] Fine-tuning cost example: $14k for similar capability on proprietary data — FinOps Foundation, Cost Estimation of AI Workloads."
      }
    ]
  },

  /* ============ STAGE 2 ============ */
  {
    id: "model-selection",
    num: "02",
    label: "Model Selection",
    title: "Which model — and <em>why this one?</em>",
    desc: "Model selection is the decision that most frequently produces invisible, compounding overspend in enterprise AI. The engineering instinct is to default to the most capable model — because it is technically defensible, eliminates accuracy risk, and is the path of least career resistance. The financial impact is rarely visible at the decision gate.",
    boxes: [
      { label: "The Pattern", text: "There is no engineering reward for selecting the cheaper model. There is significant career exposure if a less-capable model produces a quality issue in production. Without an explicit gate, the rational engineering decision is always to over-specify.", style: "" },
      { label: "Leadership Imperative", text: "Model selection should not be a sprint-level engineering decision. It is a recurring cost commitment requiring documented justification — and a sanctioned model list per use case category.", style: "imperative" }
    ],
    decisions: [
      {
        n: "04",
        name: "Choosing a model more capable than the task complexity warrants",
        impact: "h",
        impactLabel: "Up to 150× cost for marginal quality gain",
        scene: "A global retailer deploys AI to route 300,000 customer support emails per month into 12 categories. GPT-3.5 Turbo achieves 94% classification accuracy at $90/month. GPT-4 achieves 96% at $2,700/month. The team selects GPT-4 because '2% accuracy improvement matters at scale.' That improvement is real. The 30× cost premium for it was never modelled at the gate.",
        bars: [
          { l: "GPT-3.5 Turbo (94% accuracy)", v: "$90/mo", p: 3, c: "var(--green)" },
          { l: "Bedrock Claude Instant", v: "$188/mo", p: 7, c: "var(--green)" },
          { l: "Bedrock Claude 2", v: "$1,183/mo", p: 44, c: "var(--amber)" },
          { l: "GPT-4 8K (96% accuracy)", v: "$2,700/mo", p: 100, c: "var(--red)" }
        ],
        eng: "Higher-capability models carry lower technical risk. They produce better edge-case handling. The engineer is professionally protected against any future quality complaint by having selected the most capable option available.",
        fin: "Each task has a quality–cost frontier. Most enterprise tasks operate well below the frontier where the premium model adds value. The cost of a 2% accuracy uplift on a routing task is not a defensible operational expense — it is an engineering hedge.",
        timeline: { now: "Premium model selected. Quality assured. No questions raised.", later: "By Q3, the bill arrives. The accuracy delta versus the cheaper option turns out to be 2 percentage points." },
        questions: [
          { risk: "On the Quality–Cost Frontier", q: "What is the documented quality–cost evaluation comparing this model against the next-cheaper option for this specific task?", why: "Forces the comparison to happen explicitly and on paper." },
          { risk: "On the Sanctioned-Model List", q: "Do we have a sanctioned model list per use case category — and is selection of a model above that tier subject to documented sign-off?", why: "Closes the gate at the procurement level rather than the engineering level." }
        ],
        insight: "Model selection without a quality–cost evaluation matrix is the single most common source of enterprise AI overspend. The fix is governance, not engineering.",
        cites: "[A] GPT-3.5 at $90/mo vs GPT-4 at $2,700/mo — identical workload — FinOps Foundation, Cost Estimation of AI Workloads.<br/>[A] Bedrock pricing: Claude Instant $188/mo, Claude 2 $1,183/mo for the same task — FinOps Foundation, Cost Estimation of AI Workloads."
      },
      {
        n: "05",
        name: "Parameter size selection for self-hosted model deployments",
        impact: "h",
        impactLabel: "3–15× infrastructure cost swing on one architectural decision",
        scene: "A logistics operator self-hosts an inventory query assistant for 2,400 warehouse operatives. The team selects Llama 2 70B — highest-performing on published reasoning benchmarks — over Llama 2 7B. Infrastructure cost: $7,330/month versus $547/month. The 70B model marginally outperforms the 7B on the actual production workload, which is structured data lookup. The 13× cost premium was paid for benchmark performance the workload does not require.",
        bars: [
          { l: "Llama 2 7B (24GB GPU)", v: "$547/mo", p: 7, c: "var(--green)" },
          { l: "Llama 2 13B (96GB GPU)", v: "$2,552/mo", p: 35, c: "var(--amber)" },
          { l: "Llama 2 70B (192GB GPU)", v: "$7,330/mo", p: 100, c: "var(--red)" }
        ],
        eng: "Larger parameter counts produce stronger performance on published benchmarks. Engineering selects against benchmark performance because that is what is publicly comparable.",
        fin: "Benchmark performance and production-task performance are not the same metric. The right parameter size is the smallest one that meets the actual workload's quality bar — and that is rarely the largest available option.",
        timeline: { now: "Largest model deployed. Capability headroom assured.", later: "Six months in, the workload uses 30% of the model's capability. The other 70% is paid for monthly." },
        questions: [
          { risk: "On the Workload-Specific Evaluation", q: "Has the team evaluated the smaller parameter sizes specifically against this workload's accuracy bar — not against published benchmarks?", why: "Production workload performance is what the bill pays for, not benchmark performance." },
          { risk: "On the Right-Sizing Discipline", q: "What is our standard process for evaluating parameter size as a financial decision before infrastructure provisioning?", why: "Without a process, the default is always the largest available." }
        ],
        insight: "Right-sized parameter selection is the highest-leverage cost discipline in self-hosted deployments. It rarely happens without an explicit gate.",
        cites: "[A] Full Llama 2 cost table across SageMaker instances — FinOps Foundation, Cost Estimation of AI Workloads."
      },
      {
        n: "06",
        name: "Adopting new model versions immediately upon release",
        impact: "h",
        impactLabel: "5–20× cost jump per major version — without a review gate",
        scene: "A legal-technology firm operates a contract review pipeline on GPT-4-turbo at $4,500/month, processing 800 contracts/month. A new model version is released with improved reasoning. The team upgrades within a sprint. New monthly cost: $13,500. Output quality is genuinely better. Whether the 3× cost increase delivers proportional value to the contract review workflow was never assessed before the upgrade went live.",
        bars: [
          { l: "Previous generation — baseline", v: "$4,500/mo", p: 33, c: "var(--green)" },
          { l: "Next generation — same workload", v: "$13,500/mo", p: 100, c: "var(--red)" }
        ],
        eng: "Newer models are better. Adopting them is best engineering practice. There is professional reward for being on the latest — and professional risk in falling behind.",
        fin: "Generation-over-generation pricing routinely jumps 3–5×. The improvement is real. The question is whether your specific workload extracts proportional value — a question that is rarely asked at the upgrade gate.",
        timeline: { now: "Latest model live. Engineering capability current. Velocity strong.", later: "End-of-quarter Finance review surfaces a 3× line increase that no-one approved as a financial decision." },
        questions: [
          { risk: "On the Cost-Triggered Review", q: "What is our governance trigger when a model upgrade increases monthly cost by more than a threshold percentage?", why: "Without a trigger, the cost increase is invisible until the bill arrives." },
          { risk: "On the Quality–Value Test", q: "Has the value of the upgrade been measured against the workload — not against benchmarks — before the new pricing structure was committed to?", why: "Benchmark improvement and workload value are independent." }
        ],
        insight: "Model upgrades are the most common cost-acceleration event in enterprise AI. They require a Finance gate, not just an engineering one.",
        cites: "[A] GPT-3.5 to GPT-4 cost differential — 30× — FinOps Foundation, Cost Estimation of AI Workloads.<br/>[B] 'Generation-over-generation pricing routinely jumps 3–5×' — FinOps Foundation, How to Forecast AI Services Costs in Cloud."
      }
    ]
  },

  /* ============ STAGE 3 ============ */
  {
    id: "prompt-data",
    num: "03",
    label: "Prompt & Data Design",
    title: "What goes into <em>every request?</em>",
    desc: "With managed AI services, billing is per token — per word in, per word out. Every design decision about what to include in an AI request is a recurring cost commitment that compounds with every call. Engineering teams optimise these decisions for output quality, almost never for cost.",
    boxes: [
      { label: "The Mechanic", text: "If a workflow processes 100,000 requests per day and each request carries an extra 500 tokens of context, that is 50 million tokens per day of cost that may or may not be earning its place. Multiply by your effective rate.", style: "" },
      { label: "Leadership Imperative", text: "Prompt and context design is a financial discipline disguised as a technical one. It deserves the same review rigour as any other recurring operating cost.", style: "imperative" }
    ],
    decisions: [
      {
        n: "07",
        name: "Few-shot vs zero-shot prompting strategy",
        impact: "h",
        impactLabel: "8–20× token cost difference for same output quality",
        scene: "A financial institution uses AI to extract structured risk signals from 10,000 earnings call transcripts per month. Zero-shot: bare instruction, 150 tokens per transcript, ~$1,200/month. Few-shot: same task with 5 demonstration examples included with each request, ~1,200 tokens per transcript, ~$9,600/month. Output quality difference: marginal. The few-shot approach was selected because it is best practice in the engineering literature.",
        bars: [
          { l: "Zero-shot (bare prompt)", v: "~$1,200/mo", p: 12, c: "var(--green)" },
          { l: "Few-shot (5 examples per request)", v: "~$9,600/mo", p: 100, c: "var(--red)" },
          { l: "Fine-tuned (post training)", v: "~$1,400/mo", p: 14, c: "var(--green)" }
        ],
        eng: "Few-shot prompting reliably improves output quality and reduces edge-case failures. It is the recommended practice in most engineering documentation.",
        fin: "Demonstration examples are sent with every single request and billed every single time. At volume, the recurring cost of in-context learning frequently exceeds the one-time cost of fine-tuning a model that learns the task once.",
        timeline: { now: "Quality is reliable. Engineering practice is sound.", later: "Annualised, the few-shot premium pays for fine-tuning the model 5× over." },
        questions: [
          { risk: "On the Volume Threshold", q: "At our actual request volume, what is the annual cost of few-shot prompting versus the one-time cost of fine-tuning the same task?", why: "Frames in-context learning as recurring opex against capex with a clear NPV." },
          { risk: "On the Prompt Library Discipline", q: "Do we have a managed prompt library where token efficiency is reviewed alongside output quality?", why: "Prompts are recurring cost artefacts. They deserve the same governance as other operating commitments." }
        ],
        insight: "Few-shot prompting is correct for low-volume or evolving tasks. For stable, high-volume tasks, fine-tuning almost always wins on NPV — and almost no team runs that calculation.",
        cites: "[A] Few-shot $468/mo vs zero-shot $90/mo for GPT-3.5 Turbo 16K — 5× token cost multiplier — FinOps Foundation, Cost Estimation of AI Workloads.<br/>[B] 'Inputs prompts are billed per token. The longer the prompt, the higher the cost' — FinOps Foundation, How to Forecast AI Services Costs in Cloud."
      },
      {
        n: "08",
        name: "Context window management — what goes into every request",
        impact: "h",
        impactLabel: "Up to 100× proportional cost amplifier",
        scene: "A global law firm deploys an AI contract query assistant. Initial implementation: the full 40-page contract (≈30,000 tokens) is transmitted with every query regardless of which clause is being asked about. Cost per query: $9. After redesign — section-level retrieval — cost per query falls to $0.90. After further refinement (relevant clause only): $0.15. Same query. Same answer. 60× cost differential. Engineering selected the simplest implementation; cost was not on the design review checklist.",
        bars: [
          { l: "Full document (30K tokens)", v: "$9.00/query", p: 100, c: "var(--red)" },
          { l: "Section-level context (3K tokens)", v: "$0.90/query", p: 10, c: "var(--amber)" },
          { l: "Relevant clause only (500 tokens)", v: "$0.15/query", p: 2, c: "var(--green)" }
        ],
        eng: "Sending the full document is the simplest implementation. It eliminates the engineering work of retrieval design and assures that no relevant context is missing.",
        fin: "Every token in the context window is billed at the model's full input rate. At any meaningful query volume, context efficiency is the highest-leverage cost lever in the entire AI stack — frequently larger than model selection itself.",
        timeline: { now: "System works. All context guaranteed available.", later: "Six months in, query volume scales 10× and the workload becomes the largest line item in the AI bill." },
        questions: [
          { risk: "On the Context Discipline", q: "What is the average context size per query, and what is our discipline for keeping it minimised against the quality bar?", why: "Most teams cannot answer this question. The answer is the cost lever." },
          { risk: "On the Retrieval Architecture", q: "Have we evaluated retrieval-augmented generation against full-context approaches for this workload — and what was the cost-quality result?", why: "Retrieval architecture is the standard answer to context bloat. It is rarely chosen at the design stage." }
        ],
        insight: "Context window discipline is the single largest hidden cost lever in production AI. It is invisible to anyone who is not looking at the per-token bill.",
        cites: "[A] Context window cost multiplication — '1 token is about 0.75 words' and all context counts at the applicable token rate — FinOps Foundation, Cost Estimation of AI Workloads.<br/>[A] 'The most heavily-loaded GPT-4 8K cost case scales to over $14,000/month from $90 baseline' — FinOps Foundation, Cost Estimation of AI Workloads."
      },
      {
        n: "09",
        name: "RAG retrieval parameter tuning",
        impact: "m",
        impactLabel: "3–7× cost swing from a single configuration value",
        scene: "A global insurer builds a RAG-based policy query assistant. Retrieval configuration: top 20 policy documents per query — a tutorial default never reviewed. Each document ≈500 tokens. 20 × 500 = 10,000 tokens of retrieved context per query. Monthly cost: $40,000. Reducing retrieval to top 3 with reranking: $6,000/month. Same query precision. Same answer quality. The default value cost the firm $34,000/month for a year before it was reviewed.",
        bars: [
          { l: "20-document retrieval (default)", v: "$40k/mo", p: 100, c: "var(--red)" },
          { l: "10-document retrieval", v: "$20k/mo", p: 50, c: "var(--amber)" },
          { l: "3-document tuned retrieval", v: "$6k/mo", p: 15, c: "var(--green)" }
        ],
        eng: "Retrieval defaults are typically high to ensure quality during development. The engineer's primary risk is missing relevant context — not over-retrieving.",
        fin: "Retrieval parameters are configuration values, not architectural decisions. They are routinely set during prototyping and never revisited — even when scale changes the financial weight of every retrieved document by orders of magnitude.",
        timeline: { now: "Quality verified. Defaults retained. System ships.", later: "Quarterly review: retrieval parameters have not been reviewed since prototype. Volume has grown 8×." },
        questions: [
          { risk: "On the Configuration Review", q: "When were our RAG retrieval parameters last reviewed against current production volume — and what was the financial impact of any change?", why: "The default-value review cycle is where this cost compounds invisibly." },
          { risk: "On the Reranking Investment", q: "Have we invested in reranking to allow tighter top-K parameters — and what is the cost-quality result?", why: "Reranking is the standard cost reduction lever. It is rarely on the engineering roadmap unless explicitly funded." }
        ],
        insight: "RAG configuration is one of the highest-yield, lowest-risk cost optimisations in production AI. It almost never happens by default.",
        cites: "[A] RAG retrieval cost multiplication — top-K parameter directly amplifies context window costs — FinOps Foundation, Cost Estimation of AI Workloads."
      }
    ]
  },

  /* ============ STAGE 4 ============ */
  {
    id: "training",
    num: "04",
    label: "Training & Fine-Tuning",
    title: "Capital investment, or recurring <em>cost in disguise?</em>",
    desc: "General-purpose AI models require investment to behave consistently within your specific business context. This stage is where decisions are most often framed as engineering decisions — and most often have multi-year financial consequences that the engineering frame does not surface.",
    boxes: [
      { label: "The Reality", text: "Training cost is typically 5–15% of full model lifecycle cost. The other 85–95% is operational. Most organisations review only the headline training number.", style: "" },
      { label: "Leadership Imperative", text: "Treat training and fine-tuning decisions as capital investments with NPV calculations. The volume threshold at which fine-tuning beats few-shot prompting is calculable — but rarely calculated.", style: "imperative" }
    ],
    decisions: [
      {
        n: "10",
        name: "Fine-tuning vs prompt engineering — recurring cost vs capital investment",
        impact: "m",
        impactLabel: "Volume-dependent — the NPV calculation determines which is correct",
        scene: "A professional services firm wants its AI proposal writer to produce outputs consistent with proprietary methodology, using precise internal terminology. Option A: embed 2,000-token style guide in every prompt — $900/month at 5,000 queries/month, every month, indefinitely. Option B: fine-tune a model — $12,000 one-time training cost, then $100/month operational. Break-even: month 14. After that, fine-tuning saves $800/month indefinitely. Engineering selects Option A — because it ships in a sprint.",
        bars: [
          { l: "Few-shot at 5K queries/mo", v: "$900/mo", p: 100, c: "var(--amber)" },
          { l: "Fine-tuned at 5K queries/mo", v: "$100/mo", p: 11, c: "var(--green)" },
          { l: "Fine-tune — one-time training", v: "$12k", p: 50, c: "var(--accent)" }
        ],
        eng: "Prompt engineering is fast to deploy, easy to iterate, and zero capital commitment. Fine-tuning requires sustained investment, expertise, and a longer feedback cycle.",
        fin: "Prompt engineering is recurring opex billed per query, forever. Fine-tuning is capital expense that converts a recurring cost into a one-time investment with much lower steady-state run cost. The right choice is volume-dependent and calculable.",
        timeline: { now: "Prompt-engineered solution ships. Quality is acceptable. Velocity is strong.", later: "By month 18, the recurring cost is 8× the alternative one-time investment that was never made." },
        questions: [
          { risk: "On the NPV Discipline", q: "At our query volume, what is the 24-month NPV of the few-shot approach against fine-tuning the same task?", why: "Forces the comparison into the financial frame the decision actually warrants." },
          { risk: "On the Reuse Question", q: "What proportion of our prompt engineering effort is solving the same problem fine-tuning would solve once?", why: "Identifies fine-tuning as a portfolio investment, not a per-workload decision." }
        ],
        insight: "The prompt-engineering versus fine-tuning decision is one of the most common NPV mistakes in enterprise AI. The calculation is not difficult. It is just rarely run.",
        cites: "[A] Training costs 5–15% of full model lifecycle — FinOps Foundation, Cost Estimation of AI Workloads.<br/>[A] Fine-tuning result: 'few-shot gave us comparable performance, but for almost 20% the input price' — FinOps Foundation, Cost Estimation of AI Workloads."
      },
      {
        n: "11",
        name: "Training data quality — the investment that determines everything downstream",
        impact: "h",
        impactLabel: "Data quality determines model quality — without exception",
        scene: "A major retailer trains a product recommendation model on three years of purchase history including the 2020–2021 COVID period, which was never isolated or flagged. The model treats structurally anomalous behaviour (panic-buying, supply-shock substitution) as normal demand signals. Production launch: recommendations are systematically off. The fix requires data re-curation, model re-training, and a delay of 4 months. Retraining cost: $200,000. Engineering hours: substantial. Brand cost during the period of poor recommendations: harder to quantify and significantly larger.",
        bars: [
          { l: "Poor data — rework cost", v: "Highest", p: 100, c: "var(--red)" },
          { l: "Unreviewed available data", v: "Moderate issues", p: 55, c: "var(--amber)" },
          { l: "Curated governed dataset", v: "Strong production quality", p: 15, c: "var(--green)" }
        ],
        eng: "Engineering teams typically optimise the model architecture and training process. Data curation is treated as preliminary work — necessary, but not the engineering challenge.",
        fin: "Bad training data does not just produce bad models. It produces bad models that have to be rebuilt — with the full cost of every downstream decision repeated. Curation is the investment that prevents the largest avoidable cost in the AI lifecycle.",
        timeline: { now: "Available data used. Model trained. Launch hits the planned date.", later: "Quality issues surface in production. Retrain cycle costs as much as the original build." },
        questions: [
          { risk: "On the Curation Investment", q: "What is the documented data preparation discipline for every model we train, and who owns curation as a named function?", why: "Without ownership, curation is everyone's responsibility and no-one's job." },
          { risk: "On the Anomaly Discipline", q: "How does our training data flag and isolate anomalous historical periods so they do not contaminate the learned model?", why: "Most production data quality failures are caused by structural anomalies the team did not flag." }
        ],
        insight: "Data quality is the single largest determinant of total AI lifecycle cost. The investment is upstream; the savings are massive and downstream.",
        cites: "[A] Training costs 5–15% of total lifecycle cost — FinOps Foundation, Cost Estimation of AI Workloads.<br/>[A] 'Data Collection, Data Cleaning and Preprocessing: Ensure your data is clean, which can require domain expertise and significant time investment' — FinOps Foundation, Cost Estimation of AI Workloads."
      },
      {
        n: "12",
        name: "RLHF — the human feedback cost that never appears in the AI budget",
        impact: "h",
        impactLabel: "$30k–$500k+/yr classified in Operations, not AI",
        scene: "A healthcare AI company operates a clinical pathway recommendation system. Twelve specialist clinical contractors review 500 AI-generated recommendations daily, providing corrective guidance to fine-tune the model continuously. Annual contractor cost: $480,000 — classified in Clinical Operations. Total AI lifecycle cost as reported to the board: cloud + licensing only, $300,000. Total real cost: $780,000. The gap is structural — not a reporting error.",
        bars: [
          { l: "Automated evaluation only", v: "$5–10k/yr", p: 5, c: "var(--green)" },
          { l: "Small specialist review team", v: "$50–80k/yr", p: 28, c: "var(--amber)" },
          { l: "Clinical / legal review operation", v: "$200–500k+/yr", p: 100, c: "var(--red)" }
        ],
        eng: "Human feedback dramatically improves model quality, particularly in regulated or specialised domains. The cost is real but is incurred by an operational team, not by the AI engineering function.",
        fin: "RLHF cost is a true cost of running the AI capability — and it almost never appears in the AI budget line. The board sees the cloud cost; the operations P&L sees the contractor cost; no single document brings them together.",
        timeline: { now: "Quality is high. Reviewer team is in place. Programme is delivering.", later: "Fully-loaded cost analysis reveals the AI budget is roughly 60% of the actual run-rate." },
        questions: [
          { risk: "On the Fully-Loaded Number", q: "What is the total cost of human review, evaluation, and feedback associated with each AI workload — across every cost centre that bears the burden?", why: "There is no single number anywhere in your organisation today that contains this. There should be." },
          { risk: "On the Automation Roadmap", q: "What proportion of human review can be progressively replaced with automated evaluation pipelines — and what is on the engineering roadmap to do so?", why: "Automated evaluation is the long-run answer. It requires explicit investment." }
        ],
        insight: "RLHF cost is the most common reason AI costs are systematically understated to leadership. The fix is a single fully-loaded view, owned by Finance.",
        cites: "[A] Reinforcement Learning with Human Feedback: 'May involve substantial human-in-the-loop costs (annotators, evaluators) — sometimes the dominant cost line for high-quality alignment work' — FinOps Foundation, Cost Estimation of AI Workloads."
      }
    ]
  },

  /* ============ STAGE 5 ============ */
  {
    id: "deployment",
    num: "05",
    label: "Deployment Architecture",
    title: "Engineering decisions, multi-year <em>commercial commitments</em>",
    desc: "Deployment architecture is where engineering decisions create financial commitments that persist for years. The team is optimising for performance, latency, and reliability. Each of these decisions also defines the commercial structure of your AI cost — frequently for the lifetime of the workload.",
    boxes: [
      { label: "The Trap", text: "Architecture decisions are framed in technical language — capacity, throughput, redundancy, latency. The financial structure they create is rarely surfaced in the same terms.", style: "" },
      { label: "Leadership Imperative", text: "Deployment architecture decisions deserve a documented financial model. Not a forecast — a model that shows what happens when utilisation, scale, or business criticality changes.", style: "imperative" }
    ],
    decisions: [
      {
        n: "13",
        name: "Per-token billing vs Provisioned Throughput — the capacity commitment",
        impact: "h",
        impactLabel: "Correct choice saves 40–60% · wrong choice compounds waste",
        scene: "A fintech's AI fraud detection processes 2 million transactions/day with consistent, predictable load. Per-token: $0.0006/transaction × 60M/month = $36,000/month. Provisioned Throughput: $20,000/month with no per-call cost. Reservation correctly sized: $16,000/month saving — 44% reduction. The same workload at 50% utilisation: PTU is now cost-neutral and operationally inferior to per-token.",
        bars: [
          { l: "Per-token (variable / low volume)", v: "Optimal flexibility", p: 20, c: "var(--green)" },
          { l: "PTU at 85%+ utilisation", v: "40–60% savings", p: 45, c: "var(--green)" },
          { l: "PTU at 50% utilisation", v: "Near cost-neutral", p: 70, c: "var(--amber)" },
          { l: "PTU at 25% utilisation", v: "Significant waste", p: 100, c: "var(--red)" }
        ],
        eng: "Per-token is operationally simple — pay for what you use. PTU adds capacity-planning overhead that most teams correctly avoid until volume justifies it.",
        fin: "PTU is a capital reservation. It rewards high, steady utilisation and punishes low or variable utilisation. There is no way to dynamically scale provisioned throughput down — once committed, the cost is fixed regardless of usage.",
        timeline: { now: "Choice made based on current load. System ships.", later: "Workload pattern changes — peak season ends, feature flag changes traffic, organisational priority shifts. The reservation does not adjust." },
        questions: [
          { risk: "On the Utilisation Discipline", q: "For every PTU reservation we hold, what is the actual utilisation against the commitment — and what is the financial cost of any utilisation gap?", why: "Reservations are reviewed at procurement, not in production. That is where the waste sits." },
          { risk: "On the Workload Stability", q: "Is the workload pattern that justified the PTU still stable — or has it shifted since the commitment was made?", why: "Stability assumptions decay. The reservation does not." }
        ],
        insight: "PTU is the right answer for high, steady utilisation. It is the wrong answer for everything else — and the difference between the two is usually a quarterly utilisation review the team is not currently running.",
        cites: "[B] 'There is no way to dynamically scale down provisioned throughput' — FinOps Foundation, How to Forecast AI Services Costs in Cloud.<br/>[B] 'Cost per 1,000 tokens purchased will be lower than per-token if utilisation is high' — FinOps Foundation, How to Forecast AI Services Costs in Cloud."
      },
      {
        n: "14",
        name: "Model compression — quantization as a structural cost lever",
        impact: "m",
        impactLabel: "Up to 5× infrastructure reduction · validated for standard NLP tasks",
        scene: "A media group self-hosts a content summarisation model for 400 editorial staff. Configuration: Llama 2 13B at full 16-bit precision on SageMaker 96GB. Monthly cost: $2,552. The ML engineering team has validated 4-bit quantization with 1.5% accuracy reduction on the production task. Quantized configuration runs on a 24GB instance: $547/month. The 4.6× cost reduction sits on the team's backlog as a 'nice to have' optimisation, deprioritised against feature delivery for nine months.",
        bars: [
          { l: "Full 16-bit precision", v: "$2,552/mo", p: 100, c: "var(--red)" },
          { l: "8-bit half-precision", v: "~$1,275/mo", p: 50, c: "var(--amber)" },
          { l: "4-bit quantized", v: "~$547/mo", p: 21, c: "var(--green)" }
        ],
        eng: "Quantization is a model optimisation. It requires evaluation effort to validate quality on the actual workload. It carries a small accuracy cost. There is no engineering reward for taking it on.",
        fin: "Quantization is one of the highest-leverage cost levers in self-hosted deployments — frequently 3–5× infrastructure reduction. It rarely competes successfully against feature delivery in engineering prioritisation, because cost is not on the engineering scorecard.",
        timeline: { now: "Full-precision model deployed. System works.", later: "Backlog ages. Optimisation never reaches the top of the list. Cost compounds." },
        questions: [
          { risk: "On the Backlog", q: "What cost optimisations are currently on engineering backlogs, what is each one worth annually, and what is the documented reason none of them have been delivered?", why: "Most savings live in backlogs. They become real savings only when scheduled with a Finance signature." },
          { risk: "On the Default Discipline", q: "Is quantization evaluated at the architecture stage as a structural decision — or only as an optimisation sprint after deployment?", why: "Architecture-stage decisions deliver. Post-deployment optimisations frequently do not." }
        ],
        insight: "Quantization belongs in the architecture decision, not the optimisation backlog. The structural decision delivers — the optimisation rarely does.",
        cites: "[A] Llama 2 13B: 16-bit ~$2,500/mo → 4-bit ~$500/mo; 70B: $5.7–7.5k/mo → ~$2.5k/mo quantized — FinOps Foundation, Cost Estimation of AI Workloads.<br/>[A] 'Quantization doesn't seem to hurt the performance of the model significantly' — FinOps Foundation, Cost Estimation of AI Workloads."
      },
      {
        n: "15",
        name: "Redundancy architecture — calibrating resilience to business criticality",
        impact: "m",
        impactLabel: "2× cost — justified only where downtime has proportional business consequence",
        scene: "A global enterprise deploys an internal AI knowledge assistant for 1,800 employees. Standard engineering practice: active-active across US-East and EU-West. Total cost: $14,000/month. Reviewed at Q3: the workload is internal-only, downtime represents productivity inconvenience for a few hours, and there is no revenue impact. Standard active-passive configuration would deliver acceptable reliability at $9,000/month. The 'no-incidents' insurance is being paid at 1.5× the necessary rate, indefinitely.",
        bars: [
          { l: "Single region (internal tools)", v: "1× cost", p: 33, c: "var(--green)" },
          { l: "Active-passive (moderate risk)", v: "1.5× cost", p: 50, c: "var(--amber)" },
          { l: "Active-active (revenue-critical AI)", v: "2× cost — justify it", p: 100, c: "var(--red)" }
        ],
        eng: "Standard engineering practice is to deploy production workloads with active-active redundancy by default. There is professional risk in being the engineer who deployed without it. There is no professional reward for right-sizing.",
        fin: "Redundancy is insurance. The premium should be calibrated to the business cost of downtime. For revenue-critical, customer-facing AI: justify the premium. For internal knowledge tools: usually do not.",
        timeline: { now: "Production launches with full redundancy. No-one questions it.", later: "Annual review reveals the redundancy investment exceeds the realistic cost of any downtime event." },
        questions: [
          { risk: "On the Tiering Policy", q: "Do we have a documented redundancy tiering policy by business criticality — and has each AI workload been classified against it?", why: "Without explicit tiering, the default is over-engineering." },
          { risk: "On the Downtime Cost Model", q: "For each redundancy configuration in production, what is the documented cost of the downtime it protects against — and does the protection justify its cost?", why: "Insurance economics applies. The premium has to be justified by the loss it prevents." }
        ],
        insight: "Redundancy is professionally rewarding to over-engineer and financially expensive to over-engineer. The reconciliation is a tiering policy with named criticality levels.",
        cites: "[A] Multi-region redundancy: '2× resource cost for active-active configurations' — FinOps Foundation, Cost Estimation of AI Workloads."
      }
    ]
  },

  /* ============ STAGE 6 ============ */
  {
    id: "scale-ops",
    num: "06",
    label: "Scale & Ops",
    title: "Production deployment is the <em>start</em> of the cost compounding",
    desc: "Production deployment is not the end of the cost decision process — it is the beginning of the compounding phase. Usage scales. Workloads multiply. Adoption spreads. Without explicit governance, costs do not just grow — they compound through entirely new categories that did not exist at the original deployment.",
    boxes: [
      { label: "The Pattern", text: "Most AI overspend is not in the workloads that were carefully designed. It is in what happened to those workloads after deployment, plus what got added without anyone watching.", style: "" },
      { label: "Leadership Imperative", text: "Operational governance — utilisation review, decommission discipline, procurement consolidation — is not an optimisation programme. It is the cost containment discipline without which the AI budget grows indefinitely.", style: "imperative" }
    ],
    decisions: [
      {
        n: "16",
        name: "Always-on deployment vs scheduled intelligent scaling",
        impact: "h",
        impactLabel: "Up to 58% of spend is idle time in business-hours workloads",
        scene: "A professional services firm deploys an AI proposal assistant for 900 consultants across European and North American time zones. Running 24/7 on provisioned GPU infrastructure: $8,200/month. Actual aggregate usage pattern is concentrated 9am–7pm across two regions — a 12-hour effective window with low overnight load. Business-hours scheduling with scale-down windows: $3,400/month. The 58% saving sat unrecognised because no-one classified the workload as schedulable. It was deployed always-on by default.",
        bars: [
          { l: "Always-on (24/7)", v: "100% of cost", p: 100, c: "var(--red)" },
          { l: "Business hours (10hrs/day, weekdays)", v: "42% of cost", p: 42, c: "var(--amber)" },
          { l: "Intelligent peak scaling", v: "25–30% of cost", p: 27, c: "var(--green)" }
        ],
        eng: "Always-on is the simplest deployment model. It eliminates cold-start latency and capacity-planning complexity. Auto-scaling adds engineering work that competes against feature delivery.",
        fin: "Idle infrastructure is a recurring cost that delivers no value. For business-hours workloads, the savings from intelligent scaling typically exceed any other operational optimisation available.",
        timeline: { now: "Always-on deployed. Latency is consistent. Engineering moves to next priority.", later: "Quarterly review reveals 60% idle time. Saving is identified. Implementation sits on backlog." },
        questions: [
          { risk: "On the Workload Classification", q: "Which AI workloads have been classified as schedulable, which as always-on, and what is the documented justification for always-on in each case?", why: "Always-on should be the exception, not the default. It rarely is." },
          { risk: "On the Saving Realisation", q: "What is the gap between identified scheduling savings and savings actually delivered to the budget?", why: "Identification is easy. Realisation requires governance." }
        ],
        insight: "Scheduling is the highest-yield, lowest-effort cost discipline in self-hosted AI. The reason it is not happening is governance, not engineering capability.",
        cites: "[C] 'Once you fix it, it's gone. How do we give developers credit for shift-left activities?' — FinOps practitioner, State of FinOps 2026.<br/>[C] 'Understanding the full scope of AI spending' — top FinOps for AI challenge — State of FinOps 2026."
      },
      {
        n: "17",
        name: "Zombie workloads — AI infrastructure with no current business owner",
        impact: "h",
        impactLabel: "15–30% of AI infrastructure — zero business value",
        scene: "A major financial institution approved 17 AI POC projects across three business lines in 2023. By Q2 2024, five had moved to production. Twelve were 'paused pending review.' A FinOps audit in late 2024 revealed: nine of the paused workloads were still running their training and inference infrastructure, costing approximately $90,000/month in aggregate. Original sponsors had moved roles. No-one had been tasked with decommissioning. Three of the nine workloads had not been queried in over six months.",
        bars: [
          { l: "Active, value-generating workloads", v: "Fully justified", p: 25, c: "var(--green)" },
          { l: "Paused / unclear status", v: "Partially justified", p: 60, c: "var(--amber)" },
          { l: "Zombie — no business activity", v: "100% waste", p: 100, c: "var(--red)" }
        ],
        eng: "Decommissioning is an unrewarding engineering task. Sponsors who would notice the cost have moved on. Without an explicit owner, the workload simply continues to run.",
        fin: "Zombie workloads are pure waste — every dollar is unnecessary. They are also the most political class of cost to remove, because the original sponsor is rarely the person who has to authorise the decommission.",
        timeline: { now: "POC ends. Workload paused. No-one cancels the infrastructure.", later: "12 months later, the workload is in nobody's budget but everyone's bill." },
        questions: [
          { risk: "On the Decommission Discipline", q: "Every AI workload approval — does it carry a named decommission owner and a sunset date as a standard condition?", why: "Without it, the default is indefinite continuation." },
          { risk: "On the Inventory Discipline", q: "Can we produce, today, a complete inventory of every running AI workload with its current business owner and most recent value review?", why: "If the inventory takes more than a week to produce, you have already located a portion of the zombie population." }
        ],
        insight: "The zombie problem is solved at approval, not at audit. A standard sunset clause closes 80% of it before it starts.",
        cites: "[C] 'Understanding the full scope of AI spending' and 'Value derived from spending on AI projects' — top AI FinOps challenges — State of FinOps 2026.<br/>[C] FinOps for AI — #1 future priority — State of FinOps 2026."
      },
      {
        n: "18",
        name: "AI sprawl — ungoverned procurement across the organisation",
        impact: "h",
        impactLabel: "Shadow AI compounds 5–10× faster than governed spend",
        scene: "A management consulting firm's annual technology audit reveals: 280 individual ChatGPT Plus subscriptions ($67,200/year), 34 team GitHub Copilot accounts ($77,520/year), 15 AI writing tools across various marketing teams (~$45,000/year), 8 AI customer support pilots running across business units, and 12 internally-built AI integrations using personal API keys with no central visibility. Total identified AI procurement: ~$340,000. Identified by Procurement before the audit: $120,000. The 65% gap was real spend on real licences that were not visible to anyone holding the AI budget.",
        bars: [
          { l: "Centralised — enterprise licensing", v: "Governed · 35–40% cheaper", p: 20, c: "var(--green)" },
          { l: "Mixed central + some shadow", v: "Partially visible", p: 55, c: "var(--amber)" },
          { l: "Ungoverned sprawl", v: "5–10× hidden cost", p: 100, c: "var(--red)" }
        ],
        eng: "Individual procurement is fast, frictionless, and frequently delivers genuine productivity uplift. Stopping it would be unpopular and counterproductive. Channelling it is the answer.",
        fin: "Sprawl carries three independent costs: the unit-price premium of individual subscriptions versus enterprise licensing, duplicate capability across departments, and the data-governance exposure that does not appear on any P&L until it is a problem.",
        timeline: { now: "Productivity is genuine. Adoption is fast. Costs are scattered.", later: "Annual audit surfaces 5–10× more AI spend than was visible to the budget owner. Now what?" },
        questions: [
          { risk: "On the Visibility", q: "Can we produce, today, a single document showing every AI tool, subscription, and integration in use across the organisation — with cost and business owner?", why: "If not, sprawl is not measured. If not measured, it cannot be governed." },
          { risk: "On the Channelling Strategy", q: "What is our policy for channelling individual demand into enterprise procurement — without removing the productivity that drove the demand?", why: "Banning shadow AI fails. Channelling it works." }
        ],
        insight: "Sprawl is not solved by procurement enforcement. It is solved by making the governed path easier and faster than the shadow path. That is a programme decision, not a procurement memo.",
        cites: "[C] 'Number of organisations indicating data, ML and AI services are a top three spend area' — up significantly year-on-year — FinOps Foundation, State of FinOps 2026.<br/>[C] '46% of organisations report taxonomy and tagging as their top governance challenge' — FinOps Foundation, State of FinOps 2026."
      }
    ]
  }
];
