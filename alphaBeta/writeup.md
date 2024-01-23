# Alpha Beta Pruning

Alpha Beta Pruning is a modification to the minimax algorithm that allows certain paths to be ruled out and never calculated when it is determined they can never be better than a existing optionm, thus decreasing the overall paths that need to be checked, increasing the effeciency of the algorithm.

## How it works

Alpha Beta Pruning works by keeping track of two numbers throughout the recursive decent, alpha and beta. At each point, alpha represent the best possible move for the current player discovered so far, and beta represents the best possible move for the opposite player discovered so far.

If, after exploring one part of a subtree and before exploring the rest, beta is less than or equal to alpha, then the rest of that sub tree can be skipped and considered "pruned".

This is because when `beta <= alpha` it means that the opponent already has an equal or better move than anything that will be the result of the rest of the subtree. Because the next turn is the opponents from the current perspective, they will always choose the existing move. Thus, it is not necesssary to calculate the rest of the subtree.

## Order matters

Alpha Beta pruning is very dependent on the order of exploration. The same tree traversed in a different order may lead to vastly different oppurtunites for pruning.

The optimal order for the most pruning would be where the best moves are explored first.

If a cheaper to calculate hueristic exists, it theoretically could be used to sort the exploration order prior to begining the algorithm.
