namespace Application.Business.Models
{
    using System.Collections.Generic;

    public class ErrorListModel
    {
        public ErrorListModel()
        {
            this.Email = new List<string>();

            this.OldPassword = new List<string>();

            this.Password = new List<string>();

            this.ConfirmPassword = new List<string>();
        }

        public List<string> Email { get; set; }

        public List<string> OldPassword { get; set; }

        public List<string> Password { get; set; }

        public List<string> ConfirmPassword { get; set; }
    }
}
