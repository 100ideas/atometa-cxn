# 2020-02-13 The Essence and Origins of Functional Reactive Programming

Conal Elliott
Lambda Jam 2015
https://www.youtube.com/watch?v=j3Q32brCUAI

Functional Reactive Programming (FRP) is now 20 years old. Although originally motivated by interactive 3D computer graphics, FRP is a general paradigm for describing dynamic (time-varying) information. Such information had traditionally been described in software only indirectly, as successive side effects of sequential execution. In contrast, FRP expressions describe entire evolutions of values over time, representing these evolutions directly as first-class values. From the start, FRP has been based on two simple and fundamental principles, namely (a) having a precise and simple denotation and (b) continuous time. The first property, which Peter Landin called “denotative” (and “genuinely functional”), applies across problem domains and ensures a precise, implementation-independent specification, insulated from operational details as found in efficient implementations. As such, denotative systems can be reasoned about practically and rigorously. The second property (temporal continuity) is domain-specific and is crucial for simple composability, natural specification of behavior via integration and differentiation, and adaptively efficient implementations.

Over the last few years, something about FRP has generated a lot of interest among programmers, inspiring several so-called “FRP” systems implemented in various programming languages. Most of these systems, however, lack both of FRP’s fundamental properties. Missing a denotation, they’re defined only in vague and/or operational terms (e.g. “graphs” and “update propagation”). Missing continuous time, they fail to provide temporal modularity (sampling-independence and natural temporal transformability), committing prematurely to sampling rates that may turn out to be too low for accuracy or too high for efficiency. (Discrete notions of imagery have these same drawbacks, remedied by vector graphics and other continuous models.) For the same reason, these systems cannot express behaviors as integrals or derivatives and must instead express explicit approximations, leading to cluttered code with poor quality and/or performance.

In this talk, I’ll share with you the essence of the original (denotative and continuous) FRP. You’ll see the thought processes that led to its design, including the care I took to keep the specification both precise and simple, and hopefully, you’ll get a sense of why you might care. As a more in-depth follow-up, the “Denotational Design” workshop explores how to use denotations to design libraries in general.

Conal Elliott has been working (and playing) in functional programming for more than 30 years. He especially enjoys applying semantic elegance and rigor to library design and optimized implementation. He invented the paradigm now known as “functional reactive programming” in the early 1990s, and then pioneered compilation techniques for high-performance, high-level embedded domain-specific languages, with applications including 2D and 3D computer graphics. The latter work included the first compilation of Haskell programs to GPU code, while maintaining precise and simple semantics and powerful composability, as well a high degree of optimization. Conal earned a BA in math with honors from the College of Creative Studies at UC Santa Barbara in 1982 and a PhD in Computer Science from Carnegie Mellon University in 1990. His latest position was at Tabula Inc, where he worked on chip specification and compiling Haskell to hardware for massively parallel execution until their closure in early 2015. Before Tabula, his positions included Architect at Sun Microsystems and Researcher in the Microsoft Research graphics group. He has also coached couples and led conscious relationship workshops together with his partner Holly Croydon, with whom he now lives on 20 acres in the woods in the California Gold Country.