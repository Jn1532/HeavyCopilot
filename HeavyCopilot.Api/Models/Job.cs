namespace HeavyCopilot.Api.Models
{
    public class Job
    {
        public string JobId { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty; // Road Paving, Bridge, Pipe
        public decimal Budget { get; set; }
        public decimal Actual { get; set; }
        public decimal VariancePercent => Budget > 0 ? (Actual - Budget) / Budget * 100 : 0;
        public string Status { get; set; } = "In Progress";
    }
}
