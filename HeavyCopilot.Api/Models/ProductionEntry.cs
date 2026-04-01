namespace HeavyCopilot.Api.Models
{
    public class ProductionEntry
    {
        public string JobId { get; set; } = string.Empty;
        public DateTime Date { get; set; }
        public string Crew { get; set; } = string.Empty;
        public string Equipment { get; set; } = string.Empty;
        public decimal PlannedProduction { get; set; }
        public decimal ActualProduction { get; set; }
    }
}
