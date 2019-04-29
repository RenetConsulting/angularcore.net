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

        [HttpGet]
        public IActionResult Get()
        {
            var timerManager1 = new TimerManager(() => this.hub.Clients.All.SendAsync("update", Data.GetData(5)));
            var timerManager2 = new TimerManager(() => this.hub.Clients.All.SendAsync("create", Data.GetData(1)[0]));

            return this.Ok(new { Message = "Request Completed" });
        }
    }

    public class Data
    {
        // TODO: delte it's mock class only for debugging
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

    // TODO: delte it's mock class only for debugging
    public class TimerManager
    {
        private readonly Timer timer;
        private readonly AutoResetEvent autoResetEvent;
        private readonly Action action;

        public TimerManager(Action action)
        {
            this.action = action;
            this.autoResetEvent = new AutoResetEvent(false);
            this.timer = new Timer(this.Execute, this.autoResetEvent, 1000, 2000);
            this.TimerStarted = DateTime.Now;
        }

        public DateTime TimerStarted { get; }

        public void Execute(object stateInfo)
        {
            this.action();

            if ((DateTime.Now - this.TimerStarted).Seconds > 60)
            {
                this.timer.Dispose();
            }
        }
    }
}