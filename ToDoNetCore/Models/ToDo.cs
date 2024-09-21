using System;
using System.Collections.Generic;

namespace ToDoNetCore.Models;

public partial class ToDo
{
    public int Id { get; set; }

    public string Title { get; set; } = null!;

    public string Description { get; set; } = null!;

    public string? Status { get; set; }

    public DateTime CreationDate { get; set; }
}
