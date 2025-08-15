# MCP (Model Context Protocol) Integration

The AIRM API supports the Model Context Protocol (MCP), allowing Large Language Models (LLMs) to interact with the API endpoints as tools. This enables LLMs to perform operations like managing clusters, deploying workloads, handling datasets, and more.

## Overview

MCP is a protocol that allows AI assistants to connect to external systems and perform actions on behalf of users. The AIRM API's MCP integration exposes all 56 API endpoints as tools that can be discovered and used by MCP-compatible clients.

**Benefits of MCP Integration:**
- **Natural Language Interface**: Interact with AIRM using conversational AI
- **Automated Workflows**: Let AI assistants handle complex multi-step operations
- **Error Handling**: AI can interpret error responses and suggest fixes
- **Discovery**: AI can explore available resources and capabilities dynamically

## Available Endpoints

The MCP integration automatically exposes all AIRM API endpoints. Key endpoints include:

- **Clusters**: Create, list, and manage GPU clusters
- **Projects**: Manage AI/ML projects and their configurations
- **Workloads**: Deploy and monitor containerized workloads
- **Datasets**: Upload, manage, and download training datasets
- **Models**: Manage AI models and their deployments
- **Users & Organizations**: Handle user management and access control
- **Metrics**: Access GPU utilization and performance metrics

## MCP Endpoints

When the AIRM API is running, the following MCP-specific endpoints are available:

- `GET /mcp` - MCP server information and capabilities
- `POST /mcp/messages/` - MCP message handling for tool execution

## Configuration Examples

### Claude Desktop Configuration

Add the AIRM API as an MCP server in your Claude Desktop configuration:

```json
{
  "mcpServers": {
    "airm-api": {
      "command": "node",
      "args": ["-e", "
        const { spawn } = require('child_process');
        const proc = spawn('curl', [
          '-X', 'POST',
          '-H', 'Content-Type: application/json',
          '-H', 'Authorization: Bearer YOUR_TOKEN_HERE',
          '--data-binary', '@-',
          'https://your-airm-api.example.com/mcp/messages/'
        ], { stdio: ['pipe', 'inherit', 'inherit'] });
        process.stdin.pipe(proc.stdin);
      "]
    }
  }
}
```

### Alternative Configuration (Direct HTTP)

For development or testing, you can configure a direct HTTP connection:

```json
{
  "mcpServers": {
    "airm-local": {
      "command": "mcp-client",
      "args": [
        "--transport", "http",
        "--url", "http://localhost:8001/mcp",
        "--auth-header", "Authorization: Bearer YOUR_DEV_TOKEN"
      ]
    }
  }
}
```

### Python MCP Client Configuration

If using a Python MCP client, you can configure it as follows:

```python
from mcp import Client
import asyncio

async def setup_airm_client():
    client = Client()

    # Configure AIRM API connection
    await client.connect(
        transport_type="http",
        url="https://your-airm-api.example.com/mcp",
        headers={
            "Authorization": "Bearer YOUR_API_TOKEN",
            "Content-Type": "application/json"
        }
    )

    # List available tools
    tools = await client.list_tools()
    print("Available AIRM tools:", tools)

    return client

# Usage example
async def main():
    client = await setup_airm_client()

    # Example: List clusters
    result = await client.call_tool(
        "get_clusters",
        arguments={}
    )
    print("Clusters:", result)

if __name__ == "__main__":
    asyncio.run(main())
```

## Authentication

The MCP integration respects the same authentication and authorization mechanisms as the regular API:

### OAuth2/Keycloak Authentication

For production use, configure OAuth2 authentication:

```bash
# Environment variables for OAuth2
export KEYCLOAK_SERVER_URL="https://your-keycloak.example.com"
export KEYCLOAK_REALM="airm"
export KEYCLOAK_CLIENT_ID="your-client-id"
export KEYCLOAK_CLIENT_SECRET="your-client-secret"
```

### Development Authentication

For local development, you can use the default development credentials:

- Username: `devuser@amd.com`
- Password: `password`
- Client ID: `354a0fa1-35ac-4a6d-9c4d-d661129c2cd0`

## Example Use Cases

### 1. Cluster Management

**User Query:**
> "Can you list all available GPU clusters and their current utilization?"

**AI Response Flow:**
1. Calls `get_clusters` to retrieve cluster list
2. Calls `get_clusters_stats` for utilization metrics
3. Presents formatted summary with recommendations

**Sample AI Output:**
```
I found 3 GPU clusters in your organization:

🖥️ **ml-production** (Healthy)
   - 8x NVIDIA A100 GPUs (6 available, 2 in use)
   - Memory: 640GB total, 480GB available
   - Current utilization: 25%

🖥️ **dev-cluster** (Healthy)
   - 4x NVIDIA V100 GPUs (all available)
   - Memory: 256GB total, 256GB available
   - Current utilization: 0%

🖥️ **training-cluster** (Maintenance)
   - 16x NVIDIA H100 GPUs (unavailable)
   - Status: Scheduled maintenance until 2PM

**Recommendation:** For new training jobs, I suggest using 'dev-cluster' for small experiments or 'ml-production' for larger workloads.
```

