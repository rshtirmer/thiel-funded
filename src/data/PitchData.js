/**
 * PitchData.js
 * 16 satirical pitch scenarios for the Thiel Funded game.
 * Each scenario has a question from Thiel and three tiered answers.
 * 5 are randomly selected per playthrough for replayability.
 */

export const PITCH_SCENARIOS = [
  {
    id: 'monopoly',
    thielQuestion: "So tell me... what's your competitive advantage?",
    answers: [
      {
        text: "We'll build a monopoly so complete that competition becomes a historical footnote.",
        tier: 'great',
        reaction: 'impressed',
        funding: 40,
        thielResponse: "Now THAT is a Zero to One answer. Finally, someone who reads.",
      },
      {
        text: "We have strong unit economics and a solid go-to-market strategy.",
        tier: 'ok',
        reaction: 'neutral',
        funding: 3,
        thielResponse: "I've heard that pitch from 500 founders this week. Next you'll show me a TAM slide.",
      },
      {
        text: "We're going to disrupt incumbents by being 10% cheaper!",
        tier: 'bad',
        reaction: 'disgusted',
        funding: -15,
        thielResponse: "Competition is for losers. You're already thinking like one.",
      },
    ],
  },
  {
    id: 'team',
    thielQuestion: "Why should YOUR team be the one to build this?",
    answers: [
      {
        text: "My co-founder and I met at a classified DARPA project. We can't legally tell you what we built, but it worked.",
        tier: 'great',
        reaction: 'impressed',
        funding: 35,
        thielResponse: "Now we're talking. The best companies are built on secrets.",
      },
      {
        text: "Our team has 40 combined years of experience in the industry.",
        tier: 'ok',
        reaction: 'neutral',
        funding: 2,
        thielResponse: "Experience just means you've spent decades learning the wrong lessons.",
      },
      {
        text: "We all have MBAs from Harvard Business School!",
        tier: 'bad',
        reaction: 'disgusted',
        funding: -20,
        thielResponse: "Harvard Business School. Where original thinking goes to die. Security, please.",
      },
    ],
  },
  {
    id: 'revenue',
    thielQuestion: "What's your revenue model?",
    answers: [
      {
        text: "We charge enterprises 10x what they'd pay a consultant, because our software replaces their entire department. Forever.",
        tier: 'great',
        reaction: 'impressed',
        funding: 45,
        thielResponse: "Replacing humans with software. The highest-margin business in history.",
      },
      {
        text: "SaaS subscription model, $49/month per seat.",
        tier: 'ok',
        reaction: 'neutral',
        funding: 4,
        thielResponse: "SaaS. How refreshingly... 2012.",
      },
      {
        text: "We're focused on growth right now. Revenue can come later!",
        tier: 'bad',
        reaction: 'disgusted',
        funding: -18,
        thielResponse: "That's what every failed startup says before they become a cautionary tweet.",
      },
    ],
  },
  {
    id: 'market_size',
    thielQuestion: "How big is your market?",
    answers: [
      {
        text: "We're creating an entirely new category. There is no market yet -- we ARE the market.",
        tier: 'great',
        reaction: 'impressed',
        funding: 50,
        thielResponse: "Zero to One. Not one to N. You actually understand the book. I'm suspicious you might be smart.",
      },
      {
        text: "The global market is projected to reach $50 billion by 2030.",
        tier: 'ok',
        reaction: 'neutral',
        funding: 3,
        thielResponse: "Ah yes, the 'top-down TAM' approach. My favorite fiction genre.",
      },
      {
        text: "It's a $3 trillion total addressable market. We just need 0.01%!",
        tier: 'bad',
        reaction: 'disgusted',
        funding: -15,
        thielResponse: "The 'we just need 1% of China' argument. Historically, 100% guaranteed to fail.",
      },
    ],
  },
  {
    id: 'tech_vs_sales',
    thielQuestion: "Is your company a technology company or a sales company?",
    answers: [
      {
        text: "Technology so advanced that it sells itself. But we also have a distribution machine that would make the PayPal growth team jealous.",
        tier: 'great',
        reaction: 'impressed',
        funding: 40,
        thielResponse: "A PayPal reference AND distribution awareness? I'm starting to like you.",
      },
      {
        text: "We're primarily a technology company with a dedicated sales team.",
        tier: 'ok',
        reaction: 'neutral',
        funding: 2,
        thielResponse: "That means your tech isn't good enough to sell itself. Concerning.",
      },
      {
        text: "We're all about the hustle! Sales is everything!",
        tier: 'bad',
        reaction: 'disgusted',
        funding: -12,
        thielResponse: "If you need to 'hustle' your product, your product is insufficient.",
      },
    ],
  },
  {
    id: 'regulation',
    thielQuestion: "What about regulation? Aren't you worried about the government?",
    answers: [
      {
        text: "By the time regulators understand what we've built, we'll be too essential to shut down.",
        tier: 'great',
        reaction: 'impressed',
        funding: 35,
        thielResponse: "The Uber playbook. Bold. Reckless. I respect it deeply.",
      },
      {
        text: "We're working closely with regulators to ensure compliance.",
        tier: 'ok',
        reaction: 'neutral',
        funding: 1,
        thielResponse: "Working WITH regulators? That's not a startup, that's a committee.",
      },
      {
        text: "We believe regulation will actually help us by creating barriers to entry.",
        tier: 'bad',
        reaction: 'disgusted',
        funding: -10,
        thielResponse: "You want the government to protect your moat? That's not a business model, it's lobbying.",
      },
    ],
  },
  {
    id: 'exit',
    thielQuestion: "What's your exit strategy?",
    answers: [
      {
        text: "We don't plan to exit. We plan to become so dominant that we reshape the entire industry around us. Permanently.",
        tier: 'great',
        reaction: 'impressed',
        funding: 45,
        thielResponse: "A founder who doesn't want to sell. Music to my ears. Most of your peers are already picking yacht colors.",
      },
      {
        text: "We'd be an attractive acquisition target for several large companies.",
        tier: 'ok',
        reaction: 'neutral',
        funding: 3,
        thielResponse: "So your grand ambition is to be... absorbed. Exciting.",
      },
      {
        text: "IPO within 3 years! We're going to be the next WeWork!",
        tier: 'bad',
        reaction: 'disgusted',
        funding: -20,
        thielResponse: "Did you just use WeWork as a POSITIVE comparison? I need a moment.",
      },
    ],
  },
  {
    id: 'ai_buzzwords',
    thielQuestion: "Tell me about your technology stack.",
    answers: [
      {
        text: "We built proprietary AI that does something no other system can do. I can't tell you the details because it's our definite secret.",
        tier: 'great',
        reaction: 'impressed',
        funding: 38,
        thielResponse: "A secret worth keeping. Every great company is built on a secret no one else believes.",
      },
      {
        text: "We use a fine-tuned GPT model with a vector database and RAG pipeline.",
        tier: 'ok',
        reaction: 'neutral',
        funding: 2,
        thielResponse: "So you're a thin wrapper around someone else's AI. How... derivative.",
      },
      {
        text: "We're building an AI-powered blockchain-enabled Web3 metaverse for the spatial computing era!",
        tier: 'bad',
        reaction: 'disgusted',
        funding: -18,
        thielResponse: "You just said every buzzword from the last 5 years in one sentence. That's not a company, it's a TechCrunch headline generator.",
      },
    ],
  },
  {
    id: 'social_impact',
    thielQuestion: "Is this a 'social impact' company?",
    answers: [
      {
        text: "Impact is a side effect of building something people actually want to pay for. We're a business first, and the impact follows the revenue.",
        tier: 'great',
        reaction: 'impressed',
        funding: 35,
        thielResponse: "Finally. Someone who understands that profitable businesses help more people than nonprofits ever will.",
      },
      {
        text: "We're a B-Corp with a dual mission: profit and purpose.",
        tier: 'ok',
        reaction: 'neutral',
        funding: 1,
        thielResponse: "B-Corp. The participation trophy of corporate structures.",
      },
      {
        text: "We're going to make the world a better place through collaborative wellness AI!",
        tier: 'bad',
        reaction: 'disgusted',
        funding: -15,
        thielResponse: "\"Make the world a better place.\" Every founder in Silicon Valley says that. Most of them are building food delivery apps.",
      },
    ],
  },
  {
    id: 'contrarian',
    thielQuestion: "What important truth do very few people agree with you on?",
    answers: [
      {
        text: "Most 'innovation' in tech is just copying what already works. Real progress requires building something the market doesn't even know it needs.",
        tier: 'great',
        reaction: 'impressed',
        funding: 50,
        thielResponse: "That's literally my favorite interview question and you gave the right answer. I'm impressed and slightly annoyed.",
      },
      {
        text: "I think remote work is actually less productive than being in-office.",
        tier: 'ok',
        reaction: 'neutral',
        funding: 4,
        thielResponse: "That's contrarian, but it's not exactly a business insight. It's an HR opinion.",
      },
      {
        text: "I think we should all just be nicer to each other!",
        tier: 'bad',
        reaction: 'disgusted',
        funding: -12,
        thielResponse: "That's not a contrarian truth, that's a bumper sticker. Please leave my office.",
      },
    ],
  },
  {
    id: 'definite_optimism',
    thielQuestion: "Do you have a specific, concrete plan, or are you just 'iterating'?",
    answers: [
      {
        text: "I have a 10-year roadmap with specific milestones. I know exactly what the world looks like when we win, and I can draw you the map.",
        tier: 'great',
        reaction: 'impressed',
        funding: 42,
        thielResponse: "Definite optimism. The rarest and most valuable mindset in Silicon Valley. You've actually read chapter 6.",
      },
      {
        text: "We're doing agile sprints and pivoting based on customer feedback.",
        tier: 'ok',
        reaction: 'neutral',
        funding: 2,
        thielResponse: "Lean startup methodology. A polite way of saying you don't know what you're building.",
      },
      {
        text: "We're going to figure it out as we go! Move fast and break things!",
        tier: 'bad',
        reaction: 'disgusted',
        funding: -15,
        thielResponse: "Move fast and break things? That's not a strategy, that's what my toddler nephew does.",
      },
    ],
  },
  {
    id: 'distribution',
    thielQuestion: "How will customers discover your product?",
    answers: [
      {
        text: "We've built a viral mechanism where every user involuntarily recruits 3 more users through the core product experience.",
        tier: 'great',
        reaction: 'impressed',
        funding: 38,
        thielResponse: "Viral distribution baked into the product. That's exactly how PayPal conquered eBay. You know your history.",
      },
      {
        text: "Content marketing, SEO, and a strong social media presence.",
        tier: 'ok',
        reaction: 'neutral',
        funding: 3,
        thielResponse: "Ah yes, the 'blog our way to success' strategy. Revolutionary.",
      },
      {
        text: "We're going to go viral on TikTok! Our intern is really good at memes.",
        tier: 'bad',
        reaction: 'disgusted',
        funding: -14,
        thielResponse: "Your distribution strategy depends on an intern's meme skills. I've heard enough.",
      },
    ],
  },
  {
    id: 'ten_x',
    thielQuestion: "Is your product 10x better than what exists today?",
    answers: [
      {
        text: "It's not 10x better. It's in an entirely different dimension. Comparing us to existing solutions is like comparing email to the postal service.",
        tier: 'great',
        reaction: 'impressed',
        funding: 45,
        thielResponse: "A categorical leap, not an incremental improvement. You're speaking my language.",
      },
      {
        text: "Our NPS score is 72, significantly above the industry average of 45.",
        tier: 'ok',
        reaction: 'neutral',
        funding: 2,
        thielResponse: "NPS scores. The vanity metric that keeps consultants employed. Adequate.",
      },
      {
        text: "We're 15% faster and 10% cheaper than the leading competitor!",
        tier: 'bad',
        reaction: 'disgusted',
        funding: -16,
        thielResponse: "15% faster. What a thrilling incrementalist improvement. You're building a vitamin, not a painkiller.",
      },
    ],
  },
  {
    id: 'paypal',
    thielQuestion: "Who do you admire in tech?",
    answers: [
      {
        text: "The PayPal team of the early 2000s. They built a financial weapon of mass adoption and then scattered to conquer six more industries.",
        tier: 'great',
        reaction: 'impressed',
        funding: 48,
        thielResponse: "The PayPal Mafia appreciation alone is worth a term sheet. You clearly have excellent taste in history.",
      },
      {
        text: "Elon Musk and Jeff Bezos. They think big and execute.",
        tier: 'ok',
        reaction: 'neutral',
        funding: 3,
        thielResponse: "Safe answers. You named the two people every interviewer names. How... consensus-driven.",
      },
      {
        text: "I really admire Adam Neumann. His vision for community-driven workspaces was ahead of its time!",
        tier: 'bad',
        reaction: 'disgusted',
        funding: -20,
        thielResponse: "Adam Neumann? The man who turned commercial real estate into a money bonfire? We're done here.",
      },
    ],
  },
  {
    id: 'secret',
    thielQuestion: "What's the secret that makes this company possible?",
    answers: [
      {
        text: "There's a fundamental shift happening that 99% of the market hasn't noticed yet. We're building for the world that's coming, not the world that exists.",
        tier: 'great',
        reaction: 'impressed',
        funding: 42,
        thielResponse: "A genuine secret about the future. This is the foundation of every great company. Continue.",
      },
      {
        text: "We have first-mover advantage in an underserved market segment.",
        tier: 'ok',
        reaction: 'neutral',
        funding: 3,
        thielResponse: "First-mover advantage is mostly a myth. Ask Friendster how being first worked out.",
      },
      {
        text: "Honestly? We're just going to execute better than everyone else!",
        tier: 'bad',
        reaction: 'disgusted',
        funding: -12,
        thielResponse: "\"We'll just execute better.\" The battle cry of every company that fails to differentiate.",
      },
    ],
  },
  {
    id: 'crypto',
    thielQuestion: "What's your take on cryptocurrency and decentralization?",
    answers: [
      {
        text: "Crypto is a tool for building systems that route around institutional incompetence. We use it where it creates real power asymmetry, not as a marketing buzzword.",
        tier: 'great',
        reaction: 'impressed',
        funding: 36,
        thielResponse: "Pragmatic crypto maximalism. You understand the technology serves the mission, not the other way around.",
      },
      {
        text: "We're blockchain-curious but focused on traditional infrastructure for now.",
        tier: 'ok',
        reaction: 'neutral',
        funding: 2,
        thielResponse: "\"Blockchain-curious.\" That's the \"it's complicated\" relationship status of tech.",
      },
      {
        text: "We're launching a utility token! Everyone who buys gets governance rights and a cool NFT avatar!",
        tier: 'bad',
        reaction: 'disgusted',
        funding: -17,
        thielResponse: "A utility token with NFT avatars. Congratulations, you've combined two dead trends into one spectacular failure.",
      },
    ],
  },
];

/**
 * Select N random scenarios from the pool.
 * Uses Fisher-Yates shuffle on a copy.
 */
export function selectScenarios(count = 5) {
  const pool = [...PITCH_SCENARIOS];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, count);
}

/**
 * Shuffle answer order for a scenario (so the great answer is not always first).
 * Returns a new array with shuffled answers, each annotated with originalIndex.
 */
export function shuffleAnswers(answers) {
  const indexed = answers.map((a, i) => ({ ...a, originalIndex: i }));
  for (let i = indexed.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indexed[i], indexed[j]] = [indexed[j], indexed[i]];
  }
  return indexed;
}
