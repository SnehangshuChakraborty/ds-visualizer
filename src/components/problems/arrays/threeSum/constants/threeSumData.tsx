// Java Code with custom tags for syntax highlighting
export const JAVA_CODE_LINES = [
  { number: 1, content: <><span className="syntax-keyword">import</span> java.util.*;</> },
  { number: 2, content: "" },
  { number: 3, content: <><span className="syntax-keyword">public class</span> <span className="syntax-class">Solution</span> &#123;</> },
  { number: 4, content: <>    <span className="syntax-keyword">public</span> List&lt;List&lt;<span className="syntax-type">Integer</span>&gt;&gt; <span className="syntax-method">threeSum</span>(<span className="syntax-type">int</span>[] nums) &#123;</> },
  { number: 5, content: <>        List&lt;List&lt;<span className="syntax-type">Integer</span>&gt;&gt; result = <span className="syntax-keyword">new</span> ArrayList&lt;&gt;();</> },
  { number: 6, content: <>        Arrays.<span className="syntax-method">sort</span>(nums); <span className="syntax-comment">// Sort the array</span></> },
  { number: 7, content: "" },
  { number: 8, content: <>        <span className="syntax-keyword">for</span> (<span className="syntax-type">int</span> i = <span className="syntax-literal">0</span>; i &lt; nums.length - <span className="syntax-literal">2</span>; i++) &#123;</> },
  { number: 9, content: <>            <span className="syntax-keyword">if</span> (i &gt; <span className="syntax-literal">0</span> &amp;&amp; nums[i] == nums[i - <span className="syntax-literal">1</span>]) <span className="syntax-keyword">continue</span>; <span className="syntax-comment">// Skip duplicates</span></> },
  { number: 10, content: "" },
  { number: 11, content: <>            <span className="syntax-type">int</span> left = i + <span className="syntax-literal">1</span>;</> },
  { number: 12, content: <>            <span className="syntax-type">int</span> right = nums.length - <span className="syntax-literal">1</span>;</> },
  { number: 13, content: "" },
  { number: 14, content: <>            <span className="syntax-keyword">while</span> (left &lt; right) &#123;</> },
  { number: 15, content: <>                <span className="syntax-type">int</span> sum = nums[i] + nums[left] + nums[right];</> },
  { number: 16, content: "" },
  { number: 17, content: <>                <span className="syntax-keyword">if</span> (sum == <span className="syntax-literal">0</span>) &#123;</> },
  { number: 18, content: <>                    result.add(Arrays.asList(nums[i], nums[left], nums[right]));</> },
  { number: 19, content: <>                    <span className="syntax-keyword">while</span> (left &lt; right &amp;&amp; nums[left] == nums[left + <span className="syntax-literal">1</span>]) left++; <span className="syntax-comment">// Skip duplicates</span></> },
  { number: 20, content: <>                    <span className="syntax-keyword">while</span> (left &lt; right &amp;&amp; nums[right] == nums[right - <span className="syntax-literal">1</span>]) right--; <span className="syntax-comment">// Skip duplicates</span></> },
  { number: 21, content: <>                    left++;</> },
  { number: 22, content: <>                    right--;</> },
  { number: 23, content: <>                &#125; <span className="syntax-keyword">else if</span> (sum &lt; <span className="syntax-literal">0</span>) &#123;</> },
  { number: 24, content: <>                    left++; <span className="syntax-comment">// Sum is too small, move left</span></> },
  { number: 25, content: <>                &#125; <span className="syntax-keyword">else</span> &#123;</> },
  { number: 26, content: <>                    right--; <span className="syntax-comment">// Sum is too large, move right</span></> },
  { number: 27, content: <>                &#125;</> },
  { number: 28, content: <>            &#125;</> },
  { number: 29, content: <>        &#125;</> },
  { number: 30, content: <>        <span className="syntax-keyword">return</span> result;</> },
  { number: 31, content: <>    &#125;</> },
  { number: 32, content: <>&#125;</> }
];

// Boundary condition mnemonic database keyed by Java line number
export const BOUNDARY_CONDITIONS: Record<number, { icon: string; title: string; mnemonic: string; why: string }> = {
  8: {
    icon: '🛑',
    title: 'Anchor Boundary: nums.length - 2',
    mnemonic: "You can't seat a group of 3 if only 2 chairs are left! 🪑🪑",
    why: 'i stops at length-2 because we need at least 2 more elements (left, right) after it to form a triplet.'
  },
  9: {
    icon: '🧬',
    title: 'First-Time Safeguard: i > 0',
    mnemonic: "You can't look over your shoulder if you're the first person in line! 👤",
    why: 'We check i > 0 before accessing nums[i-1]. At i=0 there is no previous element — this prevents an IndexOutOfBounds crash.'
  },
  14: {
    icon: '🪗',
    title: 'Squeeze Guard: left < right',
    mnemonic: 'The Accordion squeezes, but your hands can never touch! 🪗',
    why: 'If left meets right, both pointers reference the same element. A valid triplet needs 3 distinct indices.'
  },
  19: {
    icon: '🔂',
    title: 'Inner Left Dup Guard: left < right',
    mnemonic: 'Double-check your brakes while driving fast! 🛑',
    why: 'While fast-skipping duplicate lefts, left could overshoot past right. The extra left < right check prevents crossing.'
  },
  20: {
    icon: '🔂',
    title: 'Inner Right Dup Guard: left < right',
    mnemonic: 'Double-check your brakes while driving fast! 🛑',
    why: 'While fast-skipping duplicate rights, right could undershoot past left. The extra left < right check prevents crossing.'
  },
};

export const BOUNDARY_LINES = Object.keys(BOUNDARY_CONDITIONS).map(Number);

export const PRESETS = [
  { name: 'Classic (Duplicates & Matches)', array: [-1, 0, 1, 2, -1, -4] },
  { name: 'Zero Dense', array: [-2, 0, 0, 2, 2] },
  { name: 'Multiple Triplets', array: [-1, 2, 1, -4, 2, -1, -1, 0] },
  { name: 'No Triplets', array: [1, 2, 3, 4, 5] }
];
