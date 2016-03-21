# randfunc
Javascript that generates a random n-dimensional algebraic function including symbolic expressions.  
Originally concieved as a quick 2 hour project to make functions I could practice calculus on, turned into a way more complex project to work on while on break.

Builds a tree of dependencies between each variable like so:
```
           u - v
         /
x - y - z 
         \
           w - v
```

At each node, an expression is generated in terms of that node's children utilizing expression tree methodology. 
(eventually) uses Nerdamer to parse, algebraically simplify, and display a nice LaTeX formatted expression on screen.
