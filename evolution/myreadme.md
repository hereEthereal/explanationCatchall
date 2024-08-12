ideas:

lets start with the same group of creatures and when they have sufficient capabilites to navigate the world lets then indepenently intentionally evolve them into taking different roles, plant like sun gatherers, creatures that feed off plants, predators who feed on those creatures etc.. with help from the AI we can notice new niches to evolve new species.

lets try to follow the actual path of evolution, like whats the simplest biological entity we can evolve. 

--- 
learning catchall

https://www.youtube.com/watch?v=N3tRFayqVtk&t=1029s

Sensory Inputs:

Slr = pheromone gradient left-right
Sfd = pheromone gradient forward
Sg = pheromone density
Age = age
Rnd = random input
Blr = blockage left-right
Osc = oscillator
Bfd = blockage forward
Plr = population gradient left-right
Pop = population density
Pfd = population gradient forward
LPf = population long-range forward
LMy = last movement Y
LBf = blockage long-range forward
LMx = last movement X
BDy = north/south border distance
Gen = genetic similarity of fwd neighbor
BDx = east/west border distance
Lx = east/west world location
BD = nearest border distance
Ly = north/south world location

Claude's proposal for more sensory inputs:

Temperature: Environmental temperature could affect agent behavior and survival.
Resource availability: Sensors for food, water, or other critical resources.
Predator/threat detection: A sensor to detect nearby dangers.
Time of day/light levels: This could influence behavior patterns.
Terrain type: Information about the immediate surroundings (e.g., water, land, rocky).
Health/energy level: An internal sensor for the agent's current condition.
Altitude: For simulations with vertical terrain features.


Here are the action outputs listed in the image:

LPD = set long-probe distance
Kill = kill forward neighbor
OSC = set oscillator period
SG = emit pheromone
Res = set responsiveness
Mfd = move forward
Mrn = move random
Mrv = move reverse
MRL = move left/right (+/-)
MX = move east/west (+/-)
MY = move north/south (+/-)



---


interesting in this presentation he said that 24 genes meant 24 brain connections, i didnt know genes had a 1 to 1 mapping with brain connections

You're right to find that interesting. In typical biological systems, there isn't a direct 1-to-1 mapping between genes and brain connections. This appears to be a simplified model for the purposes of the simulation.

In this artificial life simulation:

World size: 128x128
Population: 3000
Steps/gen: 300
Genome length: 24 genes
Inner neurons: 4
Mutation rate: 0.001
The presenter's statement that 24 genes correspond to 24 brain connections is likely a simplification for the simulation model. In this context, each "gene" might be directly coding for a single neural connection, which allows for a straightforward genetic encoding of the neural network structure.

This is a significant abstraction from biological reality, where:

Genes typically code for proteins, not direct neural connections.
Neural connections are the result of complex developmental processes influenced by multiple genes and environmental factors.
The relationship between genes and neural structures is many-to-many, not one-to-one.
This simplification allows for easier implementation and analysis in the simulation, but it's important to recognize that it's a highly abstracted model of genetics and neurobiology. Such simplifications are common in artificial life and evolutionary computation to make the systems more tractable for study and computation.

Would you like to discuss how this simplified model might affect the simulation outcomes, or explore how it compares to more biologically realistic models?