namespace HeavyCopilot.Api.Controllers
{
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.SemanticKernel;
    using Microsoft.SemanticKernel.ChatCompletion;
    using Microsoft.SemanticKernel.Connectors.OpenAI;

    [ApiController]
    [Route("api/[controller]")]
    public class ChatController : ControllerBase
    {
        private readonly Kernel _kernel;

        public ChatController(Kernel kernel)
        {
            _kernel = kernel;
        }

        [HttpPost]
        public async Task Chat([FromBody] ChatRequest request)
        {
            Response.Headers.Append("Content-Type", "text/event-stream");
            Response.Headers.Append("Cache-Control", "no-cache");

            var chatHistory = new ChatHistory();
            chatHistory.AddSystemMessage(
                "You are HeavyCopilot, an expert AI assistant for HCSS HeavyJob users. " +
                "You help with construction job data, budgets, production tracking, and variances. " +
                "Use tables when presenting numbers. Be professional and precise.");

            foreach (var msg in request.History)
            {
                if (msg.Role == "user")
                    chatHistory.AddUserMessage(msg.Content);
                else if (msg.Role == "assistant")
                    chatHistory.AddAssistantMessage(msg.Content);
            }

            chatHistory.AddUserMessage(request.Message);

            var chatService = _kernel.GetRequiredService<IChatCompletionService>();
            var result = chatService.GetStreamingChatMessageContentsAsync(
                chatHistory,
                executionSettings: new OpenAIPromptExecutionSettings
                {
                    Temperature = 0.7,
                    FunctionChoiceBehavior = FunctionChoiceBehavior.Auto()
                },
                kernel: _kernel
            );

            await foreach (var chunk in result)
            {
                if (!string.IsNullOrWhiteSpace(chunk.Content))
                {
                    await Response.WriteAsync($"data: {chunk.Content}\n\n");
                    await Response.Body.FlushAsync();
                }
            }

            await Response.WriteAsync("data: [DONE]\n\n");
        }
    }

    public class ChatRequest
    {
        public string Message { get; set; } = string.Empty;
        public List<ConversationMessage> History { get; set; } = [];
    }

    public class ConversationMessage
    {
        public string Role { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
    }
}