### 2. Workload Deployment

**User Query:**
> "Deploy a new PyTorch training workload using the latest PyTorch image on the 'ml-production' cluster with 2 GPUs"

**AI Response Flow:**
1. Validates cluster exists and has capacity (`get_clusters`)
2. Checks user's submittable projects (`get_submittable_projects`)
3. Generates appropriate YAML manifest
4. Submits workload using `submit_workload`
5. Monitors deployment status

**AI-Generated Manifest:**
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pytorch-training-20240127
  labels:
    app: pytorch-training
spec:
  containers:
  - name: trainer
    image: pytorch/pytorch:2.1.0-cuda11.8-cudnn8-devel
    resources:
      requests:
        nvidia.com/gpu: 2
        memory: 16Gi
        cpu: 4
      limits:
        nvidia.com/gpu: 2
        memory: 32Gi
        cpu: 8
    env:
    - name: CUDA_VISIBLE_DEVICES
      value: "0,1"
    volumeMounts:
    - name: shared-storage
      mountPath: /workspace
  volumes:
  - name: shared-storage
    persistentVolumeClaim:
      claimName: shared-pvc
  restartPolicy: Never
```

### 3. Dataset Management with Workflow

**User Query:**
> "Upload my training dataset from local files and create a new dataset called 'image-classification-v2'"

**AI Response Flow:**
1. Validates project access and cluster health
2. Guides user through file upload process
3. Creates dataset with proper metadata
4. Suggests next steps for model training

**Interactive Flow:**
```
AI: I'll help you upload your dataset. First, let me check your project access...

✅ Project access confirmed: 'computer-vision-project'
✅ Cluster 'ml-production' is healthy and ready

Please provide your JSONL dataset file. The file should contain your training examples in JSON Lines format.

User: [uploads file: image_data.jsonl]

AI: Perfect! I'm uploading your dataset...

✅ Dataset 'image-classification-v2' created successfully
   - Size: 125.3 MB
   - Type: training
   - Location: computer-vision-project/datasets/image-classification-v2.jsonl
   - Records: 50,000 training examples

**Next Steps:**
1. Create a model: Use 'create_model' to register your base model
2. Start training: Submit a training workload with this dataset
3. Monitor progress: Check workload status and metrics

Would you like me to help with any of these next steps?
```

### 4. Advanced Project Administration

**User Query:**
> "Create a new project called 'computer-vision' with a dedicated GPU quota and add users alice@company.com and bob@company.com as members"

**AI Response Flow:**
1. Creates project with proper configuration
2. Sets up resource quotas based on requirements
3. Adds users with appropriate roles
4. Configures cluster access and permissions

**Detailed Workflow:**
```
AI: I'll create the 'computer-vision' project with proper setup. Let me handle this step by step:

📋 **Step 1: Creating Project**
✅ Project 'computer-vision' created successfully
   - ID: proj_cv_20240127_001
   - Cluster: ml-production
   - Status: Active

📋 **Step 2: Setting Up GPU Quota**
✅ Dedicated quota allocated:
   - GPUs: 4x NVIDIA A100 (reserved)
   - Memory: 320GB
   - Storage: 1TB
   - CPU: 32 cores

📋 **Step 3: Adding Team Members**
✅ alice@company.com added as Project Member
✅ bob@company.com added as Project Member

📋 **Step 4: Configuring Access**
✅ Cluster access permissions configured
✅ Dataset storage buckets created
✅ Monitoring and logging enabled

**Project Summary:**
- Name: computer-vision
- Members: 3 (including you as admin)
- Resources: 4 GPUs, 320GB RAM, 1TB storage
- Ready for workload deployment

The project is now ready for AI/ML workloads. Team members can submit training jobs, manage datasets, and deploy models.

