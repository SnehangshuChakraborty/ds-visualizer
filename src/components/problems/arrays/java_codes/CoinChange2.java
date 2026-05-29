class Solution {
    public int change(int amount, int[] coins) {
        int n = coins.length;
        int[][] dp = new int[n + 1][amount + 1];
        
        // Base case: There is 1 way to make amount 0 (by picking no coins)
        for (int i = 0; i <= n; i++) {
            dp[i][0] = 1;
        }

        for (int i = 1; i <= n; i++) {
            // Start j from 1 since j = 0 is already handled
            for (int j = 1; j <= amount; j++) {
                dp[i][j] = dp[i - 1][j]; // Exclude the current coin
                
                if (j >= coins[i - 1]) {
                    dp[i][j] += dp[i][j - coins[i - 1]]; // Include the current coin
                }
            }
        } 

        return dp[n][amount];
    }
}
