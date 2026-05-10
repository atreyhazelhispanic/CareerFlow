package com.angelo.careerflow.contact;

import com.angelo.careerflow.application.JobApplication;
import jakarta.persistence.*;

import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(name = "contacts")
public class Contact {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    private JobApplication application;

    @Column(nullable = false)
    private String name;

    private String email;

    private LocalDate lastContactDate;

    private LocalDate nextFollowUpDate;

    @Column(length = 3000)
    private String notes;

    @Column(nullable = false)
    private Instant createdAt = Instant.now();

    protected Contact() {
    }

    public Contact(
            JobApplication application,
            String name,
            String email,
            LocalDate lastContactDate,
            LocalDate nextFollowUpDate,
            String notes
    ) {
        this.application = application;
        this.name = name;
        this.email = email;
        this.lastContactDate = lastContactDate;
        this.nextFollowUpDate = nextFollowUpDate;
        this.notes = notes;
    }

    public String getId() {
        return id;
    }

    public String getApplicationId() {
        return application.getId();
    }

    public String getCompany() {
        return application.getCompany();
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public LocalDate getLastContactDate() {
        return lastContactDate;
    }

    public LocalDate getNextFollowUpDate() {
        return nextFollowUpDate;
    }

    public String getNotes() {
        return notes;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }
}