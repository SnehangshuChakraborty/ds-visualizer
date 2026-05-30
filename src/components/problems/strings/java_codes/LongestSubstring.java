import java.util.*;

class Solution {
    public int lengthOfLongestSubstring(String s) {
        int maxLength = 0;
        int n = s.length();

        int left = 0;
        Set<Character> hashSet = new HashSet<>();

        for (int right = 0; right < n; right++) {
            char rChar = s.charAt(right);

            // Corrected: Shrink from the left until rChar is no longer a duplicate
            while (hashSet.contains(rChar)) {
                hashSet.remove(s.charAt(left));
                left++;
            }

            hashSet.add(rChar);
            int currentLength = right - left + 1;

            maxLength = Math.max(maxLength, currentLength);
        }

        return maxLength;
    }
}
