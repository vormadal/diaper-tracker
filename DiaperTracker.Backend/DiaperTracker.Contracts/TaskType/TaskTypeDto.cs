﻿using System.ComponentModel.DataAnnotations;

namespace DiaperTracker.Contracts.Person;

public class TaskTypeDto
{
    [Required]
    public string Id { get; set; }

    [Required]
    public string DisplayName { get; set; }

    [Required]
    public string Icon { get; set; }

    [Required]
    public string ProjectId { get; set; }
}