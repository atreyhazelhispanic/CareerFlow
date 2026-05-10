package com.angelo.careerflow.contact;

import java.time.Instant;
import java.time.LocalDate;

public record ContactResponse(
        String id,
        String applicationId,
        String company,
        String name,
        String email,
        LocalDate lastContactDate,
        LocalDate nextFollowUpDate,
        String notes,
        Instant createdAt
) {
    public static ContactResponse from(Contact contact) {
        return new ContactResponse(
                contact.getId(),
                contact.getApplicationId(),
                contact.getCompany(),
                contact.getName(),
                contact.getEmail(),
                contact.getLastContactDate(),
                contact.getNextFollowUpDate(),
                contact.getNotes(),
                contact.getCreatedAt()
        );
    }
}
