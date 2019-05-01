namespace Application.Controllers
{
    using System;
    using System.Collections.Generic;
    using System.Threading;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.AspNetCore.SignalR;

    [Route("api/[controller]")]
    [ApiController]
    public class BlogHubController : ControllerBase
    {
        private readonly IHubContext<BlogHub> hub;

        public BlogHubController(IHubContext<BlogHub> hub)
        {
            this.hub = hub;
        }

        [HttpGet("create")]
        public IActionResult Create()
        {
            this.hub.Clients.All.SendAsync("create", Data.GetData(1)[0]);

            return this.Ok(new { Message = "Request Completed" });
        }

        [HttpGet("update")]
        public IActionResult Update()
        {
            this.hub.Clients.All.SendAsync("update", Data.GetData(1)[0]);

            return this.Ok(new { Message = "Request Completed" });
        }
    }

    public class Data
    {
        // TODO: delte it"s mock class only for debugging
        public static List<BlogModel> GetData(int amount, int last = 0)
        {
            var items = new List<BlogModel> { };
            for (int i = 0; i < amount; i++)
            {
                bool editable = i % 2 == 0;
                var date = DateTime.Now;

                BlogModel model = new BlogModel()
                {
                    BlogId = i + "qq",
                    Title = "Title " + i,
                    Content = "Brave new world " + i,
                    Editable = editable,
                    CreatedBy = editable ? "Bob" : "Mark",
                    CreatedDate = date.AddDays(i)
                };
                items.Add(model);
            }

            return items;
        }
    }

    public class BlogHub : Hub
    {
    }
}