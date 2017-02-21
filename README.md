# README #

Very simple primal simplex tableau solver.

### Tableau format ###

```
#!pseudocode
   xb      xn       RHS
||  0  | zj - cj |    z0   ||
-----------------------------
||  I  | B^-1 N  |  B^-1 b ||
```
### Example ###

The formulation

```
#!pseudocode

Min z =  x0 + x1 - 4x2

         x0 + x1 + 2x2 + x3           = 9
         x0 + x1 -  x2      + x4      = 2
        -x0 + x1 +  x2           + x5 = 4

         x0,  x1,   x2,  x3,  x4,  x5 >= 0
```

should be encoded in the tableau
   
```
#!pseudocode

|| -1 -1  4  0  0  0 | 0 ||
||  1  1  2  1  0  0 | 9 ||
||  1  1 -1  0  1  0 | 2 ||
|| -1  1  1  0  0  1 | 4 ||
```


where [3, 4, 5] consists in the initial base.