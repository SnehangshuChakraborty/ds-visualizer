import java.util.LinkedList;
import java.util.Queue;

class Solution {
    public int orangesRotting(int[][] grid) {
        if (grid == null || grid.length == 0) return 0;
        
        int rows = grid.length;
        int cols = grid[0].length;
        Queue<int[]> queue = new LinkedList<>();
        int freshOranges = 0;
        
        // Step 1: Initialize the queue with all rotten oranges and count fresh ones
        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < cols; c++) {
                if (grid[r][c] == 2) {
                    queue.offer(new int[]{r, c});
                } else if (grid[r][c] == 1) {
                    freshOranges++;
                }
            }
        }
        
        // If there are no fresh oranges to begin with, 0 minutes are needed
        if (freshOranges == 0) return 0;
        
        int minutes = 0;
        // Direction vectors for 4-directional movement: Up, Down, Left, Right
        int[][] directions = {{-1, 0}, {1, 0}, {0, -1}, {0, 1}};
        
        // Step 2: Multi-source BFS
        while (!queue.isEmpty()) {
            int size = queue.size();
            boolean rottedInThisRound = false;
            
            for (int i = 0; i < size; i++) {
                int[] point = queue.poll();
                int r = point[0];
                int c = point[1];
                
                for (int[] dir : directions) {
                    int nextR = r + dir[0];
                    int nextC = c + dir[1];
                    
                    // Check boundaries and if the neighboring orange is fresh
                    if (nextR >= 0 && nextR < rows && nextC >= 0 && nextC < cols && grid[nextR][nextC] == 1) {
                        grid[nextR][nextC] = 2; // Rot the fresh orange
                        queue.offer(new int[]{nextR, nextC});
                        freshOranges--;
                        rottedInThisRound = true;
                    }
                }
            }
            
            // Only increment time if at least one fresh orange was infected in this layer
            if (rottedInThisRound) {
                minutes++;
            }
        }
        
        // Step 3: If any fresh oranges are left untouched, return -1
        return freshOranges == 0 ? minutes : -1;
    }
}
