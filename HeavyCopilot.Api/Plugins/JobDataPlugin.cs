namespace HeavyCopilot.Api.Plugins
{
    using global::HeavyCopilot.Api.Models;
    using Microsoft.SemanticKernel;
    using System.ComponentModel;

 

    public class JobDataPlugin
    {
        private readonly List<Job> _jobs;
        private readonly List<ProductionEntry> _production;

        public JobDataPlugin()
        {
            // Realistic mock HeavyJob data
            _jobs =
        [
            new() { JobId = "JH-2025-001", Name = "IH-10 Highway Widening", Type = "Road Paving", Budget = 2450000, Actual = 2180000, Status = "On Track" },
            new()  { JobId = "JH-2025-002", Name = "Baytown Bridge Replacement", Type = "Bridge", Budget = 1875000, Actual = 2140000, Status = "Over Budget" },
            new()  { JobId = "JH-2025-003", Name = "Clear Lake Sewer Installation", Type = "Pipe", Budget = 980000, Actual = 875000, Status = "On Track" }
        ];

            _production =
        [
            new()  { JobId = "JH-2025-001", Date = DateTime.Today.AddDays(-1), Crew = "Paving Crew A", Equipment = "CAT Paver", PlannedProduction = 1200, ActualProduction = 1350 },
            new()  { JobId = "JH-2025-002", Date = DateTime.Today.AddDays(-2), Crew = "Bridge Crew 2", Equipment = "Crane 45T", PlannedProduction = 80, ActualProduction = 65 },
            new()  { JobId = "JH-2025-003", Date = DateTime.Today.AddDays(-1), Crew = "Pipe Crew B", Equipment = "Excavator 320", PlannedProduction = 450, ActualProduction = 520 }
        ];
        }

        [KernelFunction("GetAllJobsSummary")]
        [Description("Returns summary of all active construction jobs with budget and status")]
        public List<Job> GetAllJobsSummary() => _jobs;

        [KernelFunction("GetJobDetails")]
        [Description("Get full details for a specific job")]
        public Job? GetJobDetails([Description("The Job ID, e.g. JH-2025-001")] string jobId)
            => _jobs.FirstOrDefault(j => j.JobId.Equals(jobId, StringComparison.OrdinalIgnoreCase));

        [KernelFunction("GetOverBudgetJobs")]
        [Description("Returns jobs that are over budget")]
        public List<Job> GetOverBudgetJobs()
            => _jobs.Where(j => j.VariancePercent > 5).ToList();

        [KernelFunction("GetProductionThisWeek")]
        [Description("Returns production entries for a job")]
        public List<ProductionEntry> GetProductionThisWeek([Description("Job ID")] string jobId)
            => _production.Where(p => p.JobId == jobId).ToList();
    }
}
