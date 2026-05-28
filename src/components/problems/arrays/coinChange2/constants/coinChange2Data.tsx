// Note: JSX transform is enabled — no explicit React import needed

// ── Presets ──────────────────────────────────────────────────────────────────
export const COIN_CHANGE2_PRESETS = [
  { name: 'Classic — 4 ways (coins=[1,2,5], amt=5)',  coins: [1, 2, 5], amount: 5 },
  { name: 'Small — 4 ways (coins=[1,2,3], amt=4)',   coins: [1, 2, 3], amount: 4 },
  { name: 'Large coins (coins=[2,5,10], amt=10)',    coins: [2, 5, 10], amount: 10 },
  { name: 'Single coin (coins=[3], amt=9)',           coins: [3], amount: 9 },
  { name: 'No way (coins=[2], amt=3)',                coins: [2], amount: 3 },
];

// ── Java code lines ──────────────────────────────────────────────────────────
export const COIN_CHANGE2_JAVA_CODE_LINES = [
  {
    number: 1,
    content: (
      <>
        <span className="syntax-keyword">class</span>{' '}
        <span className="syntax-class">Solution</span> &#123;
      </>
    ),
  },
  {
    number: 2,
    content: (
      <>
        {'  '}
        <span className="syntax-keyword">public int</span>{' '}
        <span className="syntax-method">change</span>(
        <span className="syntax-type">int</span> amount,{' '}
        <span className="syntax-type">int</span>[] coins) &#123;
      </>
    ),
  },
  {
    number: 3,
    content: (
      <>
        {'    '}
        <span className="syntax-type">int</span> n = coins.length;
      </>
    ),
  },
  {
    number: 4,
    content: (
      <>
        {'    '}
        <span className="syntax-type">int</span>[][] dp ={' '}
        <span className="syntax-keyword">new</span>{' '}
        <span className="syntax-type">int</span>[n+<span className="syntax-literal">1</span>]
        [amount+<span className="syntax-literal">1</span>];
      </>
    ),
  },
  {
    number: 5,
    content: (
      <>
        {'    '}
        <span className="syntax-keyword">for</span> (
        <span className="syntax-type">int</span> i ={' '}
        <span className="syntax-literal">0</span>; i &lt;= n; i++) &#123;{' '}
        <span className="syntax-comment">// base: 1 way to make 0</span>
      </>
    ),
  },
  {
    number: 6,
    content: (
      <>
        {'        '}dp[i][<span className="syntax-literal">0</span>] ={' '}
        <span className="syntax-literal">1</span>;
      </>
    ),
  },
  {
    number: 7,
    content: <>{'    '}&#125;</>,
  },
  {
    number: 8,
    content: (
      <>
        {'    '}
        <span className="syntax-keyword">for</span> (
        <span className="syntax-type">int</span> i ={' '}
        <span className="syntax-literal">1</span>; i &lt;= n; i++) &#123;
      </>
    ),
  },
  {
    number: 9,
    content: (
      <>
        {'        '}
        <span className="syntax-keyword">for</span> (
        <span className="syntax-type">int</span> j ={' '}
        <span className="syntax-literal">1</span>; j &lt;= amount; j++) &#123;
      </>
    ),
  },
  {
    number: 10,
    content: (
      <>
        {'            '}dp[i][j] = dp[i-<span className="syntax-literal">1</span>][j];{' '}
        <span className="syntax-comment">// exclude coin</span>
      </>
    ),
  },
  {
    number: 11,
    content: (
      <>
        {'            '}
        <span className="syntax-keyword">if</span> (j &gt;={' '}
        coins[i-<span className="syntax-literal">1</span>]) &#123;
      </>
    ),
  },
  {
    number: 12,
    content: (
      <>
        {'                '}dp[i][j] += dp[i][j - coins[i-
        <span className="syntax-literal">1</span>
        ]];{' '}
        <span className="syntax-comment">// include coin</span>
      </>
    ),
  },
  {
    number: 13,
    content: <>{'            '}&#125;</>,
  },
  {
    number: 14,
    content: <>{'        '}&#125;</>,
  },
  {
    number: 15,
    content: <>{'    '}&#125;</>,
  },
  {
    number: 16,
    content: (
      <>
        {'    '}
        <span className="syntax-keyword">return</span> dp[n][amount];
      </>
    ),
  },
  {
    number: 17,
    content: <>{'  '}&#125;</>,
  },
  {
    number: 18,
    content: <>&#125;</>,
  },
];
