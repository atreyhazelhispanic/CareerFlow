package com.angelo.careerflow.contact;

import jakarta.validation.constraints.NotBlank;

import java.time.LocalDate;

public record CreateContactRequest(
        @NotBlank String name,
        String email,
        LocalDate lastContactDate,
        LocalDate nextFollowUpDate,
        String notes
) {
}