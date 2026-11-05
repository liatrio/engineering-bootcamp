const rawQuizdown = `

# What is the primary purpose of the Model Context Protocol (MCP)?

1. [ ] To create new AI models with larger context windows
   > MCP is not about creating new AI models but standardizing how existing models interact with data and tools.
1. [x] To standardize how AI applications provide context to Large Language Models
1. [ ] To manage the memory requirements of Large Language Models
   > While context management is part of MCP, its primary purpose is standardization of interactions.
1. [ ] To optimize prompt generation for AI models
   > MCP can help with prompts, but its main purpose is standardizing the entire context exchange system.

# Which of the following is NOT a core component of MCP architecture?

1. [ ] MCP Clients
   > MCP Clients are a core component of the architecture, maintaining connections with servers.
1. [ ] MCP Servers
   > MCP Servers are essential components that expose capabilities through the protocol.
1. [x] MCP Training Pipeline
1. [ ] MCP Hosts
   > MCP Hosts like Claude Desktop or IDEs are fundamental to the architecture.

# In MCP, what are Resources used for?

1. [ ] Processing data and performing calculations
   > This is primarily the role of Tools in MCP.
1. [ ] Executing code and system operations
   > This describes Tools, not Resources.
1. [x] Accessing various types of data such as files, databases, and web APIs
1. [ ] Managing memory allocation for AI models
   > MCP doesn't directly manage internal memory allocation for AI models.

# When creating an MCP client, what transport mechanism is commonly used for local development?

1. [x] stdio (Standard Input/Output)
1. [ ] REST API
   > While HTTP can be used with MCP, stdio is more common for local development.
1. [ ] WebSockets
   > WebSockets aren't the primary transport mechanism in basic MCP implementations.
1. [ ] GraphQL
   > MCP doesn't typically use GraphQL as a transport layer.
`;

export { rawQuizdown }
