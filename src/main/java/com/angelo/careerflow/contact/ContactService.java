package com.angelo.careerflow.contact;

import com.angelo.careerflow.application.JobApplication;
import com.angelo.careerflow.application.JobApplicationService;
import com.angelo.careerflow.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ContactService {

    private final ContactRepository contactRepository;
    private final JobApplicationService applicationService;

    public ContactService(
            ContactRepository contactRepository,
            JobApplicationService applicationService
    ) {
        this.contactRepository = contactRepository;
        this.applicationService = applicationService;
    }

    public ContactResponse createContact(String applicationId, CreateContactRequest request) {
        JobApplication application = applicationService.getOwnedApplicationEntity(applicationId);
        Contact contact = new Contact(
                application,
                request.name(),
                request.email(),
                request.lastContactDate(),
                request.nextFollowUpDate(),
                request.notes()
        );
        return ContactResponse.from(contactRepository.save(contact));
    }

    @Transactional(readOnly = true)
    public List<ContactResponse> getContacts(String applicationId) {
        applicationService.getOwnedApplicationEntity(applicationId);
        return contactRepository.findAllByApplicationId(applicationId)
                .stream().map(ContactResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public ContactResponse getContact(String applicationId, String contactId) {
        applicationService.getOwnedApplicationEntity(applicationId);
        return contactRepository.findByIdAndApplicationId(contactId, applicationId)
                .map(ContactResponse::from)
                .orElseThrow(() -> new ResourceNotFoundException("Contact not found"));
    }

    public void deleteContact(String applicationId, String contactId) {
        applicationService.getOwnedApplicationEntity(applicationId);
        Contact contact = contactRepository.findByIdAndApplicationId(contactId, applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Contact not found"));
        contactRepository.delete(contact);
    }
}