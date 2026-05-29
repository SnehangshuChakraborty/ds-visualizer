public class Solution {
    public double findMedianSortedArrays(int[] nums1, int[] nums2) {
        if (nums1.length > nums2.length) {
            return findMedianSortedArrays(nums2, nums1); // Swap
        }
        int m = nums1.length, n = nums2.length;
        int low = 0, high = m;

        while (low <= high) {
            int cutA = (low + high) / 2;
            int cutB = (m + n + 1) / 2 - cutA;

            int maxLeftA = (cutA == 0) ? Integer.MIN_VALUE : nums1[cutA - 1];
            int minRightA = (cutA == m) ? Integer.MAX_VALUE : nums1[cutA];
            int maxLeftB = (cutB == 0) ? Integer.MIN_VALUE : nums2[cutB - 1];
            int minRightB = (cutB == n) ? Integer.MAX_VALUE : nums2[cutB];

            if (maxLeftA <= minRightB && maxLeftB <= minRightA) {
                if ((m + n) % 2 == 1) {
                    return Math.max(maxLeftA, maxLeftB);
                } else {
                    return (Math.max(maxLeftA, maxLeftB) + Math.min(minRightA, minRightB)) / 2.0;
                }
            } else if (maxLeftA > minRightB) {
                high = cutA - 1; // Squeeze Left
            } else {
                low = cutA + 1;  // Squeeze Right
            }
        }
        return 0.0;
    }
}