**Suggested Next Steps:**
1. Upload initial datasets for the team
2. Set up shared model repositories
3. Create development workspaces for team collaboration
```

## Tool Capabilities

The MCP integration automatically exposes the following types of operations as tools:

| Operation Type | Examples |
|---------------|----------|
| **CRUD Operations** | Create, read, update, delete resources |
| **File Operations** | Upload/download datasets and models |
| **Deployment Actions** | Deploy workloads, start/stop services |
| **Monitoring** | Fetch metrics, check resource utilization |
| **User Management** | Invite users, assign roles, manage permissions |

## Security Considerations

1. **Token Security**: Always use secure token storage and rotation
2. **Scope Limitation**: Configure clients with minimal required permissions
3. **Network Security**: Use HTTPS in production environments
4. **Rate Limiting**: Be aware of API rate limits when using automated tools

## Best Practices for LLM Integration

### 1. Provide Context in Conversations

When interacting with AI assistants, provide relevant context:

**Good:**
> "I need to deploy a PyTorch training job for image classification. The model needs 2 GPUs and will train for about 4 hours. I'm working on the 'computer-vision' project."

**Better:**
> "Deploy a PyTorch training workload for image classification:
> - Project: computer-vision
> - Dataset: image-classification-v2 (already uploaded)
> - Resources: 2x A100 GPUs, 16GB RAM
> - Estimated duration: 4 hours
> - Base image: pytorch/pytorch:2.1.0-cuda11.8-cudnn8-devel"

### 2. Use Iterative Workflows

Break complex operations into steps:

```
1. "First, show me available clusters and their current utilization"
2. "Create a new project called 'nlp-research' on the ml-production cluster"
3. "Set up a GPU quota of 4 A100s for this project"
4. "Add team members: researcher1@company.com, researcher2@company.com"
5. "Upload the training dataset from my local file"
```

### 3. Leverage AI for Error Resolution

When errors occur, let the AI help diagnose and fix issues:

```
User: "My workload submission failed"

AI: Let me check the error details and help troubleshoot:

1. First, I'll check your project quotas and cluster health
2. Then examine the workload manifest for issues
3. Verify resource availability and constraints
4. Suggest fixes or alternative approaches

[AI performs diagnostic steps and provides specific recommendations]
```

### 4. Monitor and Optimize

Use AI for ongoing monitoring and optimization:

```
"Check the status of all my running workloads and suggest any optimizations"
"Analyze GPU utilization across projects and recommend resource reallocation"
"Identify idle resources and suggest cost-saving measures"
```

## Troubleshooting

### Common Issues

**Connection Refused**
```bash
# Check if AIRM API is running
curl http://localhost:8001/mcp

# Expected response: MCP server information
{
  "name": "airm-api",
  "version": "1.0.0",
  "capabilities": {
    "tools": true,
    "prompts": false,
    "resources": false
  }
}
```

**Authentication Errors**
```bash
# Verify token validity
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:8001/v1/health

# Check token permissions
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:8001/v1/projects/submittable
```

**MCP Endpoint Not Found**
- Ensure you're using AIRM API version with MCP support (check `/mcp` endpoint)
- Verify fastapi-mcp package is installed: `pip list | grep fastapi-mcp`
- Check application logs for MCP initialization errors

**Tool Discovery Issues**
```bash
# Test tool listing via MCP endpoint
curl -X POST http://localhost:8001/mcp/messages/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"method": "tools/list", "params": {}}'
```

**Quota and Permission Errors**
Common issues when AI assistants can't perform operations:
- Verify project membership: Use `get_submittable_projects` to check access
- Check cluster quotas: Use `get_clusters` to verify resource availability
- Validate cluster health: Ensure target cluster status is "healthy"
- Review user roles: Platform admin vs. project member permissions

### Debug Mode

Enable comprehensive debugging for troubleshooting:

**Python MCP Client:**
```python
import logging
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

# Also enable httpx debugging for HTTP requests
logging.getLogger("httpx").setLevel(logging.DEBUG)
```

**Claude Desktop Configuration with Debug:**
```json
{
  "mcpServers": {
    "airm-api-debug": {
      "command": "node",
      "args": ["-e", "
        const { spawn } = require('child_process');
        const proc = spawn('curl', [
          '-v',  // Enable verbose output
          '-X', 'POST',
          '-H', 'Content-Type: application/json',
          '-H', 'Authorization: Bearer YOUR_TOKEN_HERE',
          '--data-binary', '@-',
          'https://your-airm-api.example.com/mcp/messages/'
        ], { stdio: ['pipe', 'inherit', 'inherit'] });
        process.stdin.pipe(proc.stdin);
      "],
      "env": {
        "DEBUG": "1"
      }
    }
  }
}
```

### Performance Optimization

**For Large-Scale Operations:**
- Use batch operations when available (e.g., bulk user management)
- Cache cluster and project information to reduce API calls
- Implement proper error handling and retries for transient failures

**For Real-Time Monitoring:**
- Use streaming endpoints where available
- Implement proper polling intervals for status checks
- Cache frequently accessed metadata (cluster specs, project lists)

## API Documentation

For complete API endpoint documentation, visit:
- Swagger UI: `http://localhost:8001/docs`
- ReDoc: `http://localhost:8001/redoc`

## Support

For MCP integration support:
1. Check the AIRM API logs for error messages
2. Verify your authentication credentials
3. Ensure network connectivity to the API endpoint
4. Consult the MCP client documentation for your specific client implementation
