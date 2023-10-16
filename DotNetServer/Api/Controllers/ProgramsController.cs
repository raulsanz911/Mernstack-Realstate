using System.IO;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using Newtonsoft.Json;
 using System.Text.Json;
using Newtonsoft.Json.Linq;

namespace Api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ProgramsController : ControllerBase
    {
        private readonly HttpClient _httpClient;
        public ProgramsController(IHttpClientFactory httpClientFactory)
        {
            _httpClient = httpClientFactory.CreateClient();
        }
// Private method to load programs from the Omny API
private async Task<List<Program>> LoadPrograms()
{
    string baseUrl = "https://api.omny.fm/orgs/acc8cc57-ff7c-44c5-9bd6-ab0900fbdc43";
    string content = await _httpClient.GetStringAsync($"{baseUrl}/programs");

    var jsonObject = JObject.Parse(content);
    var programs = jsonObject["Programs"]?.Select(p => new Program {
        Id = p["Id"]?.ToString(),
        Name = p["Name"]?.ToString(),
        Description = p["Description"]?.ToString(),
        ArtworkUrl = p["ArtworkUrl"]?.ToString(),
        Author = p["Author"]?.ToString()
    }).ToList();

    return programs;
}
        [HttpGet("")]
 public async Task<IActionResult> GetPrograms()
{
    var programs = await LoadPrograms();
    var dbOutput = new DbOutput { Programs = programs, Clips = new List<Clips>() };
    var json = JsonConvert.SerializeObject(dbOutput);
    var dbFilePath = Path.Combine(Directory.GetCurrentDirectory(), "db.json");
    await System.IO.File.WriteAllTextAsync(dbFilePath, json);
    return Ok(programs);
}

       [HttpGet("{programId}/clips")]
public async Task<IActionResult> GetClipsByProgramId(string programId)
{
     
     string baseUrl = "https://api.omny.fm/orgs/acc8cc57-ff7c-44c5-9bd6-ab0900fbdc43";
    string content = await _httpClient.GetStringAsync($"{baseUrl}/Programs/{programId}/clips");

    var jsonObject = JObject.Parse(content);
    var clips = jsonObject["Clips"]?.Select(c => new Clips {
        Id = c["Id"]?.ToString(),
        Title = c["Title"]?.ToString(),
        Description = c["Description"]?.ToString(),
        AudioUrl = c["AudioUrl"]?.ToString(),
        ImageUrl = c["ImageUrl"]?.ToString(),
        PublishedUtc = DateTime.Parse(c["PublishedUtc"]?.ToString()),
        DurationSeconds = double.Parse(c["DurationSeconds"]?.ToString()),
        ProgramId = programId,
        Favorite = false
    }).ToList();
   var dbOutput = new DbOutput { Programs = await LoadPrograms(), Clips = clips };
    var json = JsonConvert.SerializeObject(dbOutput);
    var dbFilePath = Path.Combine(Directory.GetCurrentDirectory(), "db.json");
    await System.IO.File.WriteAllTextAsync(dbFilePath, json);

    return Ok(content);
}
[HttpPost("{programId}/clips/{clipId}/favorite")]
public async Task<IActionResult> MarkClipAsFavorite(string programId, string clipId)
{
    // Load clips for the specified program
    var clips = await GetClipsByProgramId(programId);

    // Find the clip to mark as favorite and update its 'Favorite' property

    if (clips != null)
    {
        // Update the clip in the database to mark it as favorite
        var dbFilePath = Path.Combine(Directory.GetCurrentDirectory(), "db.json");
        var json = System.IO.File.ReadAllText(dbFilePath);
        var dbOutput = JObject.Parse(json).ToObject<DbOutput>();
        var dbClip = dbOutput.Clips.FirstOrDefault(c => c.Id == clipId);
        if (dbClip != null)
        {
            dbClip.Favorite = true;
            json = JsonConvert.SerializeObject(dbOutput);
            System.IO.File.WriteAllText(dbFilePath, json);
        }

        return Ok(new { success = true });
    }

    return NotFound();
}
  [HttpGet("clips/favorites")]
        public IActionResult GetFavoriteClips()
        {
            var dbFilePath = "db.json";
            var json = System.IO.File.ReadAllText(dbFilePath);
            var dbOutput = JObject.Parse(json).ToObject<DbOutput>();

            var favoriteClips = dbOutput.Clips.Where(c => c.Favorite).ToList();
            return Ok(favoriteClips);
        }
    }

public class Clips
{
    public string? Id { get; set; }
    public string? Title { get; set; }
    public string? Description { get; set; }
    public string? AudioUrl { get; set; }
    public string? ImageUrl { get; set; }
    public DateTime PublishedUtc { get; set; }
    public double DurationSeconds { get; set; }
    public string? ProgramId { get; set; }
    public bool Favorite { get; set; }
}
public class DbOutput
{
    public List<Program> Programs { get; set; } = new List<Program>();
    public List<Clips> Clips { get; set; } = new List<Clips>();
}
 public class Program
    {
        public string? Id { get; set; }
        public string? Name { get; set; }
        public string? Description { get; set; }
        public string? ArtworkUrl { get; set; }
        public string? Author { get; set; }
    }
}


