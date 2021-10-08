# Boolean Algebra Simplifier

Boolean Algebra Simplifier is a single-page React application that reduces boolean expressions to their [minimum sum-of-products](https://en.wikipedia.org/wiki/Canonical_normal_form#Non-canonical_PoS_and_SoP_forms) representations; showing each step along the way. It accepts either a boolean algebra expression or a set of [minimum terms](https://en.wikipedia.org/wiki/Canonical_normal_form#Minterms) and ["don't care" terms](https://en.wikipedia.org/wiki/Don%27t-care_term). Both [Quine McCluskey's Algorithm](https://en.wikipedia.org/wiki/Quine%E2%80%93McCluskey_algorithm) and [Petrick's Method](https://en.wikipedia.org/wiki/Petrick%27s_method) are utilized to reduce expressions. The project also depends on my [Earley Parser](https://github.com/Andrew-Miner/Earley-Parser) to parse user input.

Try it out for yourself: https://andrew-miner.github.io/Bool-Simplifier-Website/

This project was first developed in C++ and later rewritten in Javascript in order to be deployed on a live webpage. \
You can find the original C++ repo here: https://github.com/Andrew-Miner/QuineMcCluskeySolver
