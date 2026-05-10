package com.angelo.careerflow.note;

import com.angelo.careerflow.application.JobApplication;
import jakarta.persistence.*;

import java.time.Instant;

@Entity
@Table(name = "notes")
public class Note {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    private JobApplication application;

    @Column(nullable = false, length = 5000)
    private String content;

    @Column(nullable = false)
    private Instant createdAt = Instant.now();

    protected Note() {
    }

    public Note(JobApplication application, String content) {
        this.application = application;
        this.content = content;
    }

    public String getId() {
        return id;
    }

    public String getApplicationId() {
        return application.getId();
    }

    public String getContent() {
        return content;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }
}