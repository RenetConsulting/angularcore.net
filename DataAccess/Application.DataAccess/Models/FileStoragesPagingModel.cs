namespace Application.DataAccess.Models
{
    using System.Collections.Generic;
    using Application.DataAccess.Entities;

    public class FileStoragesPagingModel
    {
        public List<FileStorage> FileStorages { get; set; }

        public int TotalCount { get; set; }
    }
}
