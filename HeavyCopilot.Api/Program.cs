using HeavyCopilot.Api.Plugins;
using Microsoft.SemanticKernel;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
        policy.WithOrigins("http://localhost:5173", "https://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod());
});

// Semantic Kernel - Our Own AI + RAG Ready
builder.Services.AddSingleton<Kernel>(sp =>
{
    var kernelBuilder = Kernel.CreateBuilder();
    var config = builder.Configuration.GetSection("AI");

    if (config["Provider"]?.ToLower() == "ollama")
    {
        kernelBuilder.AddOllamaChatCompletion(
            modelId: config["OllamaModel"] ?? "qwen3.5:27b");
    }
    else
    {
        kernelBuilder.AddAzureOpenAIChatCompletion(
            deploymentName: config["AzureDeployment"] ?? "gpt-4o",
            endpoint: config["AzureEndpoint"]!,
            apiKey: config["AzureApiKey"]!);
    }

    // Register Construction Plugin
    kernelBuilder.Plugins.AddFromType<JobDataPlugin>();

    return kernelBuilder.Build();
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors();
app.UseAuthorization();
app.MapControllers();

app.Run();