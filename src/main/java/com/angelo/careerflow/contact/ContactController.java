package com.angelo.careerflow.contact;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications/{applicationId}/contacts")
public class ContactController {

    private final ContactService contactService;

    public ContactController(ContactService contactService) {
        this.contactService = contactService;
    }

    @GetMapping
    public List<ContactResponse> getContacts(@PathVariable String applicationId) {
        return contactService.getContacts(applicationId);
    }

    @GetMapping("/{contactId}")
    public ContactResponse getContact(
            @PathVariable String applicationId,
            @PathVariable String contactId
    ) {
        return contactService.getContact(applicationId, contactId);
    }

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping
    public ContactResponse createContact(
            @PathVariable String applicationId,
            @Valid @RequestBody CreateContactRequest request
    ) {
        return contactService.createContact(applicationId, request);
    }

    @ResponseStatus(HttpStatus.NO_CONTENT)
    @DeleteMapping("/{contactId}")
    public void deleteContact(
            @PathVariable String applicationId,
            @PathVariable String contactId
    ) {
        contactService.deleteContact(applicationId, contactId);
    }
}