package com.angelo.careerflow.contact;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ContactRepository extends JpaRepository<Contact, String> {
    List<Contact> findAllByApplicationId(String applicationId);
    Optional<Contact> findByIdAndApplicationId(String id, String applicationId);
}